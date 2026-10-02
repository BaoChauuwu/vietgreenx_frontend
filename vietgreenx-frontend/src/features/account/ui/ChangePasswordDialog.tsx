"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { cn } from "@/shared/lib/cn";
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

import { useChangePassword, useSendChangePasswordOtp } from "../api/account.queries";
import { getAccountCopy } from "../account.constants";
import { availableOtpChannels, defaultOtpChannel } from "../lib/account-credentials";
import {
  createChangePasswordSchema,
  createSendChangePasswordOtpSchema,
  type AccountCredentials,
  type ChangePasswordInput,
  type OtpChannel,
  type SendChangePasswordOtpInput,
} from "../model/account.schema";

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  credentials: AccountCredentials;
  locale?: AppLocale;
}

export function ChangePasswordDialog({
  open,
  onOpenChange,
  credentials,
  locale = getClientLocale(),
}: ChangePasswordDialogProps) {
  const copy = getAccountCopy(locale).password;
  const sendChangePasswordOtpSchema = useMemo(
    () => createSendChangePasswordOtpSchema(locale),
    [locale],
  );
  const changePasswordSchema = useMemo(() => createChangePasswordSchema(locale), [locale]);
  const otpChannels = useMemo(() => availableOtpChannels(credentials), [credentials]);
  const initialChannel = useMemo(() => defaultOtpChannel(credentials), [credentials]);

  const [step, setStep] = useState<1 | 2>(1);
  const [channel, setChannel] = useState<OtpChannel>(initialChannel ?? "email");
  const [devOtp, setDevOtp] = useState<string>();
  const [savedPassword, setSavedPassword] = useState("");

  const { mutate: sendOtp, isPending: isSendingOtp } = useSendChangePasswordOtp();
  const { mutate: changePassword, isPending: isChanging } = useChangePassword();
  const { secondsLeft, canResend, startCooldown } = useResendCooldown(
    `account-change-password:${channel}`,
  );

  const sendForm = useForm<SendChangePasswordOtpInput>({
    resolver: zodResolver(sendChangePasswordOtpSchema),
    defaultValues: { channel: initialChannel ?? "email", currentPassword: "" },
  });

  const passwordForm = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      channel: initialChannel ?? "email",
      currentPassword: "",
      newPassword: "",
      verifyPassword: "",
      otp: "",
    },
  });

  const sendGuard = useGuardedSubmit({ isPending: isSendingOtp });
  const changeGuard = useGuardedSubmit({ isPending: isChanging });

  useEffect(() => {
    if (!open) {
      setStep(1);
      setDevOtp(undefined);
      setSavedPassword("");
      const ch = initialChannel ?? "email";
      setChannel(ch);
      sendForm.reset({ channel: ch, currentPassword: "" });
      passwordForm.reset({
        channel: ch,
        currentPassword: "",
        newPassword: "",
        verifyPassword: "",
        otp: "",
      });
      return;
    }
    if (otpChannels.length === 1) {
      const ch = otpChannels[0]!;
      setChannel(ch);
      sendForm.setValue("channel", ch);
    }
  }, [open, initialChannel, otpChannels, sendForm, passwordForm]);

  const onSendOtp = sendGuard.guardFormEvent(
    sendForm.handleSubmit(
      (data) => {
        setChannel(data.channel);
        setSavedPassword(data.currentPassword);
        sendOtp(data, {
          onSuccess: (result) => {
            setDevOtp(result.devOtp);
            startCooldown();
            passwordForm.setValue("channel", data.channel);
            passwordForm.setValue("currentPassword", data.currentPassword);
            setStep(2);
          },
          onSettled: () => sendGuard.release(),
        });
      },
      () => sendGuard.release(),
    ),
  );

  const onChangePassword = changeGuard.guardFormEvent(
    passwordForm.handleSubmit(
      (data) => {
        changePassword(data, {
          onSuccess: () => onOpenChange(false),
          onSettled: () => changeGuard.release(),
        });
      },
      () => changeGuard.release(),
    ),
  );

  const handleResendOtp = () => {
    if (!canResend || !savedPassword) return;
    sendOtp(
      { channel, currentPassword: savedPassword },
      {
        onSuccess: (result) => {
          setDevOtp(result.devOtp);
          startCooldown();
        },
      },
    );
  };

  const showChannelPicker = otpChannels.length > 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-[440px]">
        <DialogHeader className="space-y-1.5 border-b border-border px-6 pb-4 pt-6 text-left">
          <DialogTitle className="text-base font-semibold">{copy.dialogTitle}</DialogTitle>
          <DialogDescription>
            {step === 1 ? copy.step1Description : copy.step2Description}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-5">
          {otpChannels.length === 0 ? (
            <p className="text-sm text-muted-foreground">{copy.noOtpChannel}</p>
          ) : step === 1 ? (
            <GuardedForm
              noValidate
              onSubmit={onSendOtp}
              isSubmitting={sendGuard.isSubmitting}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Label htmlFor="pwd-current">{copy.currentPassword}</Label>
                <Input
                  id="pwd-current"
                  type="password"
                  autoComplete="current-password"
                  {...sendForm.register("currentPassword")}
                />
                {sendForm.formState.errors.currentPassword && (
                  <p className="text-sm text-destructive">
                    {sendForm.formState.errors.currentPassword.message}
                  </p>
                )}
              </div>

              {showChannelPicker ? (
                <div className="flex rounded-lg border border-border bg-muted/30 p-0.5">
                  {otpChannels.map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        setChannel(id);
                        sendForm.setValue("channel", id);
                      }}
                      className={cn(
                        "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        channel === id
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {copy.channels[id]}
                    </button>
                  ))}
                </div>
              ) : (
                <>
                  <input type="hidden" {...sendForm.register("channel")} />
                  <p className="text-sm text-muted-foreground">
                    OTP: {copy.channels[otpChannels[0]!]}
                  </p>
                </>
              )}

              <SubmitButton isSubmitting={sendGuard.isSubmitting} className="w-full">
                {copy.sendOtp}
              </SubmitButton>
            </GuardedForm>
          ) : (
            <GuardedForm
              noValidate
              onSubmit={onChangePassword}
              isSubmitting={changeGuard.isSubmitting}
              className="space-y-4"
            >
              {devOtp && (
                <p className="rounded-md border border-dashed border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                  {copy.devOtpHint}{" "}
                  <span className="font-mono font-semibold text-foreground">{devOtp}</span>
                </p>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="new-password">{copy.newPassword}</Label>
                <Input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  {...passwordForm.register("newPassword")}
                />
                <p className="text-xs text-muted-foreground">{copy.passwordHint}</p>
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-sm text-destructive">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="verify-password">{copy.confirmPassword}</Label>
                <Input
                  id="verify-password"
                  type="password"
                  autoComplete="new-password"
                  {...passwordForm.register("verifyPassword")}
                />
                {passwordForm.formState.errors.verifyPassword && (
                  <p className="text-sm text-destructive">
                    {passwordForm.formState.errors.verifyPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="change-otp">{copy.otp}</Label>
                <Input
                  id="change-otp"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  {...passwordForm.register("otp")}
                />
                {passwordForm.formState.errors.otp && (
                  <p className="text-sm text-destructive">{passwordForm.formState.errors.otp.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => setStep(1)}
                >
                  {copy.back}
                </button>
                <button
                  type="button"
                  disabled={!canResend || sendGuard.isSubmitting}
                  onClick={handleResendOtp}
                  className="font-medium text-primary hover:text-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {canResend ? copy.resend : copy.resendWait.replace("{s}", String(secondsLeft))}
                </button>
              </div>

              <SubmitButton isSubmitting={changeGuard.isSubmitting} className="w-full">
                {copy.submit}
              </SubmitButton>
            </GuardedForm>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
