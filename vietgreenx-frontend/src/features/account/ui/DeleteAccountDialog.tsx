"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

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
import { GuardedForm } from "@/shared/ui/guarded-form";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

import { useDeleteAccount } from "../api/account.queries";
import { getAccountCopy } from "../account.constants";
import { createDeleteAccountSchema, type DeleteAccountInput } from "../model/account.schema";

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale?: AppLocale;
}

export function DeleteAccountDialog({
  open,
  onOpenChange,
  locale = getClientLocale(),
}: DeleteAccountDialogProps) {
  const copy = getAccountCopy(locale).delete;
  const deleteAccountSchema = useMemo(() => createDeleteAccountSchema(locale), [locale]);
  const { mutate, isPending } = useDeleteAccount();
  const { guardFormEvent, release, isSubmitting } = useGuardedSubmit({ isPending });

  const form = useForm<DeleteAccountInput>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: { currentPassword: "" },
  });

  useEffect(() => {
    if (!open) form.reset({ currentPassword: "" });
  }, [open, form]);

  const onSubmit = guardFormEvent(
    form.handleSubmit(
      (data) => {
        mutate(data, {
          onSuccess: () => onOpenChange(false),
          onSettled: () => release(),
        });
      },
      () => release(),
    ),
  );

  const busy = isSubmitting || isPending;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="gap-0 overflow-hidden p-0 sm:max-w-[440px]">
        <AlertDialogHeader className="space-y-2 border-b border-border px-6 pb-4 pt-6 text-left">
          <AlertDialogTitle className="text-base font-semibold">{copy.dialogTitle}</AlertDialogTitle>
          <AlertDialogDescription>{copy.dialogDescription}</AlertDialogDescription>
        </AlertDialogHeader>

        <GuardedForm onSubmit={onSubmit} isSubmitting={isSubmitting} className="space-y-4 px-6 py-5">
          <div className="space-y-1.5">
            <Label htmlFor="delete-password">{copy.passwordLabel}</Label>
            <Input
              id="delete-password"
              type="password"
              autoComplete="current-password"
              {...form.register("currentPassword")}
            />
            {form.formState.errors.currentPassword && (
              <p className="text-sm text-destructive">{form.formState.errors.currentPassword.message}</p>
            )}
          </div>

          <AlertDialogFooter className="gap-3 border-t border-border bg-muted/20 px-0 py-0 pt-4 sm:flex-row sm:justify-end">
            <AlertDialogCancel disabled={busy} className="mt-0">
              {copy.cancel}
            </AlertDialogCancel>
            <Button type="submit" variant="destructive" disabled={busy} className="min-w-[5.5rem]">
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
        </GuardedForm>
      </AlertDialogContent>
    </AlertDialog>
  );
}
