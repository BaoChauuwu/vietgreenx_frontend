"use client";

// features/auth/ui/register/PhoneRegisterTab.tsx
// =============================================================================
//
// Animation: StepSlide + StepIndicator (shared/ui).
//
// Submission guards: useGuardedSubmit + useSingleFlightMutation (see DEV-PLAYBOOK §3).
// Step 1 keeps error cooldown state machine (2s) on top of shared guard.
// =============================================================================
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { UserRole } from "@/shared/auth";
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

import {
  useCheckPhoneOtp,
  useRegisterPhone,
  useResendPhoneOtp,
  useVerifyPhoneRegister,
} from "../../api/auth.queries";
import { getAuthCopy, type RegisterRoleId } from "../../auth.constants";
import { AUTH_FIELD_CLASS } from "../AuthFormPanel";
import { applyAuthFormError, shouldShowLoginLink } from "../../lib/auth-form-errors";
import { getAuthErrorMessage } from "../../lib/auth-errors";
import { assertUsernameAvailableForSubmit } from "../../lib/username-submit";
import type { UsernameAvailabilityState } from "../../lib/use-debounced-username-check";
import {
  createRegisterPhoneAccountStepSchema,
  createRegisterPhoneSendSchema,
  type RegisterPhoneAccountStepInput,
  type RegisterPhoneSendInput,
} from "../../model/auth.schema";
import { useResendCooldown } from "@/shared/lib/use-resend-cooldown";
import { RoleSelectionStep } from "./steps/RoleSelectionStep";
import { VerifyIdentityStep } from "./steps/VerifyIdentityStep";
import { UsernameField } from "../UsernameField";

// ─── Constants ───────────────────────────────────────────────────────────────

const PHONE_OTP_COOLDOWN_KEY = "vgx_phone_otp_cooldown";

type Step = 1 | 2 | 3;
const TOTAL_STEPS = 3;

// ─── Component ───────────────────────────────────────────────────────────────

interface PhoneRegisterTabProps {
  locale: AppLocale;
}

