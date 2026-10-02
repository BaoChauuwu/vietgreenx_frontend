import { publicRequest } from "@/shared/api/api";
import { parseApiResponse } from "@/shared/api/create-service";
import type { AuthUser } from "@/shared/auth";
import { authTokenResponseSchema } from "@/shared/auth/auth-token.schema";
import { sessionService } from "./session.service";
import { persistAuthSession } from "@/shared/auth/token-storage";

import { normalizePhone, isPhoneIdentifier } from "@/shared/lib/phone";
import {
  type ForgotPasswordInput,
  type LoginInput,
  type RegisterEmailSendInput,
  type RegisterEmailVerifyInput,
  type RegisterPhoneSendInput,
  type RegisterPhoneVerifyInput,
  type ForgotPasswordEmailInput,
  type ForgotPasswordPhoneInput,
  type ResetPasswordInput,
  checkUsernameResponseSchema,
  checkOtpResponseSchema,
  sendOtpResponseSchema,
} from "../model/auth.schema";
type LoginPayload = { identifier: string; password: string };

function resolveIdentifierBody(identifier: string) {
  return isPhoneIdentifier(identifier)
    ? { phone: normalizePhone(identifier) }
    : { email: identifier.trim() };
}

async function establishSession(tokens: unknown): Promise<AuthUser> {
  persistAuthSession(authTokenResponseSchema.parse(tokens));
  const { user } = await sessionService.me();
  return user;
}

async function loginWithTokens(input: LoginInput): Promise<AuthUser> {
  const identifier = isPhoneIdentifier(input.identifier)
    ? normalizePhone(input.identifier)
    : input.identifier.trim();

  const tokens = await publicRequest<unknown>({
    method: "POST",
    url: "/auth/login",
    data: { identifier, password: input.password } satisfies LoginPayload,
  });
  return establishSession(tokens);
}

export const authService = {
  login: (input: LoginInput) => loginWithTokens(input),

  forgotPassword: (input: ForgotPasswordInput) =>
    publicRequest<unknown>({
      method: "POST",
      url: "/auth/forgot-password",
      data: resolveIdentifierBody(input.identifier),
    }).then((data) => parseApiResponse(data, sendOtpResponseSchema)),

  resetPassword: (input: ResetPasswordInput & { identifier: string }): Promise<void> =>
    publicRequest<void>({
      method: "POST",
      url: "/auth/reset-password",
      data: {
        ...resolveIdentifierBody(input.identifier),
        otp: input.otp,
        newPassword: input.newPassword,
      },
    }),

  checkPhoneOtp: (input: { phone: string; otp: string }) =>
    publicRequest<unknown>({
      method: "POST",
      url: "/auth/register/phone/check-otp",
      data: { phone: normalizePhone(input.phone), otp: input.otp },
    }).then((data) => parseApiResponse(data, checkOtpResponseSchema)),

  registerPhone: (input: RegisterPhoneSendInput) =>
    publicRequest<unknown>({
      method: "POST",
      url: "/auth/register/phone",
      data: { phone: input.phone },
    }).then((data) => parseApiResponse(data, sendOtpResponseSchema)),

  verifyPhoneRegister: (input: RegisterPhoneVerifyInput) =>
    publicRequest<unknown>({
      method: "POST",
      url: "/auth/register/phone/verify",
      data: {
        phone: input.phone,
        otp: input.otp,
        username: input.username,
        displayName: input.displayName,
        password: input.password,
        role: input.role,
      },
    }).then(establishSession),

  registerEmail: (input: RegisterEmailSendInput) =>
    publicRequest<unknown>({
      method: "POST",
      url: "/auth/register/email",
      data: { email: input.email },
    }).then((data) => parseApiResponse(data, sendOtpResponseSchema)),

  verifyEmailRegister: (input: RegisterEmailVerifyInput) =>
    publicRequest<unknown>({
      method: "POST",
      url: "/auth/register/email/verify",
      data: {
        token: input.token,
        username: input.username,
        displayName: input.displayName,
        password: input.password,
        role: input.role,
      },
    }).then(establishSession),

  forgotPasswordByPhone: (input: ForgotPasswordPhoneInput) =>
    publicRequest<unknown>({
      method: "POST",
      url: "/auth/forgot-password",
      data: { phone: input.phone },
    }).then((data) => sendOtpResponseSchema.parse(data)),

  forgotPasswordByEmail: (input: ForgotPasswordEmailInput) =>
    publicRequest<unknown>({
      method: "POST",
      url: "/auth/forgot-password",
      data: { email: input.email },
    }).then((data) => sendOtpResponseSchema.parse(data)),

  checkUsername(username: string) {
    return publicRequest<unknown>({
      method: "GET",
      url: "/auth/check-username",
      params: { username },
    }).then((data) => checkUsernameResponseSchema.parse(data));
  },
};
