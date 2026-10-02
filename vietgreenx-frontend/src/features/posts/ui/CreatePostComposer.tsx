"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Package, QrCode, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import type { PostContentCategory } from "@/entities/post";
import { getInitials } from "@/entities/user";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { cn } from "@/shared/lib/cn";
import { useGuardedSubmit } from "@/shared/lib/use-guarded-submit";
import { resolveMediaUrl } from "@/shared/lib/resolve-media-url";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import { GuardedForm } from "@/shared/ui/guarded-form";
import { SubmitButton } from "@/shared/ui/submit-button";
import { toastService } from "@/shared/lib/toast";

import { useCreatePost } from "../api/post.queries";
import {
  createPostComposerSchema,
  isAllowedPostImage,
  POST_IMAGE_ACCEPT,
  POST_IMAGE_MAX_BYTES,
  type CreatePostComposerInput,
  type PostTagInput,
} from "../model/post-input.schema";
import { exceedsHashtagLimit } from "../lib/parse-body-hashtags";
import { getPostsCopy } from "../posts.constants";
import { PostComposerTextarea } from "./PostComposerTextarea";
import { PostTagAttachToolbar } from "./PostTagAttachToolbar";
import { PostTagEditor } from "./PostTagEditor";

interface CreatePostComposerProps {
  locale?: AppLocale;
  displayName: string;
  avatarUrl?: string | null;
}

