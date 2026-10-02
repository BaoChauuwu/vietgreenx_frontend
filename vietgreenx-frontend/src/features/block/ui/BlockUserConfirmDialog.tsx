"use client";

import { Loader2 } from "lucide-react";

import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
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

import { useBlockUser } from "../api/block.queries";
import { getBlockCopy } from "../block.constants";

export interface BlockUserTarget {
  id: string;
  displayName: string;
  username?: string;
}

interface BlockUserConfirmDialogProps {
  target: BlockUserTarget | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale?: AppLocale;
}

export function BlockUserConfirmDialog({
  target,
  open,
  onOpenChange,
  locale = getClientLocale(),
}: BlockUserConfirmDialogProps) {
  const copy = getBlockCopy(locale);
  const block = useBlockUser();

  const handleConfirm = () => {
    if (!target) return;
    block.mutate(
      { blockedUserId: target.id },
      {
        onSuccess: () => onOpenChange(false),
      },
    );
  };

  const name = target?.displayName ?? target?.username ?? "";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{copy.confirmTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {copy.confirmDescription}
            {name ? (
              <>
                {" "}
                <span className="font-medium text-foreground">{name}</span>
              </>
            ) : null}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={block.isPending}>{copy.cancel}</AlertDialogCancel>
          <Button type="button" variant="destructive" disabled={block.isPending} onClick={handleConfirm}>
            {block.isPending ? <Loader2 className="size-4 animate-spin" /> : copy.confirm}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
