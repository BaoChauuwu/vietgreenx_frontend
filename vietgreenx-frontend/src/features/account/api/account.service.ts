import { createService } from "@/shared/api/create-service";

import type {
  AccountCredentials,
  ChangeEmailSendInput,
  ChangeEmailVerifyInput,
  ChangePasswordInput,
  ChangePhoneSendInput,
  ChangePhoneVerifyInput,
  DeleteAccountInput,
  SendChangePasswordOtpInput,
} from "../model/account.schema";
import {
  accountCredentialsSchema,
  exportPersonalDataSchema,
  messageResponseSchema,
} from "../model/account.schema";

const http = createService("/account");

export const accountService = {
  getCredentials() {
    return http.get<AccountCredentials>("/credentials", undefined, {
      schema: accountCredentialsSchema,
    });
  },

  exportPersonalData(): Promise<Record<string, unknown>> {
    return http.get<Record<string, unknown>>("/export-personal-data", undefined, {
      schema: exportPersonalDataSchema,
    });
  },

  sendChangePasswordOtp(input: SendChangePasswordOtpInput) {
    return http
      .post<unknown>("/change-password/send-otp", input)
      .then((data) => messageResponseSchema.parse(data));
  },

  verifyChangePassword(input: ChangePasswordInput) {
    return http
      .post<unknown>("/change-password/verify-otp", input)
      .then((data) => messageResponseSchema.parse(data));
  },

  sendChangeEmailOtp(input: ChangeEmailSendInput) {
    return http
      .post<unknown>("/change-email/send-otp", input)
      .then((data) => messageResponseSchema.parse(data));
  },

  verifyChangeEmail(input: ChangeEmailVerifyInput) {
    return http
      .post<unknown>("/change-email/verify-otp", input)
      .then((data) => messageResponseSchema.parse(data));
  },

  sendChangePhoneOtp(input: ChangePhoneSendInput) {
    return http
      .post<unknown>("/change-phone/send-otp", input)
      .then((data) => messageResponseSchema.parse(data));
  },

  verifyChangePhone(input: ChangePhoneVerifyInput) {
    return http
      .post<unknown>("/change-phone/verify-otp", input)
      .then((data) => messageResponseSchema.parse(data));
  },

  deleteAccount(input: DeleteAccountInput) {
    return http
      .post<unknown>("/delete-account", input)
      .then((data) => messageResponseSchema.parse(data));
  },
};
