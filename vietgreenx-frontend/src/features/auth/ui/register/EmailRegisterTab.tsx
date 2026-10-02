"use client";

// features/auth/ui/register/EmailRegisterTab.tsx
// =============================================================================
//
// =============================================================================
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
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
import { StepIndicator } from "@/shared/ui/StepIndicator";
import { StepSlide, type StepDirection } from "@/shared/ui/StepSlide";

import { useRegisterEmail, useResendRegisterEmail } from "../../api/auth.queries";
import { getAuthCopy } from "../../auth.constants";
import { AUTH_FIELD_CLASS } from "../AuthFormPanel";
import { applyAuthFormError, shouldShowLoginLink } from "../../lib/auth-form-errors";
import { getAuthErrorMessage } from "../../lib/auth-errors";
import { useResendCooldown } from "@/shared/lib/use-resend-cooldown";
import {
  createRegisterEmailSendSchema,
  type RegisterEmailSendInput,
} from "../../model/auth.schema";

// ─── Constants ───────────────────────────────────────────────────────────────

type Step = 1 | 2;
const TOTAL_STEPS = 2;

// ─── Component ───────────────────────────────────────────────────────────────

interface EmailRegisterTabProps {
  locale: AppLocale;
}

export function EmailRegisterTab({ locale }: EmailRegisterTabProps) {
  const copy = getAuthCopy(locale).register;
  const emailCopy = copy.email;
  const STEP_LABELS = [emailCopy.step1Title, emailCopy.checkInboxTitle];
  const registerEmailSendSchema = useMemo(() => createRegisterEmailSendSchema(locale), [locale]);

  // ── Navigation ─────────────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>(1);
  const [direction, setDirection] = useState<StepDirection>("forward");

  const goNext = () => {
    setDirection("forward");
    setStep(2);
  };
  const goBack = () => {
    setDirection("backward");
    setStep(1);
  };

  // ── State ──────────────────────────────────────────────────────────────────
  const [email, setEmail] = useState("");
  const [loginLinkError, setLoginLinkError] = useState(false);

  const { secondsLeft, canResend, startCooldown } = useResendCooldown("vgx_email_resend_cooldown");

  // ── Form ───────────────────────────────────────────────────────────────────
  const form = useForm<RegisterEmailSendInput>({
    resolver: zodResolver(registerEmailSendSchema),
  });

  // ── Mutations ──────────────────────────────────────────────────────────────
  const { mutate: registerEmail, isPending } = useRegisterEmail();
  const { mutate: resend, isPending: isResending } = useResendRegisterEmail();
  const { guardFormEvent, release, isSubmitting } = useGuardedSubmit({ isPending });

  const onSubmit = guardFormEvent(
    form.handleSubmit(
      (data) => {
        setLoginLinkError(false);
        form.clearErrors("email");

        registerEmail(data, {
          onSuccess: () => {
            setEmail(data.email);
            startCooldown();
            goNext();
          },
          onError: (error) => {
            setLoginLinkError(shouldShowLoginLink(error));
            applyAuthFormError(error, {
              setError: form.setError,
              field: "email",
              context: "register",
              locale,
              onToast: (message) => toastService.error(message),
            });
          },
          onSettled: () => release(),
        });
      },
      () => release(),
    ),
  );

  const handleResend = () => {
    if (!email || !canResend || isResending) return;
    resend(
      { email },
      {
        onSuccess: () => startCooldown(),
        onError: (error) => toastService.error(getAuthErrorMessage(error, "resendEmail", locale)),
      },
    );
  };

  const handleChangeEmail = () => {
    form.setValue("email", email); // giữ email cũ để user sửa, không mất trắng
    goBack();
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6">
      {/* Progress indicator */}
      <StepIndicator total={TOTAL_STEPS} current={step} labels={STEP_LABELS} />

      <StepSlide key={step} direction={direction}>
        {step === 1 && (
          <GuardedForm
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            className="flex flex-col gap-5"
          >
            <div className="text-center">
              <h2 className="text-lg font-semibold">{emailCopy.step1Title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{emailCopy.step1Subtitle}</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">{emailCopy.emailLabel}</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                autoFocus
                className={AUTH_FIELD_CLASS}
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                  {loginLinkError && (
                    <>
                      {" "}
                      <Link
                        href={ROUTES.login}
                        className="font-medium underline hover:text-destructive/90"
                      >
                        {copy.login}
                      </Link>
                    </>
                  )}
                </p>
              )}
            </div>

            <SubmitButton
              isSubmitting={isSubmitting}
              className="h-[52px] w-full rounded-[14px] bg-gradient-to-r from-primary to-tertiary font-semibold text-white shadow-[0px_4px_16px_0px_rgba(48,196,66,0.3),0px_2px_8px_0px_rgba(3,134,69,0.2)] hover:opacity-90"
            >
              {copy.next}
            </SubmitButton>
          </GuardedForm>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center gap-5 text-center">
            {/* Icon */}
            <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
              <Mail className="size-7 text-primary" aria-hidden />
            </div>

            {/* Message */}
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">{emailCopy.checkInboxTitle}</h2>
              <p className="text-sm text-muted-foreground">{emailCopy.checkInboxSubtitle}</p>
            </div>

            <div className="w-full rounded-md border border-border bg-muted/50 px-4 py-2.5 text-sm font-medium">
              {email}
            </div>

            {/* Resend button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!canResend || isResending}
              onClick={handleResend}
            >
              {isResending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : secondsLeft > 0 ? (
                `${emailCopy.resend} (${secondsLeft}s)`
              ) : (
                emailCopy.resend
              )}
            </Button>

            <button
              type="button"
              onClick={handleChangeEmail}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {emailCopy.changeEmail}
            </button>
          </div>
        )}
      </StepSlide>
    </div>
  );
}
