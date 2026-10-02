"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

import type { AppLocale } from "@/shared/i18n/locale";
import { useGuardedSubmit } from "@/shared/lib/use-guarded-submit";
import { toastService } from "@/shared/lib/toast";
import { ROUTES } from "@/shared/routing";
import { GuardedForm } from "@/shared/ui/guarded-form";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { SubmitButton } from "@/shared/ui/submit-button";

import { useLogin } from "../api/auth.queries";
import { getAuthCopy } from "../auth.constants";
import { applyAuthFormError } from "../lib/auth-form-errors";
import { createLoginSchema, type LoginInput } from "../model/auth.schema";
import { AUTH_FIELD_CLASS, AuthFormPanel } from "./AuthFormPanel";

interface LoginFormProps {
  locale: AppLocale;
}

const INPUT_CLASS = AUTH_FIELD_CLASS;

export function LoginForm({ locale }: LoginFormProps) {
  const copy = getAuthCopy(locale).loginForm;
  const loginSchema = useMemo(() => createLoginSchema(locale), [locale]);
  const { mutate, isPending } = useLogin();
  const { guardFormEvent, release, isSubmitting } = useGuardedSubmit({ isPending });

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { remember: false },
  });

  const onSubmit = guardFormEvent(
    handleSubmit(
      (data) => {
        clearErrors("identifier");
        mutate(data, {
          onError: (error) =>
            applyAuthFormError(error, {
              setError,
              field: "identifier",
              context: "login",
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
    <>
      {/* mobile: below image banner; tablet: hidden (card overlays bg); desktop: above card */}
      <h1
        className={[
          "font-bold leading-tight tracking-tight text-primary",
          // mobile
          "mb-5 text-[1.8rem]",
          // tablet: hide (card on bg image, no heading outside)
          "md:hidden",
          // desktop: show again, larger
          "xl:mb-6 xl:block xl:text-center xl:text-[2.4rem]",
        ].join(" ")}
      >
        {copy.welcomeHeading}
      </h1>

      <AuthFormPanel>
        <p className="text-sm text-muted-foreground">{copy.subtitle}</p>

        <GuardedForm noValidate onSubmit={onSubmit} isSubmitting={isSubmitting} className="flex flex-col gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="identifier" className="text-sm font-medium text-foreground">
              {copy.identifier}
            </Label>
            <Input
              id="identifier"
              type="text"
              inputMode="text"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              placeholder={copy.identifierPlaceholder}
              autoComplete="username"
              className={INPUT_CLASS}
              {...register("identifier")}
            />
            {errors.identifier && (
              <p className="text-sm text-destructive">{errors.identifier.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                {copy.password}
              </Label>
              <Link
                href={ROUTES.forgotPassword}
                className="text-sm font-medium text-secondary hover:text-secondary/80"
              >
                {copy.forgot}
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              className={INPUT_CLASS}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm text-foreground/70">
            <input type="checkbox" className="accent-primary" {...register("remember")} />
            {copy.remember}
          </label>

          <SubmitButton
            isSubmitting={isSubmitting}
            className="h-[52px] w-full rounded-[14px] bg-gradient-to-r from-primary to-tertiary font-semibold text-white shadow-[0px_4px_16px_0px_rgba(48,196,66,0.3),0px_2px_8px_0px_rgba(3,134,69,0.2)] hover:opacity-90"
          >
            {copy.submit}
          </SubmitButton>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">{copy.divider}</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <button
            type="button"
            disabled
            title={copy.featureComingSoon}
            className="flex h-[52px] w-full cursor-not-allowed items-center justify-center gap-2 rounded-[14px] bg-neutral-400 font-semibold text-white/70"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            {copy.otpLogin}
          </button>
        </GuardedForm>

        <p className="text-center text-sm text-muted-foreground">
          {copy.noAccount}{" "}
          <Link href={ROUTES.register} className="font-semibold text-primary hover:text-primary/80">
            {copy.signUp}
          </Link>
        </p>
      </AuthFormPanel>
    </>
  );
}
