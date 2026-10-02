"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { getInitials } from "@/entities/user";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { resolveMediaUrl } from "@/shared/lib/resolve-media-url";
import { useGuardedSubmit } from "@/shared/lib/use-guarded-submit";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { GuardedForm } from "@/shared/ui/guarded-form";
import { Textarea } from "@/shared/ui/textarea";

import { getCommentCopy } from "../comment.constants";
import { useCreateComment } from "../api/comment.queries";
import { createCommentComposerSchema } from "../model/comment-input.schema";

interface CommentComposerProps {
  postId: string;
  parentCommentId?: string;
  replyToDisplayName?: string;
  displayName?: string;
  avatarUrl?: string | null;
  placeholder?: string;
  autoFocus?: boolean;
  onSuccess?: () => void;
  locale?: AppLocale;
  compact?: boolean;
}

export function CommentComposer({
  postId,
  parentCommentId,
  replyToDisplayName,
  displayName = "",
  avatarUrl,
  placeholder,
  autoFocus,
  onSuccess,
  locale = getClientLocale(),
  compact,
}: CommentComposerProps) {
  const copy = getCommentCopy(locale);
  const schema = useMemo(() => createCommentComposerSchema(locale), [locale]);
  const create = useCreateComment();
  const defaultBody = replyToDisplayName ? `@${replyToDisplayName} ` : "";
  const form = useForm<{ body: string }>({
    resolver: zodResolver(schema),
    defaultValues: { body: defaultBody },
  });

  const bodyValue = form.watch("body") ?? "";
  const { guardFormEvent, release, isSubmitting } = useGuardedSubmit({ isPending: create.isPending });

  const onSubmit = guardFormEvent(
    form.handleSubmit(
      (data) => {
        create.mutate(
          {
            postId,
            body: data.body,
            ...(parentCommentId ? { parentCommentId } : {}),
          },
          {
            onSuccess: () => {
              form.reset();
              onSuccess?.();
            },
            onSettled: () => release(),
          },
        );
      },
      () => release(),
    ),
  );

  const avatarSrc = resolveMediaUrl(avatarUrl);
  const initials = getInitials(displayName || "?");

  return (
    <GuardedForm onSubmit={onSubmit} isSubmitting={isSubmitting} className="flex gap-3">
      {!compact ? (
        <Avatar className="size-9 shrink-0">
          {avatarSrc ? <AvatarImage src={avatarSrc} alt={displayName} /> : null}
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
      ) : null}

      <div className="min-w-0 flex-1 space-y-2">
        <Textarea
          {...form.register("body")}
          placeholder={placeholder ?? (parentCommentId ? copy.replyPlaceholder : copy.placeholder)}
          rows={compact ? 2 : 3}
          maxLength={500}
          autoFocus={autoFocus}
          className="min-h-[72px] resize-none text-sm leading-relaxed"
        />
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">{copy.charCount(bodyValue.length)}</span>
          <Button type="submit" size="sm" disabled={!bodyValue.trim() || isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {copy.submitting}
              </>
            ) : (
              <>
                <Send className="size-4" />
                {copy.submit}
              </>
            )}
          </Button>
        </div>
        {form.formState.errors.body ? (
          <p className="text-sm text-destructive">{form.formState.errors.body.message}</p>
        ) : null}
      </div>
    </GuardedForm>
  );
}
