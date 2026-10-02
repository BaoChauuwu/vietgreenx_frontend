"use client";

import { Loader2 } from "lucide-react";

import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { useGuardedSubmit } from "@/shared/lib/use-guarded-submit";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import { Button } from "@/shared/ui/button";

import { useDeleteComment } from "../api/comment.queries";
import { getCommentCopy } from "../comment.constants";

interface DeleteCommentDialogProps {
  commentId: string;
  postId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale?: AppLocale;
}

export function DeleteCommentDialog({
  commentId,
  postId,
  open,
  onOpenChange,
  locale = getClientLocale(),
}: DeleteCommentDialogProps) {
  const copy = getCommentCopy(locale);
  const remove = useDeleteComment(postId);
  const { runGuarded, release, isSubmitting } = useGuardedSubmit({ isPending: remove.isPending });

  const handleDelete = () => {
    runGuarded(() =>
      remove.mutate(commentId, {
        onSuccess: () => onOpenChange(false),
        onSettled: () => release(),
      }),
    );
  };

  const busy = isSubmitting || remove.isPending;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="gap-0 overflow-hidden p-0 sm:max-w-[400px]">
        <AlertDialogHeader className="space-y-2 border-b border-border px-6 pb-4 pt-6 text-left">
          <AlertDialogTitle className="text-base font-semibold">{copy.deleteTitle}</AlertDialogTitle>
          <AlertDialogDescription>{copy.deleteDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3 border-t border-border bg-muted/20 px-6 py-4 sm:flex-row sm:justify-end">
          <AlertDialogCancel disabled={busy} className="mt-0">
            {copy.cancel}
          </AlertDialogCancel>
          <Button type="button" variant="destructive" disabled={busy} onClick={handleDelete}>
            {busy ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {copy.delete}
              </>
            ) : (
              copy.delete
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
