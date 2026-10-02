"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import {
  createAddOrganizationMemberInputSchema,
  orgMemberRoleSchema,
  type AddOrganizationMemberInput,
} from "../model/organization-input.schema";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { useGuardedSubmit } from "@/shared/lib/use-guarded-submit";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { GuardedForm } from "@/shared/ui/guarded-form";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select } from "@/shared/ui/select";
import { SubmitButton } from "@/shared/ui/submit-button";

import { useActiveOrganizationId, useInviteOrganizationMember } from "../api/organization.queries";
import { getOrganizationCopy, getMemberRoleLabel } from "../organization.constants";

const ROLE_OPTIONS = orgMemberRoleSchema.options;

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale?: AppLocale;
}

export function InviteMemberDialog({
  open,
  onOpenChange,
  locale = getClientLocale(),
}: InviteMemberDialogProps) {
  const copy = getOrganizationCopy(locale).members.invite;
  const orgId = useActiveOrganizationId();
  const { mutate, isPending } = useInviteOrganizationMember(orgId);
  const { guardFormEvent, release, isSubmitting } = useGuardedSubmit({ isPending });
  const schema = useMemo(() => createAddOrganizationMemberInputSchema(locale), [locale]);

  const form = useForm<AddOrganizationMemberInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      userId: "",
      orgRole: "org_member",
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset({ userId: "", orgRole: "org_member" });
    }
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-[440px]">
        <DialogHeader className="space-y-1.5 border-b border-border px-6 pb-4 pt-6 text-left">
          <DialogTitle className="text-base font-semibold">{copy.title}</DialogTitle>
          <DialogDescription>{copy.description}</DialogDescription>
        </DialogHeader>

        <GuardedForm
          noValidate
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          className="space-y-4 px-6 py-5"
        >
          <div className="space-y-1.5">
            <Label htmlFor="invite-user-id">{copy.userId}</Label>
            <Input id="invite-user-id" {...form.register("userId")} />
            {form.formState.errors.userId && (
              <p className="text-sm text-destructive">{form.formState.errors.userId.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="invite-role">{copy.role}</Label>
            <Select
              id="invite-role"
              className="text-foreground"
              {...form.register("orgRole")}
            >
              {ROLE_OPTIONS.map((role) => (
                <option key={role} value={role}>
                  {getMemberRoleLabel(role, locale)}
                </option>
              ))}
            </Select>
          </div>

          <SubmitButton isSubmitting={isSubmitting} className="w-full">
            {copy.submit}
          </SubmitButton>
        </GuardedForm>
      </DialogContent>
    </Dialog>
  );
}
