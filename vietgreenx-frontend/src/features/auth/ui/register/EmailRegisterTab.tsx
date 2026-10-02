"use client";

// features/auth/ui/register/EmailRegisterTab.tsx
// =============================================================================
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { UserRole } from "@/shared/auth";
import type { AppLocale } from "@/shared/i18n/locale";
import { useGuardedSubmit } from "@/shared/lib/use-guarded-submit";
import { Button } from "@/shared/ui/button";
import { GuardedForm } from "@/shared/ui/guarded-form";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { SubmitButton } from "@/shared/ui/submit-button";
import { StepIndicator } from "@/shared/ui/StepIndicator";
import { StepSlide, type StepDirection } from "@/shared/ui/StepSlide";

import { useVerifyEmailRegister } from "../../api/auth.queries";
import { getAuthCopy, type RegisterRoleId } from "../../auth.constants";
import { AUTH_FIELD_CLASS } from "../AuthFormPanel";
import { assertUsernameAvailableForSubmit } from "../../lib/username-submit";
import type { UsernameAvailabilityState } from "../../lib/use-debounced-username-check";
import {
  createRegisterEmailSendSchema,
  createRegisterPhoneAccountStepSchema,
  type RegisterEmailSendInput,
  type RegisterPhoneAccountStepInput,
} from "../../model/auth.schema";
import { RoleSelectionStep } from "./steps/RoleSelectionStep";
import { UsernameField } from "../UsernameField";

type Step = 1 | 2;
const TOTAL_STEPS = 2;

interface EmailRegisterTabProps {
  locale: AppLocale;
}

export function EmailRegisterTab({ locale }: EmailRegisterTabProps) {
  const authCopy = getAuthCopy(locale);
  const copy = authCopy.register;
  const emailCopy = copy.email;

  const [step, setStep] = useState<Step>(1);
  const [direction, setDirection] = useState<StepDirection>("forward");

  const [email, setEmail] = useState("");

  const [roleError, setRoleError] = useState<string>();
  const [usernameAvailability, setUsernameAvailability] = useState<UsernameAvailabilityState>({
    status: "idle",
    isConfirmedAvailable: false,
    isChecking: false,
  });

  const registerEmailSendSchema = useMemo(() => createRegisterEmailSendSchema(locale), [locale]);
  const accountStepSchema = useMemo(() => createRegisterPhoneAccountStepSchema(locale), [locale]);

  const emailForm = useForm<RegisterEmailSendInput>({
    resolver: zodResolver(registerEmailSendSchema),
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

  const { mutate: verifyEmail, isPending: isVerifying } = useVerifyEmailRegister();
  const verifyGuard = useGuardedSubmit({ isPending: isVerifying });

  const onSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    void emailForm.handleSubmit((data) => {
      setEmail(data.email);
      setDirection("forward");
      setStep(2);
    })();
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

          verifyEmail(
            { token: email, username: data.username, displayName: data.displayName, password: data.password, role: data.role },
            { onSettled: () => verifyGuard.release() },
          );
        },
        () => verifyGuard.release(),
      )();
    });
  };

  const handleRoleSelect = (roleId: RegisterRoleId) => {
    accountForm.setValue("role", roleId, { shouldValidate: true });
    setRoleError(undefined);
  };

  const goBack = () => {
    setDirection("backward");
    setStep(1);
  };

  return (
    <div className="flex flex-col gap-6">
      <StepIndicator total={TOTAL_STEPS} current={step} labels={[emailCopy.step1Title, copy.phone.step3Title]} />

      <StepSlide key={step} direction={direction}>
        {step === 1 && (
          <GuardedForm onSubmit={onSendEmail} className="flex flex-col gap-5">
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
                {...emailForm.register("email")}
              />
              {emailForm.formState.errors.email && (
                <p className="text-sm text-destructive">{emailForm.formState.errors.email.message}</p>
              )}
            </div>

            <SubmitButton className="h-[52px] w-full rounded-[14px] bg-gradient-to-r from-primary to-tertiary font-semibold text-white shadow-[0px_4px_16px_0px_rgba(48,196,66,0.3),0px_2px_8px_0px_rgba(3,134,69,0.2)] hover:opacity-90">
              {copy.next}
            </SubmitButton>
          </GuardedForm>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-5">
            <div className="text-center">
              <h2 className="text-lg font-semibold">{copy.phone.step3Title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{copy.phone.step3Subtitle}</p>
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
              <Button type="button" variant="ghost" onClick={goBack} disabled={verifyGuard.isSubmitting}>
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
