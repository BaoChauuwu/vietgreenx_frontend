"use client";

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
import { Loader2 } from "lucide-react";

import { useDeletePost } from "../api/post.queries";
import type { Post } from "@/entities/post";
import { getPostsCopy } from "../posts.constants";

interface DeletePostDialogProps {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale?: AppLocale;
}

export function DeletePostDialog({
  post,
  open,
  onOpenChange,
  locale = getClientLocale(),
}: DeletePostDialogProps) {
  const copy = getPostsCopy(locale).deleteDialog;
  const { mutate, isPending } = useDeletePost();
  const { runGuarded, release, isSubmitting } = useGuardedSubmit({ isPending });

  const handleDelete = () => {
    runGuarded(() =>
      mutate(post.id, {
        onSuccess: () => onOpenChange(false),
        onSettled: () => release(),
      }),
    );
  };

  const busy = isSubmitting || isPending;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="gap-0 overflow-hidden p-0 sm:max-w-[400px]">
        <AlertDialogHeader className="space-y-2 border-b border-border px-6 pb-4 pt-6 text-left">
          <AlertDialogTitle className="text-base font-semibold">{copy.title}</AlertDialogTitle>
          <AlertDialogDescription>{copy.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3 border-t border-border bg-muted/20 px-6 py-4 sm:flex-row sm:justify-end">
          <AlertDialogCancel disabled={busy} className="mt-0">
            {copy.cancel}
          </AlertDialogCancel>
          <Button
            type="button"
            variant="destructive"
            disabled={busy}
            className="min-w-[5.5rem]"
            onClick={handleDelete}
          >
            {busy ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {copy.deleting}
              </>
            ) : (
              copy.confirm
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