export function CreatePostComposer({
  locale = getClientLocale(),
  displayName,
  avatarUrl,
}: CreatePostComposerProps) {
  const postsCopy = getPostsCopy(locale);
  const copy = postsCopy.composer;
  const categoryCopy = postsCopy.postContentCategory;
  const { mutate, isPending } = useCreatePost();
  const { guardFormEvent, release, isSubmitting } = useGuardedSubmit({ isPending });

  const [expanded, setExpanded] = useState(false);
  const [showTagToolbar, setShowTagToolbar] = useState(false);
  const [imageFile, setImageFile] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [tags, setTags] = useState<PostTagInput[]>([]);
  const [contentCategory, setContentCategory] = useState<PostContentCategory | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const composerSchema = useMemo(() => createPostComposerSchema(locale), [locale]);

  const form = useForm<CreatePostComposerInput>({
    resolver: zodResolver(composerSchema),
    defaultValues: { body: "" },
  });

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    if (expanded) form.setFocus("body");
  }, [expanded, form]);

  useEffect(() => {
    const handler = () => {
      setExpanded(true);
      window.setTimeout(() => form.setFocus("body"), 50);
    };
    window.addEventListener("feed:open-composer", handler);
    return () => window.removeEventListener("feed:open-composer", handler);
  }, [form]);

  const clearImage = () => {
    setImageFile(undefined);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return undefined;
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetComposer = () => {
    form.reset({ body: "", category: undefined });
    clearImage();
    setTags([]);
    setContentCategory(undefined);
    setExpanded(false);
    setShowTagToolbar(false);
  };

  const handleImagePick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!isAllowedPostImage(file)) {
      toastService.error(copy.imageInvalidType);
      return;
    }
    if (file.size > POST_IMAGE_MAX_BYTES) {
      toastService.error(copy.imageTooLarge);
      return;
    }

    setImageFile(file);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setExpanded(true);
  };

  const onSubmit = guardFormEvent(
    form.handleSubmit(
      (data) => {
        const body = data.body.trim();
        if (!body && !imageFile) {
          toastService.error(copy.empty);
          release();
          return;
        }
        if (exceedsHashtagLimit(body)) {
          toastService.error(postsCopy.hashtags.limitExceeded);
          release();
          return;
        }

        mutate(
          {
            body: body || undefined,
            imageFile,
            tags: tags.length > 0 ? tags : undefined,
            category: contentCategory,
          },
          {
            onSuccess: () => resetComposer(),
            onSettled: () => release(),
          },
        );
      },
      () => release(),
    ),
  );

  const avatarSrc = resolveMediaUrl(avatarUrl);

  return (
    <ElevatedCard id="feed-composer" className="overflow-hidden" data-tour="tour-composer">
      <GuardedForm onSubmit={onSubmit} isSubmitting={isSubmitting} className="p-3 sm:p-4">
        <div className="flex gap-2.5">
          <Avatar className="size-10 shrink-0">
            {avatarSrc && <AvatarImage src={avatarSrc} alt={displayName} />}
            <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1 space-y-3">
            {!expanded ? (
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="flex h-10 w-full items-center rounded-lg border border-primary/10 bg-primary-50 px-4 text-left text-sm text-muted-foreground transition-colors hover:bg-primary-100/60"
              >
                {copy.placeholder}
              </button>
            ) : (
              <Controller
                name="body"
                control={form.control}
                render={({ field }) => (
                  <PostComposerTextarea
                    rows={3}
                    placeholder={copy.placeholder}
                    className="min-h-[88px] resize-none rounded-xl border-border/80 bg-muted/20 leading-relaxed focus-visible:ring-primary/30"
                    locale={locale}
                    disabled={isSubmitting}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    ref={field.ref}
                  />
                )}
              />
            )}

            {form.formState.errors.body && (
              <p className="text-sm text-destructive">{form.formState.errors.body.message}</p>
            )}

            {expanded && (tags.length > 0 || contentCategory) ? (
              <div className="space-y-2">
                <PostTagEditor
                  tags={tags}
                  onChange={setTags}
                  locale={locale}
                  disabled={isSubmitting}
                  hideToolbar
                />
                {contentCategory ? (
                  <p className="text-xs text-muted-foreground">
                    {copy.contentCategory}:{" "}
                    <span className="font-medium text-foreground/80">
                      {categoryCopy[contentCategory]}
                    </span>
                  </p>
                ) : null}
              </div>
            ) : null}

            {previewUrl && (
              <div className="relative overflow-hidden rounded-xl border border-border/80 bg-muted/20">
                <div className="relative flex w-full justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="" className="max-h-[600px] w-full object-contain" />
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 top-2 size-8 rounded-full border border-border bg-background/95 shadow-sm hover:bg-muted"
                  onClick={clearImage}
                  disabled={isSubmitting}
                  aria-label={copy.removeImage}
                >
                  <X className="size-4" />
                </Button>
              </div>
            )}

            {expanded && (
              <div className="flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={resetComposer}
                  disabled={isSubmitting}
                >
                  {copy.cancel}
                </Button>
                <SubmitButton
                  isSubmitting={isSubmitting}
                  size="default"
                  loadingLabel={copy.submitting}
                  className="min-w-[5.5rem] px-5"
                >
                  {copy.submit}
                </SubmitButton>
              </div>
            )}
          </div>
        </div>

        {(showTagToolbar || tags.length > 0) && (
          <div className="mt-2.5 border-t border-border pt-2.5">
            <PostTagAttachToolbar
              tags={tags}
              onChange={setTags}
              locale={locale}
              disabled={isSubmitting}
            />
          </div>
        )}

        {/* 3-column action bar */}
        <div className="mt-6 border-t border-border px-0 pt-3">
          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 text-muted-foreground hover:border-blue-300 hover:text-foreground sm:h-11"
              onClick={() => {
                setExpanded(true);
                fileInputRef.current?.click();
              }}
              disabled={isSubmitting}
            >
              <ImageIcon className="size-4 shrink-0 text-blue-500" />
              <span className="hidden text-xs font-medium sm:inline sm:text-sm">{copy.photo}</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className={cn(
                "gap-1.5 text-muted-foreground hover:border-primary/40 hover:text-foreground sm:h-11",
                (showTagToolbar || tags.length > 0) && "border-primary/40 text-primary",
              )}
              onClick={() => {
                setExpanded(true);
                setShowTagToolbar((v) => !v);
              }}
              disabled={isSubmitting}
            >
              <Package className="size-4 shrink-0 text-primary" />
              <span className="hidden text-xs font-medium sm:inline sm:text-sm">
                {copy.greenProfile}
              </span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 text-muted-foreground opacity-50 sm:h-11"
              disabled
            >
              <QrCode className="size-4 shrink-0 text-tertiary" />
              <span className="hidden text-xs font-medium sm:inline sm:text-sm">
                {copy.marketplace}
              </span>
            </Button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={POST_IMAGE_ACCEPT}
          className="hidden"
          onChange={handleImagePick}
        />
      </GuardedForm>
    </ElevatedCard>
  );
}
