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

import { useRemoveOrganizationMember } from "../api/organization.queries";
import { getOrganizationCopy } from "../organization.constants";

interface RemoveMemberDialogProps {
  orgId: string | null;
  memberUserId: string | null;
  memberName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale?: AppLocale;
}

export function RemoveMemberDialog({
  orgId,
  memberUserId,
  memberName,
  open,
  onOpenChange,
  locale = getClientLocale(),
}: RemoveMemberDialogProps) {
  const copy = getOrganizationCopy(locale).members.remove;
  const { mutate, isPending } = useRemoveOrganizationMember(orgId);

  const handleConfirm = () => {
    if (!memberUserId) return;
    mutate(memberUserId, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{copy.confirmTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {copy.confirmDescription}
            {memberName ? (
              <>
                {" "}
                <span className="font-medium text-foreground">{memberName}</span>
              </>
            ) : null}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>{copy.cancel}</AlertDialogCancel>
          <Button type="button" variant="destructive" disabled={isPending} onClick={handleConfirm}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : copy.confirm}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
