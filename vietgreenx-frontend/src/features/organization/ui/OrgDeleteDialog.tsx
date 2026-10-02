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

import { useDeleteOrganization } from "../api/organization.queries";
import { getOrganizationCopy } from "../organization.constants";

interface OrgDeleteDialogProps {
  orgId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale?: AppLocale;
}

export function OrgDeleteDialog({
  orgId,
  open,
  onOpenChange,
  locale = getClientLocale(),
}: OrgDeleteDialogProps) {
  const copy = getOrganizationCopy(locale).delete;
  const { mutate, isPending } = useDeleteOrganization(orgId);

  const handleConfirm = () => {
    mutate(undefined, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{copy.dialogTitle}</AlertDialogTitle>
          <AlertDialogDescription>{copy.dialogDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>{copy.cancel}</AlertDialogCancel>
          <Button type="button" variant="destructive" disabled={isPending} onClick={handleConfirm}>
            {isPending ? (
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
