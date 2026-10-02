"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

import type { AppLocale } from "@/shared/i18n/locale";
import { useGuardedSubmit } from "@/shared/lib/use-guarded-submit";
import { toastService } from "@/shared/lib/toast";
import { ROUTES } from "@/shared/routing";
import { Button } from "@/shared/ui/button";
import { GuardedForm } from "@/shared/ui/guarded-form";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { SubmitButton } from "@/shared/ui/submit-button";

import {
  useForgotPasswordByEmail,
  useForgotPasswordByPhone,
  useResetPassword,
} from "../api/auth.queries";
import { getAuthCopy } from "../auth.constants";
import { applyAuthFormError } from "../lib/auth-form-errors";
import { getAuthErrorMessage } from "../lib/auth-errors";
import { useResendCooldown } from "@/shared/lib/use-resend-cooldown";
import { createResetPasswordFormSchema, type ResetPasswordFormInput } from "../model/auth.schema";
import { AUTH_FIELD_CLASS, AuthFormPanel } from "./AuthFormPanel";

interface ResetPasswordFormProps {
  locale: AppLocale;
}

export function ResetPasswordForm({ locale }: ResetPasswordFormProps) {
  const authCopy = getAuthCopy(locale);
  const copy = authCopy.resetPasswordForm;
  const forgotCopy = authCopy.forgotPasswordForm;
  const resetPasswordFormSchema = useMemo(() => createResetPasswordFormSchema(locale), [locale]);
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone")?.trim() || undefined;
  const email = searchParams.get("email")?.trim() || undefined;
  const channelKey = phone ? `phone:${phone}` : email ? `email:${email}` : "missing";

  const { mutate: resetPassword, isPending } = useResetPassword();
  const { mutate: resendPhone, isPending: isResendingPhone } = useForgotPasswordByPhone();
  const { mutate: resendEmail, isPending: isResendingEmail } = useForgotPasswordByEmail();
  const { secondsLeft, canResend, startCooldown } = useResendCooldown(`forgot-resend:${channelKey}`);

  const { guardFormEvent, release, isSubmitting } = useGuardedSubmit({
    isPending: isPending || isResendingPhone || isResendingEmail,
  });

  const form = useForm<ResetPasswordFormInput>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  if (!phone && !email) {
    return (
      <AuthFormPanel className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">{copy.missingChannel}</p>
        <Button asChild variant="outline" className="w-fit">
          <Link href={ROUTES.forgotPassword}>{copy.restart}</Link>
        </Button>
      </AuthFormPanel>
    );
  }

  const subtitle = phone
    ? copy.subtitlePhone.replace("{phone}", phone)
    : copy.subtitleEmail.replace("{email}", email ?? "");

  const onSubmit = guardFormEvent(
    form.handleSubmit(
      (data) => {
        resetPassword(
          {
            identifier: phone ?? email ?? "",
            otp: data.otp,
            newPassword: data.newPassword,
            confirmPassword: data.confirmPassword,
          },
          {
            onError: (error) =>
              applyAuthFormError(error, {
                setError: form.setError,
                context: "resetPassword",
                locale,
                onToast: (message) => toastService.error(message),
              }),
            onSettled: () => release(),
          },
        );
      },
      () => release(),
    ),
  );

  const handleResend = () => {
    if (!canResend) return;
    const onSuccess = () => {
      startCooldown();
      toastService.success(forgotCopy.sentHint);
    };
    const onError = (error: unknown) =>
      toastService.error(getAuthErrorMessage(error, "forgotPassword", locale));

    if (phone) {
      resendPhone({ phone }, { onSuccess, onError });
      return;
    }
    if (email) {
      resendEmail({ email }, { onSuccess, onError });
    }
  };

  return (
    <AuthFormPanel className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{copy.title}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <GuardedForm noValidate onSubmit={onSubmit} isSubmitting={isSubmitting} className="flex flex-col gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="reset-otp">{copy.otp}</Label>
          <Input
            id="reset-otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            className={AUTH_FIELD_CLASS}
            {...form.register("otp")}
          />
          {form.formState.errors.otp && (
            <p className="text-sm text-destructive">{form.formState.errors.otp.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="reset-password">{copy.newPassword}</Label>
          <Input
            id="reset-password"
            type="password"
            autoComplete="new-password"
            className={AUTH_FIELD_CLASS}
            {...form.register("newPassword")}
          />
          <p className="text-xs text-muted-foreground">{copy.passwordHint}</p>
          {form.formState.errors.newPassword && (
            <p className="text-sm text-destructive">{form.formState.errors.newPassword.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="reset-confirm">{copy.confirmPassword}</Label>
          <Input
            id="reset-confirm"
            type="password"
            autoComplete="new-password"
            className={AUTH_FIELD_CLASS}
            {...form.register("confirmPassword")}
          />
          {form.formState.errors.confirmPassword && (
            <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{copy.resendHint}</span>
          <button
            type="button"
            disabled={!canResend || isSubmitting}
            onClick={handleResend}
            className="font-medium text-primary hover:text-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {canResend ? copy.resend : copy.resendWait.replace("{s}", String(secondsLeft))}
          </button>
        </div>

        <SubmitButton isSubmitting={isSubmitting} className="w-full">
          {copy.submit}
        </SubmitButton>
      </GuardedForm>

      <p className="text-sm text-muted-foreground">
        <Link href={ROUTES.login} className="font-medium text-primary hover:text-primary/90">
          {forgotCopy.backToLogin}
        </Link>
      </p>
    </AuthFormPanel>
  );
}
