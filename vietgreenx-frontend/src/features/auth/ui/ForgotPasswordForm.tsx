"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import type { AppLocale } from "@/shared/i18n/locale";
import { cn } from "@/shared/lib/cn";
import { useGuardedSubmit } from "@/shared/lib/use-guarded-submit";
import { toastService } from "@/shared/lib/toast";
import { ROUTES } from "@/shared/routing";
import { GuardedForm } from "@/shared/ui/guarded-form";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { SubmitButton } from "@/shared/ui/submit-button";

import { useForgotPasswordByEmail, useForgotPasswordByPhone } from "../api/auth.queries";
import { getAuthCopy } from "../auth.constants";
import { applyAuthFormError } from "../lib/auth-form-errors";
import {
  createRegisterEmailSendSchema,
  createRegisterPhoneSendSchema,
  type ForgotPasswordEmailInput,
  type ForgotPasswordPhoneInput,
} from "../model/auth.schema";
import { AUTH_FIELD_CLASS, AuthFormPanel } from "./AuthFormPanel";

type ForgotTab = "phone" | "email";

interface ForgotPasswordFormProps {
  locale: AppLocale;
}

export function ForgotPasswordForm({ locale }: ForgotPasswordFormProps) {
  const copy = getAuthCopy(locale).forgotPasswordForm;
  const forgotPasswordPhoneSchema = useMemo(() => createRegisterPhoneSendSchema(locale), [locale]);
  const forgotPasswordEmailSchema = useMemo(() => createRegisterEmailSendSchema(locale), [locale]);
  const router = useRouter();
  const [tab, setTab] = useState<ForgotTab>("phone");
  const [devOtp, setDevOtp] = useState<string>();

  const { mutate: sendPhoneOtp, isPending: isPhonePending } = useForgotPasswordByPhone();
  const { mutate: sendEmailOtp, isPending: isEmailPending } = useForgotPasswordByEmail();
  const isPending = tab === "phone" ? isPhonePending : isEmailPending;
  const { guardFormEvent, release, isSubmitting } = useGuardedSubmit({ isPending });

  const phoneForm = useForm<ForgotPasswordPhoneInput>({
    resolver: zodResolver(forgotPasswordPhoneSchema),
    defaultValues: { phone: "" },
  });

  const emailForm = useForm<ForgotPasswordEmailInput>({
    resolver: zodResolver(forgotPasswordEmailSchema),
    defaultValues: { email: "" },
  });

  const onSubmitPhone = guardFormEvent(
    phoneForm.handleSubmit(
      (data) => {
        sendPhoneOtp(data, {
          onSuccess: (result) => {
            setDevOtp(result.devOtp);
            toastService.success(copy.sentHint);
            router.push(`${ROUTES.resetPassword}?phone=${encodeURIComponent(data.phone)}`);
          },
          onError: (error) =>
            applyAuthFormError(error, {
              setError: phoneForm.setError,
              field: "phone",
              context: "forgotPassword",
              locale,
              onToast: (message) => toastService.error(message),
            }),
          onSettled: () => release(),
        });
      },
      () => release(),
    ),
  );

  const onSubmitEmail = guardFormEvent(
    emailForm.handleSubmit(
      (data) => {
        sendEmailOtp(data, {
          onSuccess: (result) => {
            setDevOtp(result.devOtp);
            toastService.success(copy.sentHint);
            router.push(`${ROUTES.resetPassword}?email=${encodeURIComponent(data.email)}`);
          },
          onError: (error) =>
            applyAuthFormError(error, {
              setError: emailForm.setError,
              field: "email",
              context: "forgotPassword",
              locale,
              onToast: (message) => toastService.error(message),
            }),
          onSettled: () => release(),
        });
      },
      () => release(),
    ),
  );

  return (
    <AuthFormPanel className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{copy.title}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{copy.subtitle}</p>
      </div>

      <div className="flex rounded-lg border border-border bg-muted/30 p-0.5">
        {(["phone", "email"] as const).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              tab === id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {copy.tabs[id]}
          </button>
        ))}
      </div>

      {tab === "phone" ? (
        <GuardedForm noValidate onSubmit={onSubmitPhone} isSubmitting={isSubmitting} className="flex flex-col gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="forgot-phone">{copy.phoneLabel}</Label>
            <Input
              id="forgot-phone"
              type="tel"
              inputMode="tel"
              placeholder={copy.phonePlaceholder}
              autoComplete="tel"
              className={AUTH_FIELD_CLASS}
              {...phoneForm.register("phone")}
            />
            {phoneForm.formState.errors.phone && (
              <p className="text-sm text-destructive">{phoneForm.formState.errors.phone.message}</p>
            )}
          </div>

          {devOtp && (
            <p className="rounded-md border border-dashed border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
              {copy.devOtpHint} <span className="font-mono font-semibold text-foreground">{devOtp}</span>
            </p>
          )}

          <SubmitButton isSubmitting={isSubmitting} className="w-full">
            {copy.submit}
          </SubmitButton>
        </GuardedForm>
      ) : (
        <GuardedForm noValidate onSubmit={onSubmitEmail} isSubmitting={isSubmitting} className="flex flex-col gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="forgot-email">{copy.emailLabel}</Label>
            <Input
              id="forgot-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              className={AUTH_FIELD_CLASS}
              {...emailForm.register("email")}
            />
            {emailForm.formState.errors.email && (
              <p className="text-sm text-destructive">{emailForm.formState.errors.email.message}</p>
            )}
          </div>

          {devOtp && (
            <p className="rounded-md border border-dashed border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
              {copy.devOtpHint} <span className="font-mono font-semibold text-foreground">{devOtp}</span>
            </p>
          )}

          <SubmitButton isSubmitting={isSubmitting} className="w-full">
            {copy.submit}
          </SubmitButton>
        </GuardedForm>
      )}

      <p className="text-sm text-muted-foreground">
        <Link href={ROUTES.login} className="font-medium text-primary hover:text-primary/90">
          {copy.backToLogin}
        </Link>
      </p>
    </AuthFormPanel>
  );
}
