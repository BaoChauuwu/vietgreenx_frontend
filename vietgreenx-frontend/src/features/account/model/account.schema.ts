import { z } from "zod";

import type { AppLocale } from "@/shared/i18n/locale";
import { createPasswordSchemaForLocale } from "@/shared/lib/password-schema";
import { isValidPhone, normalizePhone } from "@/shared/lib/phone";

import { getAccountValidationCopy } from "../account.constants";

import { otpMessageResponseSchema as messageResponseSchema } from "@/shared/lib/otp-message.schema";

export { messageResponseSchema };

export const otpChannelSchema = z.enum(["email", "phone"]);

export const credentialChannelSchema = z.object({
  present: z.boolean(),
  verified: z.boolean(),
  masked: z.string().nullable(),
});

export const signupChannelSchema = z.enum(["phone", "email"]);

export const accountCredentialsSchema = z.object({
  email: credentialChannelSchema,
  phone: credentialChannelSchema,
  registeredWith: signupChannelSchema.nullable().optional(),
});

function phoneFieldSchema(requiredMessage: string, invalidMessage: string) {
  return z
    .string()
    .trim()
    .min(1, requiredMessage)
    .transform(normalizePhone)
    .refine(isValidPhone, { message: invalidMessage });
}

export function createSendChangePasswordOtpSchema(locale: AppLocale) {
  const m = getAccountValidationCopy(locale);
  return z.object({
    channel: otpChannelSchema,
    currentPassword: z.string().min(1, m.currentPasswordRequired),
  });
}

export function createChangePasswordSchema(locale: AppLocale) {
  const m = getAccountValidationCopy(locale);
  const passwordSchema = createPasswordSchemaForLocale(locale);

  return z
    .object({
      channel: otpChannelSchema,
      currentPassword: z.string().min(1, m.currentPasswordRequired),
      newPassword: passwordSchema,
      verifyPassword: z.string().min(1, m.verifyPasswordRequired),
      otp: z.string().length(6, m.otpLength),
    })
    .refine((data) => data.newPassword === data.verifyPassword, {
      message: m.passwordMismatch,
      path: ["verifyPassword"],
    });
}

export function createDeleteAccountSchema(locale: AppLocale) {
  const m = getAccountValidationCopy(locale);
  return z.object({
    currentPassword: z.string().min(1, m.deletePasswordRequired),
  });
}

export function createChangeEmailSendSchema(locale: AppLocale) {
  const m = getAccountValidationCopy(locale);
  return z.object({
    currentPassword: z.string().min(1, m.currentPasswordRequired),
    newEmail: z.string().trim().email(m.emailInvalid),
  });
}

export function createChangeEmailVerifySchema(locale: AppLocale) {
  const m = getAccountValidationCopy(locale);
  return z.object({
    newEmail: z.string().trim().email(m.emailInvalid),
    otp: z.string().length(6, m.otpLength),
  });
}

export function createChangePhoneSendSchema(locale: AppLocale) {
  const m = getAccountValidationCopy(locale);
  return z.object({
    currentPassword: z.string().min(1, m.currentPasswordRequired),
    newPhone: phoneFieldSchema(m.phoneRequired, m.phoneInvalid),
  });
}

export function createChangePhoneVerifySchema(locale: AppLocale) {
  const m = getAccountValidationCopy(locale);
  return z.object({
    newPhone: phoneFieldSchema(m.phoneRequired, m.phoneInvalid),
    otp: z.string().length(6, m.otpLength),
  });
}

export const exportPersonalDataSchema = z.record(z.string(), z.unknown());

export type OtpChannel = z.infer<typeof otpChannelSchema>;
export type CredentialChannel = z.infer<typeof credentialChannelSchema>;
export type SignupChannel = z.infer<typeof signupChannelSchema>;
export type AccountCredentials = z.infer<typeof accountCredentialsSchema>;
export type SendChangePasswordOtpInput = z.infer<
  ReturnType<typeof createSendChangePasswordOtpSchema>
>;
export type ChangePasswordInput = z.infer<ReturnType<typeof createChangePasswordSchema>>;
export type DeleteAccountInput = z.infer<ReturnType<typeof createDeleteAccountSchema>>;
export type ChangeEmailSendInput = z.infer<ReturnType<typeof createChangeEmailSendSchema>>;
export type ChangeEmailVerifyInput = z.infer<ReturnType<typeof createChangeEmailVerifySchema>>;
export type ChangePhoneSendInput = z.infer<ReturnType<typeof createChangePhoneSendSchema>>;
export type ChangePhoneVerifyInput = z.infer<ReturnType<typeof createChangePhoneVerifySchema>>;
