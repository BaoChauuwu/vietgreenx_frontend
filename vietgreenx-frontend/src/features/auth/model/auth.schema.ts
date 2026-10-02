import { z } from "zod";

import { REGISTERABLE_ROLES } from "@/shared/auth/auth.schema";
import type { AppLocale } from "@/shared/i18n/locale";
import { createPasswordSchemaForLocale } from "@/shared/lib/password-schema";
import { otpMessageResponseSchema } from "@/shared/lib/otp-message.schema";
import { isValidPhone, normalizePhone, PHONE_REGEX } from "@/shared/lib/phone";

import { getAuthCopy, getAuthValidationCopy } from "../auth.constants";
import { USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH, USERNAME_PATTERN } from "../lib/username";

export { REGISTERABLE_ROLES } from "@/shared/auth/auth.schema";
export { passwordSchema } from "@/shared/lib/password-schema";
export type { RegisterableRole } from "@/shared/auth/auth.schema";

export const sendOtpResponseSchema = otpMessageResponseSchema;

export function createUsernameSchema(locale: AppLocale) {
  const messages = getAuthCopy(locale).register.account.username;

  return z
    .string()
    .trim()
    .min(1, messages.required)
    .min(USERNAME_MIN_LENGTH, messages.tooShort)
    .max(USERNAME_MAX_LENGTH, messages.tooLong)
    .regex(USERNAME_PATTERN, messages.invalid);
}

export const registerRoleSchema = z.enum(REGISTERABLE_ROLES);

function phoneFieldSchema(locale: AppLocale) {
  const m = getAuthValidationCopy(locale);
  return z
    .string()
    .trim()
    .min(1, m.phoneRequired)
    .transform(normalizePhone)
    .refine(isValidPhone, { message: m.phoneInvalid });
}

export function createLoginSchema(locale: AppLocale) {
  const m = getAuthValidationCopy(locale);

  return z.object({
    identifier: z
      .string()
      .trim()
      .min(1, m.identifierRequired)
      .transform((val) => {
        if (/^[0-9+]/.test(val)) return normalizePhone(val);
        return val;
      })
      .refine(
        (val) => {
          const isPhone = /^[0-9]/.test(val);
          return isPhone ? PHONE_REGEX.test(val) : z.string().email().safeParse(val).success;
        },
        { message: m.identifierInvalid },
      ),
    password: z.string().min(6, m.loginPasswordMin),
    remember: z.boolean().optional(),
  });
}

export function createRegisterPhoneSendSchema(locale: AppLocale) {
  return z.object({
    phone: phoneFieldSchema(locale),
  });
}

export function createRegisterPhoneAccountStepSchema(locale: AppLocale) {
  const m = getAuthValidationCopy(locale);

  return z.object({
    username: createUsernameSchema(locale),
    displayName: z.string().trim().min(1, m.displayNameRequired).max(100),
    password: createPasswordSchemaForLocale(locale),
    role: registerRoleSchema,
  });
}

export function createRegisterPhoneVerifySchema(locale: AppLocale) {
  const m = getAuthValidationCopy(locale);

  return z.object({
    phone: z.string().min(1),
    otp: z.string().length(6, m.otpLength),
    username: createUsernameSchema(locale),
    displayName: z.string().trim().min(1, m.displayNameRequired).max(100),
    password: createPasswordSchemaForLocale(locale),
    role: registerRoleSchema,
  });
}

export function createRegisterEmailSendSchema(locale: AppLocale) {
  const m = getAuthValidationCopy(locale);

  return z.object({
    email: z.string().trim().email(m.emailInvalid),
  });
}

export function createRegisterEmailVerifySchema(locale: AppLocale) {
  const m = getAuthValidationCopy(locale);

  return z.object({
    token: z.string().min(1, m.tokenInvalid),
    username: createUsernameSchema(locale),
    displayName: z.string().trim().min(1, m.displayNameRequired).max(100),
    password: createPasswordSchemaForLocale(locale),
    role: registerRoleSchema,
  });
}

export function createResetPasswordFormSchema(locale: AppLocale) {
  const m = getAuthValidationCopy(locale);

  return z
    .object({
      otp: z.string().length(6, m.otpLength),
      newPassword: createPasswordSchemaForLocale(locale),
      confirmPassword: z.string().min(1, m.confirmPasswordRequired),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: m.passwordMismatch,
      path: ["confirmPassword"],
    });
}

export const forgotPasswordSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập email hoặc số điện thoại")
    .refine(
      (val) => {
        if (/^[0-9+]/.test(val)) return PHONE_REGEX.test(normalizePhone(val));
        return z.string().email().safeParse(val).success;
      },
      { message: "Email hoặc số điện thoại không hợp lệ" },
    ),
});

export const resetPasswordSchema = z
  .object({
    otp: z.string().length(6, "OTP phải có đúng 6 số"),
    newPassword: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export const authMessageResponseSchema = z.object({
  message: z.string().optional(),
});

export const checkUsernameResponseSchema = z.object({
  available: z.boolean(),
});

export const checkOtpResponseSchema = z.object({
  valid: z.boolean(),
});

export const authSessionSchema = z.object({
  id: z.string().uuid(),
  deviceName: z.string().nullable(),
  platform: z.string().nullable(),
  ipAddress: z.string().nullable(),
  lastUsedAt: z.string().nullable(),
  createdAt: z.string(),
  isCurrent: z.boolean(),
});

export type LoginInput = z.infer<ReturnType<typeof createLoginSchema>>;
export type RegisterPhoneSendInput = z.infer<ReturnType<typeof createRegisterPhoneSendSchema>>;
export type RegisterPhoneVerifyInput = z.infer<ReturnType<typeof createRegisterPhoneVerifySchema>>;
export type RegisterEmailSendInput = z.infer<ReturnType<typeof createRegisterEmailSendSchema>>;
export type RegisterEmailVerifyInput = z.infer<ReturnType<typeof createRegisterEmailVerifySchema>>;
export type ForgotPasswordPhoneInput = RegisterPhoneSendInput;
export type ForgotPasswordEmailInput = RegisterEmailSendInput;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ResetPasswordFormInput = z.infer<ReturnType<typeof createResetPasswordFormSchema>>;
export type RegisterPhoneAccountStepInput = z.infer<
  ReturnType<typeof createRegisterPhoneAccountStepSchema>
>;
export type AuthSession = z.infer<typeof authSessionSchema>;
export type CheckUsernameResponse = z.infer<typeof checkUsernameResponseSchema>;
