"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { useGuardedSubmit } from "@/shared/lib/use-guarded-submit";
import { useResendCooldown } from "@/shared/lib/use-resend-cooldown";
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
import { SubmitButton } from "@/shared/ui/submit-button";

import { useSendChangePhoneOtp, useVerifyChangePhone } from "../api/account.queries";
import { getAccountCopy } from "../account.constants";
import {
  createChangePhoneSendSchema,
  createChangePhoneVerifySchema,
  type ChangePhoneSendInput,
  type ChangePhoneVerifyInput,
} from "../model/account.schema";

interface ChangePhoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "add" | "change";
  locale?: AppLocale;
}

export function ChangePhoneDialog({
  open,
  onOpenChange,
  mode = "change",
  locale = getClientLocale(),
}: ChangePhoneDialogProps) {
  const { phone: copy, password: passwordCopy } = getAccountCopy(locale);
  const changePhoneSendSchema = useMemo(() => createChangePhoneSendSchema(locale), [locale]);
  const changePhoneVerifySchema = useMemo(() => createChangePhoneVerifySchema(locale), [locale]);
  const dialogTitle = mode === "add" ? copy.addDialogTitle : copy.changeDialogTitle;
  const [step, setStep] = useState<1 | 2>(1);
  const [newPhone, setNewPhone] = useState("");
  const [devOtp, setDevOtp] = useState<string>();

  const { mutate: sendOtp, isPending: isSending } = useSendChangePhoneOtp();
  const { mutate: verify, isPending: isVerifying } = useVerifyChangePhone();
  const { secondsLeft, canResend, startCooldown } = useResendCooldown(
    `account-change-phone:${newPhone}`,
  );

  const sendGuard = useGuardedSubmit({ isPending: isSending });
  const verifyGuard = useGuardedSubmit({ isPending: isVerifying });

  const sendForm = useForm<ChangePhoneSendInput>({
    resolver: zodResolver(changePhoneSendSchema),
    defaultValues: { currentPassword: "", newPhone: "" },
  });

  const verifyForm = useForm<ChangePhoneVerifyInput>({
    resolver: zodResolver(changePhoneVerifySchema),
    defaultValues: { newPhone: "", otp: "" },
  });

  useEffect(() => {
    if (!open) {
      setStep(1);
      setNewPhone("");
      setDevOtp(undefined);
      sendForm.reset();
      verifyForm.reset();
    }
  }, [open, sendForm, verifyForm]);

  const onSend = sendGuard.guardFormEvent(
    sendForm.handleSubmit(
      (data) => {
        sendOtp(data, {
          onSuccess: (result) => {
            setDevOtp(result.devOtp);
            setNewPhone(data.newPhone);
            verifyForm.setValue("newPhone", data.newPhone);
            startCooldown();
            setStep(2);
          },
          onSettled: () => sendGuard.release(),
        });
      },
      () => sendGuard.release(),
    ),
  );

  const onVerify = verifyGuard.guardFormEvent(
    verifyForm.handleSubmit(
      (data) => {
        verify(data, {
          onSuccess: () => onOpenChange(false),
          onSettled: () => verifyGuard.release(),
        });
      },
      () => verifyGuard.release(),
    ),
  );

  const handleResend = () => {
    if (!canResend || !newPhone) return;
    sendOtp(
      { currentPassword: sendForm.getValues("currentPassword"), newPhone },
      {
        onSuccess: (result) => {
          setDevOtp(result.devOtp);
          startCooldown();
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-[440px]">
        <DialogHeader className="space-y-1.5 border-b border-border px-6 pb-4 pt-6 text-left">
          <DialogTitle className="text-base font-semibold">{dialogTitle}</DialogTitle>
          <DialogDescription>
            {step === 1 ? copy.step1Description : copy.step2Description}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-5">
          {step === 1 ? (
            <GuardedForm
              noValidate
              onSubmit={onSend}
              isSubmitting={sendGuard.isSubmitting}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Label htmlFor="phone-current-password">{passwordCopy.currentPassword}</Label>
                <Input
                  id="phone-current-password"
                  type="password"
                  autoComplete="current-password"
                  {...sendForm.register("currentPassword")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new-phone">{copy.newPhone}</Label>
                <Input id="new-phone" type="tel" inputMode="tel" {...sendForm.register("newPhone")} />
                {sendForm.formState.errors.newPhone && (
                  <p className="text-sm text-destructive">{sendForm.formState.errors.newPhone.message}</p>
                )}
              </div>
              <SubmitButton isSubmitting={sendGuard.isSubmitting} className="w-full">
                {copy.sendOtp}
              </SubmitButton>
            </GuardedForm>
          ) : (
            <GuardedForm
              noValidate
              onSubmit={onVerify}
              isSubmitting={verifyGuard.isSubmitting}
              className="space-y-4"
            >
              {devOtp && (
                <p className="rounded-md border border-dashed border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                  {copy.devOtpHint}{" "}
                  <span className="font-mono font-semibold text-foreground">{devOtp}</span>
                </p>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="phone-otp">{copy.otp}</Label>
                <Input
                  id="phone-otp"
                  inputMode="numeric"
                  maxLength={6}
                  autoComplete="one-time-code"
                  {...verifyForm.register("otp")}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <button type="button" className="text-muted-foreground" onClick={() => setStep(1)}>
                  {copy.back}
                </button>
                <button
                  type="button"
                  disabled={!canResend}
                  onClick={handleResend}
                  className="font-medium text-primary disabled:opacity-50"
                >
                  {canResend ? copy.resend : copy.resendWait.replace("{s}", String(secondsLeft))}
                </button>
              </div>
              <SubmitButton isSubmitting={verifyGuard.isSubmitting} className="w-full">
                {copy.submit}
              </SubmitButton>
            </GuardedForm>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
