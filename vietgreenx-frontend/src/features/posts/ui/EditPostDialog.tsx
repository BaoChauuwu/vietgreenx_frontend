"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import type { Post, PostContentCategory } from "@/entities/post";
import { getInitials } from "@/entities/user";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { useGuardedSubmit } from "@/shared/lib/use-guarded-submit";
import { resolveMediaUrl } from "@/shared/lib/resolve-media-url";
import { toastService } from "@/shared/lib/toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { GuardedForm } from "@/shared/ui/guarded-form";
import { SubmitButton } from "@/shared/ui/submit-button";

import { useUpdatePost } from "../api/post.queries";
import { exceedsHashtagLimit } from "../lib/parse-body-hashtags";
import { postTagsEqual, postTagsFromPost } from "../lib/post-tags";
import { createEditPostBodySchema, type EditPostBodyInput, type PostTagInput } from "../model/post-input.schema";
import { getPostsCopy } from "../posts.constants";
import { PostComposerMoreMenu } from "./PostComposerMoreMenu";
import { PostComposerTextarea } from "./PostComposerTextarea";
import { PostTagAttachToolbar } from "./PostTagAttachToolbar";
import { PostTagEditor } from "./PostTagEditor";

interface EditPostDialogProps {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale?: AppLocale;
}

export function EditPostDialog({
  post,
  open,
  onOpenChange,
  locale = getClientLocale(),
}: EditPostDialogProps) {
  const copy = getPostsCopy(locale);
  const editCopy = copy.editDialog;
  const { mutate, isPending } = useUpdatePost();

  const avatarSrc = resolveMediaUrl(post.author.avatarUrl);
  const imageSrc = resolveMediaUrl(post.media[0]?.cdnUrl);

  const initialTags = useMemo(() => postTagsFromPost(post.tags ?? []), [post.tags]);
  const initialCategory = (post.category ?? undefined) as PostContentCategory | undefined;

  const [tags, setTags] = useState<PostTagInput[]>(initialTags);
  const [contentCategory, setContentCategory] = useState<PostContentCategory | undefined>(
    initialCategory,
  );

  const editBodySchema = useMemo(() => createEditPostBodySchema(locale), [locale]);

  const form = useForm<EditPostBodyInput>({
    resolver: zodResolver(editBodySchema),
    defaultValues: { body: post.body ?? "", category: initialCategory as PostContentCategory | undefined },
  });

  const tagsChanged = !postTagsEqual(tags, initialTags);
  const categoryChanged = contentCategory !== initialCategory;
  const isDirty = form.formState.isDirty || tagsChanged || categoryChanged;

  const { guardFormEvent, release, isSubmitting, isDisabled } = useGuardedSubmit({
    isPending,
    enabled: isDirty,
  });

  useEffect(() => {
    if (open) {
      const nextTags = postTagsFromPost(post.tags ?? []);
      setTags(nextTags);
      setContentCategory((post.category ?? undefined) as PostContentCategory | undefined);
      form.reset({ body: post.body ?? "", category: (post.category ?? undefined) as PostContentCategory | undefined });
      window.setTimeout(() => form.setFocus("body"), 0);
    }
  }, [open, post.body, post.category, post.tags, form]);

  const onSubmit = guardFormEvent(
    form.handleSubmit(
      (data) => {
        const body = data.body.trim();
        if (!body && post.media.length === 0) {
          toastService.error(editCopy.empty);
          release();
          return;
        }
        if (exceedsHashtagLimit(body)) {
          toastService.error(copy.hashtags.limitExceeded);
          release();
          return;
        }

        mutate(
          {
            id: post.id,
            body,
            ...(tagsChanged ? { tags } : {}),
            ...(categoryChanged ? { category: contentCategory } : {}),
          },
          {
            onSuccess: () => onOpenChange(false),
            onSettled: () => release(),
          },
        );
      },
      () => release(),
    ),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="gap-0 overflow-hidden p-0 sm:max-w-[520px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="border-b border-border px-12 py-4 text-center sm:px-14">
          <DialogTitle className="text-base font-semibold">{editCopy.title}</DialogTitle>
        </DialogHeader>

        <GuardedForm onSubmit={onSubmit} isSubmitting={isSubmitting} className="flex flex-col">
          <div className="max-h-[min(70vh,640px)] space-y-4 overflow-y-auto px-4 pt-4 sm:px-5">
            <div className="flex items-center gap-3">
              <Avatar className="size-10 shrink-0">
                {avatarSrc && <AvatarImage src={avatarSrc} alt={post.author.displayName} />}
                <AvatarFallback className="bg-primary/10 text-sm text-primary">
                  {getInitials(post.author.displayName)}
                </AvatarFallback>
              </Avatar>
              <p className="truncate font-semibold leading-tight">{post.author.displayName}</p>
            </div>

            <Controller
              name="body"
              control={form.control}
              render={({ field }) => (
                <PostComposerTextarea
                  id={`edit-post-body-${post.id}`}
                  rows={4}
                  aria-label={editCopy.bodyLabel}
                  placeholder={copy.composer.placeholder}
                  className="min-h-[96px] resize-none leading-relaxed"
                  locale={locale}
                  disabled={isSubmitting}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  ref={field.ref}
                />
              )}
            />
            {form.formState.errors.body && (
              <p className="text-sm text-destructive">{form.formState.errors.body.message}</p>
            )}

            {imageSrc && (
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-border bg-primary-50/40">
                <Image src={imageSrc} alt="" fill sizes="480px" className="object-cover" />
              </div>
            )}

            <PostTagEditor
              tags={tags}
              onChange={setTags}
              locale={locale}
              disabled={isSubmitting}
              hideToolbar
            />

            <div className="flex flex-wrap items-center gap-0.5">
              <PostTagAttachToolbar
                tags={tags}
                onChange={setTags}
                locale={locale}
                disabled={isSubmitting}
              />
              <PostComposerMoreMenu
                value={contentCategory}
                onValueChange={setContentCategory}
                locale={locale}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="mt-4 border-t border-border px-4 pb-4 pt-4 sm:px-5">
            <SubmitButton
              isSubmitting={isSubmitting}
              disabled={isDisabled}
              loadingLabel={editCopy.saving}
              size="lg"
              className="h-11 w-full font-semibold"
            >
              {editCopy.save}
            </SubmitButton>
          </div>
        </GuardedForm>
      </DialogContent>
    </Dialog>
  );
}
