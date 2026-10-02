"use client";

import { useRef } from "react";

import { getAuthCopy, OTP_LENGTH } from "../../../auth.constants";
import type { AppLocale } from "@/shared/i18n/locale";
import { Input } from "@/shared/ui/input";

interface VerifyIdentityStepProps {
  locale: AppLocale;
  value: string;
  onChange: (code: string) => void;
  error?: string;
  onResend?: () => void;
  isResending?: boolean;
  resendDisabled?: boolean;
  resendWaitSeconds?: number;
}

export function VerifyIdentityStep({
  locale,
  value,
  onChange,
  error,
  onResend,
  isResending,
  resendDisabled = false,
  resendWaitSeconds = 0,
}: VerifyIdentityStepProps) {
  const copy = getAuthCopy(locale).register.verifyIdentity;
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(OTP_LENGTH, " ").split("").slice(0, OTP_LENGTH);

  const updateCode = (nextDigits: string[]) => {
    onChange(nextDigits.join("").replace(/\s/g, "").slice(0, OTP_LENGTH));
  };

  const handleChange = (index: number, char: string) => {
    const sanitized = char.replace(/\D/g, "").slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = sanitized || " ";
    updateCode(nextDigits);

    if (sanitized && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, key: string) => {
    if (key === "Backspace" && !digits[index]?.trim() && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const resendLabel =
    resendWaitSeconds > 0
      ? copy.resendWait.replace("{s}", String(resendWaitSeconds))
      : isResending
        ? "..."
        : copy.resend;

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <div>
        <h2 className="text-xl font-semibold">{copy.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{copy.subtitle}</p>
      </div>

      <div className="flex justify-center gap-2">
        {digits.map((digit, index) => (
          <Input
            key={"otp-" + index}
            ref={(element) => {
              inputsRef.current[index] = element;
            }}
            inputMode="numeric"
            maxLength={1}
            value={digit.trim()}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event.key)}
            className="size-12 px-0 text-center text-lg"
            aria-label={`OTP digit ${index + 1}`}
          />
        ))}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <p className="text-sm text-muted-foreground">
        {copy.resendHint}{" "}
        <button
          type="button"
          disabled={isResending || resendDisabled}
          onClick={onResend}
          className="font-medium text-primary hover:text-primary/90 disabled:opacity-50"
        >
          {resendLabel}
        </button>
      </p>
    </div>
  );
}