export function PhoneRegisterTab({ locale }: PhoneRegisterTabProps) {
  const authCopy = getAuthCopy(locale);
  const copy = authCopy.register;
  const phoneCopy = copy.phone;

  // ── Navigation ─────────────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>(1);
  const [direction, setDirection] = useState<StepDirection>("forward");

  const goNext = () => {
    setDirection("forward");
    setStep((s) => Math.min(s + 1, TOTAL_STEPS) as Step);
  };

  const goBack = () => {
    setDirection("backward");
    if (step === 2) setOtp("");
    setStep((s) => Math.max(s - 1, 1) as Step);
  };

  // ── Step 1 ─────────────────────────────────────────────────────────────────
  const [phone, setPhone] = useState("");
  const [devOtp, setDevOtp] = useState<string>();
  const [loginLinkError, setLoginLinkError] = useState(false);

  const [otpSentForPhone, setOtpSentForPhone] = useState<string | null>(null);

  //
  //   idle  ──(click)──►  submitting  ──(success)──►  idle (+ goNext)
  //                           │
  //                       (error)
  //                           │
  //                           ▼
  //                       cooldown  ──(2s timeout)──►  idle
  //
  type SendState = "idle" | "submitting" | "cooldown";
  const [sendState, setSendState] = useState<SendState>("idle");
  const cooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timer khi unmount
  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
    };
  }, []);

  const enterCooldown = () => {
    if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
    setSendState("cooldown");
    cooldownTimerRef.current = setTimeout(() => setSendState("idle"), 2000);
  };

  // ── Step 2 ─────────────────────────────────────────────────────────────────
  const [otp, setOtp] = useState("");
  const { secondsLeft, canResend, startCooldown } = useResendCooldown(PHONE_OTP_COOLDOWN_KEY);

  // ── Step 3 ─────────────────────────────────────────────────────────────────
  const [roleError, setRoleError] = useState<string>();
  const [usernameAvailability, setUsernameAvailability] = useState<UsernameAvailabilityState>({
    status: "idle",
    isConfirmedAvailable: false,
    isChecking: false,
  });

  const accountStepSchema = useMemo(() => createRegisterPhoneAccountStepSchema(locale), [locale]);
  const registerPhoneSendSchema = useMemo(() => createRegisterPhoneSendSchema(locale), [locale]);

  // ── Forms ──────────────────────────────────────────────────────────────────
  const phoneForm = useForm<RegisterPhoneSendInput>({
    resolver: zodResolver(registerPhoneSendSchema),
  });

  const accountForm = useForm<RegisterPhoneAccountStepInput>({
    resolver: zodResolver(accountStepSchema),
    mode: "onTouched",
    defaultValues: {
      username: "",
      displayName: "",
      password: "",
      role: UserRole.CONSUMER as RegisterRoleId,
    },
  });

  const selectedRole = accountForm.watch("role") as RegisterRoleId | undefined;

  // ── Mutations ──────────────────────────────────────────────────────────────
  const { mutate: sendOtp, isPending: isSendingOtp } = useRegisterPhone();
  const { mutate: checkOtp, isPending: isCheckingOtp } = useCheckPhoneOtp();
  const { mutate: verify, isPending: isVerifying } = useVerifyPhoneRegister();
  const { mutate: resend, isPending: isResending } = useResendPhoneOtp();

  const sendOtpGuard = useGuardedSubmit({
    isPending: isSendingOtp,
    enabled: sendState === "idle",
  });
  const checkOtpGuard = useGuardedSubmit({ isPending: isCheckingOtp, enabled: otp.length === 6 });
  const verifyGuard = useGuardedSubmit({ isPending: isVerifying });
  const resendGuard = useGuardedSubmit({
    isPending: isResending,
    enabled: canResend && Boolean(phone),
  });

  const onSendOtp = sendOtpGuard.guardFormEvent(
    phoneForm.handleSubmit(
      (data) => {
        if (data.phone === otpSentForPhone && !canResend) {
          setPhone(data.phone);
          goNext();
          sendOtpGuard.release();
          return;
        }

        setSendState("submitting");
        setLoginLinkError(false);
        phoneForm.clearErrors("phone");

        sendOtp(data, {
          onSuccess: (res) => {
            setSendState("idle");
            setPhone(data.phone);
            setOtpSentForPhone(data.phone);
            setOtp("");
            setDevOtp(res.devOtp);
            startCooldown();
            goNext();
          },
          onError: (error) => {
            enterCooldown();
            setLoginLinkError(shouldShowLoginLink(error));
            applyAuthFormError(error, {
              setError: phoneForm.setError,
              field: "phone",
              context: "registerPhone",
              onToast: (message) => toastService.error(message),
            });
          },
          onSettled: () => sendOtpGuard.release(),
        });
      },
      () => sendOtpGuard.release(),
    ),
  );

  const [otpError, setOtpError] = useState<string>();

  const handleOtpContinue = () => {
    if (otp.length !== 6) return;
    checkOtpGuard.runGuarded(() => {
      setOtpError(undefined);
      checkOtp(
        { phone, otp },
        {
          onSuccess: (res) => {
            if (res.valid) {
              goNext();
            } else {
              setOtpError(copy.verifyIdentity.otpInvalid);
            }
            checkOtpGuard.release();
          },
          onError: () => {
            setOtpError(copy.verifyIdentity.otpExpired);
            checkOtpGuard.release();
          },
        },
      );
    });
  };

  const handleResend = () => {
    if (!phone) return;
    resendGuard.runGuarded(() => {
      setOtpError(undefined);
      resend(
        { phone },
        {
          onSuccess: (res) => {
            startCooldown();
            if (res.devOtp) setDevOtp(res.devOtp);
          },
          onError: (error) => toastService.error(getAuthErrorMessage(error, "resendOtp")),
          onSettled: () => resendGuard.release(),
        },
      );
    });
  };

  const handleVerify = () => {
    verifyGuard.runGuarded(() => {
      void accountForm.handleSubmit(
        async (data) => {
          if (!data.role) {
            setRoleError(copy.roleRequired);
            verifyGuard.release();
            return;
          }

          const usernameError = await assertUsernameAvailableForSubmit(
            data.username,
            usernameAvailability,
            copy.account.username,
          );
          if (usernameError) {
            accountForm.setError("username", { message: usernameError });
            verifyGuard.release();
            return;
          }

          verify({ phone, otp, ...data }, { onSettled: () => verifyGuard.release() });
        },
        () => verifyGuard.release(),
      )();
    });
  };

  const handleRoleSelect = (roleId: RegisterRoleId) => {
    accountForm.setValue("role", roleId, { shouldValidate: true });
    setRoleError(undefined);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6">
      {/* Progress indicator */}
      <StepIndicator total={TOTAL_STEPS} current={step} labels={[...phoneCopy.stepLabels]} />

      <StepSlide key={step} direction={direction}>
        {step === 1 && (
          <GuardedForm
            onSubmit={onSendOtp}
            isSubmitting={sendOtpGuard.isSubmitting}
            className="flex flex-col gap-5"
          >
            <div className="text-center">
              <h2 className="text-lg font-semibold">{phoneCopy.step1Title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{phoneCopy.step1Subtitle}</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">{phoneCopy.phoneLabel}</Label>
              <Input
                id="phone"
                type="text"
                inputMode="tel"
                autoComplete="tel"
                placeholder={phoneCopy.phonePlaceholder}
                autoFocus
                className={AUTH_FIELD_CLASS}
                {...phoneForm.register("phone")}
              />
              {phoneForm.formState.errors.phone && (
                <p className="text-sm text-destructive">
                  {phoneForm.formState.errors.phone.message}
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
              isSubmitting={sendOtpGuard.isSubmitting || sendState === "submitting"}
              disabled={sendState !== "idle"}
              className="h-[52px] w-full rounded-[14px] bg-gradient-to-r from-primary to-tertiary font-semibold text-white shadow-[0px_4px_16px_0px_rgba(48,196,66,0.3),0px_2px_8px_0px_rgba(3,134,69,0.2)] hover:opacity-90"
            >
              {sendState === "cooldown" ? (
                <span className="text-sm">{phoneCopy.sendRetryHint}</span>
              ) : (
                copy.next
              )}
            </SubmitButton>
          </GuardedForm>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-6">
            {devOtp && (
              <p className="rounded-md bg-muted px-3 py-2 text-center text-sm">
                {phoneCopy.devOtpHint}{" "}
                <strong className="font-mono tracking-widest">{devOtp}</strong>
              </p>
            )}

            <VerifyIdentityStep
              locale={locale}
              value={otp}
              onChange={(v) => {
                setOtp(v);
                setOtpError(undefined);
              }}
              onResend={handleResend}
              isResending={isResending}
              resendDisabled={!canResend}
              resendWaitSeconds={secondsLeft}
            />

            {otpError && <p className="text-center text-sm text-destructive">{otpError}</p>}

            <div className="flex items-center justify-between gap-3">
              <Button type="button" variant="ghost" onClick={goBack}>
                {copy.back}
              </Button>
              <Button
                type="button"
                onClick={handleOtpContinue}
                disabled={otp.length !== 6 || checkOtpGuard.isSubmitting}
                className="h-[44px] rounded-[12px] bg-gradient-to-r from-primary to-tertiary font-semibold text-white shadow-[0px_4px_16px_0px_rgba(48,196,66,0.3)] hover:opacity-90"
              >
                {checkOtpGuard.isSubmitting ? copy.verifyIdentity.checking : copy.next}
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-5">
            <div className="text-center">
              <h2 className="text-lg font-semibold">{phoneCopy.step3Title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{phoneCopy.step3Subtitle}</p>
            </div>

            <Controller
              name="username"
              control={accountForm.control}
              render={({ field }) => (
                <UsernameField
                  locale={locale}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  autoFocus
                  error={accountForm.formState.errors.username?.message}
                  onAvailabilityChange={setUsernameAvailability}
                />
              )}
            />

            <div className="space-y-1.5">
              <Label htmlFor="displayName">{copy.account.displayName}</Label>
              <Input
                id="displayName"
                autoComplete="name"
                className={AUTH_FIELD_CLASS}
                {...accountForm.register("displayName")}
              />
              {accountForm.formState.errors.displayName && (
                <p className="text-sm text-destructive">
                  {accountForm.formState.errors.displayName.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">{copy.account.password}</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                className={AUTH_FIELD_CLASS}
                {...accountForm.register("password")}
              />
              <p className="text-xs text-muted-foreground">{copy.account.passwordHint}</p>
              {accountForm.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {accountForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <RoleSelectionStep
              locale={locale}
              value={selectedRole}
              error={roleError ?? accountForm.formState.errors.role?.message}
              onSelect={handleRoleSelect}
            />

            <div className="flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={goBack}
                disabled={verifyGuard.isSubmitting}
              >
                {copy.back}
              </Button>
              <SubmitButton
                type="button"
                size="default"
                onClick={handleVerify}
                isSubmitting={verifyGuard.isSubmitting}
                disabled={usernameAvailability.isChecking}
                className="h-[44px] rounded-[12px] bg-gradient-to-r from-primary to-tertiary font-semibold text-white shadow-[0px_4px_16px_0px_rgba(48,196,66,0.3)] hover:opacity-90"
              >
                {copy.finish}
              </SubmitButton>
            </div>
          </div>
        )}
      </StepSlide>
    </div>
  );
}
