import { z } from "zod";

import type { AppLocale } from "@/shared/i18n/locale";

export type PasswordValidationMessages = {
  min: string;
  pattern: string;
};

const PASSWORD_MESSAGES = {
  vi: {
    min: "Mật khẩu tối thiểu 8 ký tự",
    pattern: "Mật khẩu phải có ít nhất 1 chữ và 1 số",
  },
  en: {
    min: "Password must be at least 8 characters",
    pattern: "Password must include at least one letter and one number",
  },
} as const satisfies Record<AppLocale, PasswordValidationMessages>;

export function createPasswordSchema(messages: PasswordValidationMessages) {
  return z
    .string()
    .min(8, messages.min)
    .regex(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/, messages.pattern);
}

export function createPasswordSchemaForLocale(locale: AppLocale) {
  return createPasswordSchema(PASSWORD_MESSAGES[locale] ?? PASSWORD_MESSAGES.vi);
}

/** @deprecated Prefer `createPasswordSchemaForLocale(locale)` for locale-aware messages. */
export const passwordSchema = createPasswordSchema(PASSWORD_MESSAGES.vi);
