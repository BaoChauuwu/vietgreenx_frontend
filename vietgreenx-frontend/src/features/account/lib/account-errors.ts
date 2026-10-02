import { toNormalizedApiError } from "@/shared/api/api";
import type { AppLocale } from "@/shared/i18n/locale";
import { DEFAULT_LOCALE } from "@/shared/i18n/locale";

import { getAccountCopy } from "../account.constants";

const BE_MESSAGE_TO_KEY = {
  "Incorrect current password": "incorrectPassword",
  "Email not found": "emailNotFound",
  "Phone not found": "phoneNotFound",
  "New password does not match": "passwordMismatch",
  "OTP is incorrect": "otpIncorrect",
  "OTP has expired, please request a new one": "otpExpired",
  "Cannot reuse last 3 passwords": "passwordReused",
  "Email already exists": "emailExists",
  "Email exists": "emailExists",
  "Phone already exists": "phoneExists",
} as const;

type AccountErrorKey = keyof typeof BE_MESSAGE_TO_KEY;

export function getAccountErrorMessage(
  error: unknown,
  locale: AppLocale = DEFAULT_LOCALE,
): string {
  const normalized = toNormalizedApiError(error);
  const errors = getAccountCopy(locale).errors;
  const key = BE_MESSAGE_TO_KEY[normalized.message as AccountErrorKey];

  if (key) return errors[key];

  if (normalized.message.includes("60 seconds") || normalized.message.includes("60 second")) {
    return errors.cooldown60s;
  }

  if (normalized.status === 429) return errors.rateLimited;

  if (normalized.status && normalized.status >= 400 && normalized.status < 500) {
    return normalized.message;
  }

  return errors.generic;
}
