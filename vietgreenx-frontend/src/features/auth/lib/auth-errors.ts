import { toNormalizedApiError } from "@/shared/api/api";
import type { AppLocale } from "@/shared/i18n/locale";
import { DEFAULT_LOCALE } from "@/shared/i18n/locale";

import { getAuthErrorCopy } from "../auth.constants";

export type AuthErrorContext =
  | "login"
  | "register"
  | "registerPhone"
  | "verifyOtp"
  | "verifyEmail"
  | "resendOtp"
  | "resendEmail"
  | "forgotPassword"
  | "resetPassword";

type BeMessageKey = keyof ReturnType<typeof getAuthErrorCopy>["be"];

const BE_MESSAGE_TO_KEY: Record<string, BeMessageKey> = {
  "Phone already exists": "phoneExists",
  "Email already exists": "emailExists",
  "Email exists": "emailExists",
  "OTP is incorrect": "otpIncorrect",
  "OTP has expired, please request a new one": "otpExpired",
  "Verification link is invalid or expired": "linkInvalid",
  "Login information is incorrect": "loginIncorrect",
  // Error codes returned in `data.error` (no `data.message`)
  "OTP_COOLDOWN_ACTIVE": "cooldown60s",
  "OTP_DAILY_LIMIT_EXCEEDED": "dailyLimitExceeded",
};

const EMAIL_EXISTS_BE = new Set(["Email already exists", "Email exists"]);
const PHONE_EXISTS_BE = new Set(["Phone already exists"]);

function mapBeMessage(
  message: string,
  be: ReturnType<typeof getAuthErrorCopy>["be"],
): string | undefined {
  const key = BE_MESSAGE_TO_KEY[message];
  if (key) return be[key];

  if (message.includes("60 seconds") || message.includes("60 second")) {
    return be.cooldown60s;
  }

  if (message.toLowerCase().includes("password must be at least 8")) {
    return be.passwordMin8;
  }

  if (message.includes("Cannot reuse last")) {
    return be.passwordReused;
  }

  return undefined;
}

function getStatusMessage(
  context: AuthErrorContext,
  status: number | undefined,
  copy: ReturnType<typeof getAuthErrorCopy>,
): string | undefined {
  if (!status) return undefined;

  switch (context) {
    case "login": {
      if (status === 401) return copy.login.unauthorized;
      if (status === 429) return copy.login.rateLimited;
      break;
    }
    case "register": {
      if (status === 400 || status === 409) return copy.register.emailExists;
      if (status === 422) return copy.register.invalid;
      if (status === 429) return copy.register.rateLimited;
      break;
    }
    case "registerPhone": {
      if (status === 400 || status === 409) return copy.registerPhone.phoneExists;
      if (status === 429) return copy.registerPhone.rateLimited;
      break;
    }
    case "verifyOtp": {
      if (status === 401) return copy.verifyOtp.unauthorized;
      if (status === 429) return copy.verifyOtp.rateLimited;
      break;
    }
    case "verifyEmail": {
      if (status === 400 || status === 422) return copy.verifyEmail.invalidLink;
      break;
    }
    case "resendOtp": {
      if (status === 429) return copy.resendOtp.rateLimited;
      break;
    }
    case "resendEmail": {
      if (status === 429) return copy.resendEmail.rateLimited;
      break;
    }
    case "forgotPassword": {
      if (status === 429) return copy.forgotPassword.rateLimited;
      break;
    }
    case "resetPassword": {
      if (status === 400 || status === 401) return copy.resetPassword.default;
      if (status === 429) return copy.resetPassword.rateLimited;
      break;
    }
  }

  return undefined;
}

function getContextDefault(context: AuthErrorContext, copy: ReturnType<typeof getAuthErrorCopy>): string {
  return copy[context].default;
}

export function getAuthErrorMessage(
  error: unknown,
  context: AuthErrorContext,
  locale: AppLocale = DEFAULT_LOCALE,
): string {
  const normalized = toNormalizedApiError(error);
  const copy = getAuthErrorCopy(locale);

  const mapped = mapBeMessage(normalized.message, copy.be);
  if (mapped) return mapped;

  const statusMessage = getStatusMessage(context, normalized.status, copy);
  if (statusMessage) return statusMessage;

  if (normalized.status && normalized.status >= 400 && normalized.status < 500) {
    return normalized.message;
  }

  return getContextDefault(context, copy) ?? copy.generic;
}

export function isEmailAlreadyExistsError(error: unknown): boolean {
  const { message } = toNormalizedApiError(error);
  return EMAIL_EXISTS_BE.has(message);
}

export function isPhoneAlreadyExistsError(error: unknown): boolean {
  const { message } = toNormalizedApiError(error);
  return PHONE_EXISTS_BE.has(message);
}
