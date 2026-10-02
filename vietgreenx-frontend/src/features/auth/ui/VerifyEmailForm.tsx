"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { useUser, UserRole } from "@/shared/auth";
import { clearAuthSession, hasAuthSession } from "@/shared/auth/token-storage";
import type { AppLocale } from "@/shared/i18n/locale";
import { useGuardedSubmit } from "@/shared/lib/use-guarded-submit";
import { toastService } from "@/shared/lib/toast";
import { ROUTES } from "@/shared/routing";
import { GuardedForm } from "@/shared/ui/guarded-form";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { SubmitButton } from "@/shared/ui/submit-button";

import { useVerifyEmailRegister } from "../api/auth.queries";
import { getAuthCopy, type RegisterRoleId } from "../auth.constants";
import { applyAuthFormError } from "../lib/auth-form-errors";
import { assertUsernameAvailableForSubmit } from "../lib/username-submit";
import type { UsernameAvailabilityState } from "../lib/use-debounced-username-check";
import {
  createRegisterEmailVerifySchema,
  type RegisterEmailVerifyInput,
} from "../model/auth.schema";
import { AUTH_FIELD_CLASS, AuthFormPanel } from "./AuthFormPanel";
import { RoleSelectionStep } from "./register/steps/RoleSelectionStep";
import { UsernameField } from "./UsernameField";

interface VerifyEmailFormProps {
  locale: AppLocale;
}

export function VerifyEmailForm({ locale }: VerifyEmailFormProps) {
  const { verifyEmail: copy, register: registerCopy } = getAuthCopy(locale);
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const { refresh } = useUser();
  const { mutate, isPending } = useVerifyEmailRegister();
  const { guardFormEvent, release, isSubmitting } = useGuardedSubmit({ isPending });
  const [usernameAvailability, setUsernameAvailability] = useState<UsernameAvailabilityState>({
    status: "idle",
    isConfirmedAvailable: false,
    isChecking: false,
  });

  const verifySchema = useMemo(() => createRegisterEmailVerifySchema(locale), [locale]);

  const form = useForm<RegisterEmailVerifyInput>({
    resolver: zodResolver(verifySchema),
    mode: "onTouched",
    defaultValues: {
      token,
      username: "",
      displayName: "",
      password: "",
      role: UserRole.CONSUMER,
    },
  });

  useEffect(() => {
    if (!token) return;
    form.setValue("token", token);
    if (hasAuthSession()) {
      clearAuthSession();
      void refresh();
    }
  }, [token, form, refresh]);

  const selectedRole = form.watch("role") as RegisterRoleId | undefined;

  const onSubmit = guardFormEvent(
    form.handleSubmit(
      async (data) => {
        form.clearErrors("root");

        const usernameError = await assertUsernameAvailableForSubmit(
          data.username,
          usernameAvailability,
          registerCopy.account.username,
        );
        if (usernameError) {
          form.setError("username", { message: usernameError });
          release();
          return;
        }

        mutate(data, {
          onError: (error) =>
            applyAuthFormError(error, {
              setError: form.setError,
              context: "verifyEmail",
              locale,
              onToast: (message) => toastService.error(message),
            }),
          onSettled: () => release(),
        });
      },
      () => release(),
    ),
  );

  if (!token) {
    return (
      <AuthFormPanel className="text-sm text-muted-foreground">
        {copy.missingToken}{" "}
        <Link href={ROUTES.register} className="font-medium text-primary">
          {copy.registerAgain}
        </Link>
      </AuthFormPanel>
    );
  }

  return (
    <AuthFormPanel className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{copy.title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{copy.subtitle}</p>
        </div>

        <GuardedForm onSubmit={onSubmit} isSubmitting={isSubmitting} className="flex flex-col gap-4">
          {form.formState.errors.root && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {form.formState.errors.root.message}
            </p>
          )}

          <Controller
            name="username"
            control={form.control}
            render={({ field }) => (
              <UsernameField
                locale={locale}
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={form.formState.errors.username?.message}
                onAvailabilityChange={setUsernameAvailability}
              />
            )}
          />

          <div className="space-y-1.5">
            <Label htmlFor="displayName">{registerCopy.account.displayName}</Label>
            <Input
              id="displayName"
              autoComplete="name"
              className={AUTH_FIELD_CLASS}
              {...form.register("displayName")}
            />
            {form.formState.errors.displayName && (
              <p className="text-sm text-destructive">
                {form.formState.errors.displayName.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">{registerCopy.account.password}</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              className={AUTH_FIELD_CLASS}
              {...form.register("password")}
            />
            <p className="text-xs text-muted-foreground">{registerCopy.account.passwordHint}</p>
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <RoleSelectionStep
            locale={locale}
            value={selectedRole}
            error={form.formState.errors.role?.message}
            onSelect={(roleId) => form.setValue("role", roleId, { shouldValidate: true })}
          />

          <SubmitButton
            isSubmitting={isSubmitting}
            disabled={usernameAvailability.isChecking}
            className="w-full"
          >
            {copy.submit}
          </SubmitButton>
        </GuardedForm>
      </AuthFormPanel>
  );
}
