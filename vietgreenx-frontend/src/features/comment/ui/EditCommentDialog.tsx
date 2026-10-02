"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import type { Comment } from "@/entities/comment";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { useGuardedSubmit } from "@/shared/lib/use-guarded-submit";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { GuardedForm } from "@/shared/ui/guarded-form";
import { Textarea } from "@/shared/ui/textarea";

import { useUpdateComment } from "../api/comment.queries";
import { getCommentCopy } from "../comment.constants";
import { createUpdateCommentInputSchema } from "../model/comment-input.schema";

interface EditCommentDialogProps {
  comment: Comment;
  postId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale?: AppLocale;
}

export function EditCommentDialog({
  comment,
  postId,
  open,
  onOpenChange,
  locale = getClientLocale(),
}: EditCommentDialogProps) {
  const copy = getCommentCopy(locale);
  const schema = useMemo(() => createUpdateCommentInputSchema(locale), [locale]);
  const update = useUpdateComment(postId);
  const form = useForm<{ body: string }>({
    resolver: zodResolver(schema),
    defaultValues: { body: comment.body },
  });
  const { guardFormEvent, release, isSubmitting } = useGuardedSubmit({ isPending: update.isPending });

  useEffect(() => {
    if (open) form.reset({ body: comment.body });
  }, [open, comment.body, form]);

  const bodyValue = form.watch("body") ?? "";

  const onSubmit = guardFormEvent(
    form.handleSubmit(
      (data) => {
        update.mutate(
          { id: comment.id, body: data.body },
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
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-[440px]">
        <DialogHeader className="border-b border-border px-6 pb-4 pt-6 text-left">
          <DialogTitle className="text-base font-semibold">{copy.editTitle}</DialogTitle>
        </DialogHeader>
        <GuardedForm onSubmit={onSubmit} isSubmitting={isSubmitting} className="space-y-4 px-6 py-5">
          <Textarea
            {...form.register("body")}
            rows={4}
            maxLength={500}
            className="min-h-[96px] resize-none"
            autoFocus
          />
          <p className="text-xs text-muted-foreground">{copy.charCount(bodyValue.length)}</p>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              {copy.cancel}
            </Button>
            <Button type="submit" disabled={!bodyValue.trim() || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {copy.saving}
                </>
              ) : (
                copy.save
              )}
            </Button>
          </DialogFooter>
        </GuardedForm>
      </DialogContent>
    </Dialog>
  );
}
