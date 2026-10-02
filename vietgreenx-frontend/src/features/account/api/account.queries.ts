"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useUser } from "@/shared/auth";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { useSingleFlightMutation } from "@/shared/lib/use-single-flight-mutation";
import { toastService } from "@/shared/lib/toast";
import { ROUTES } from "@/shared/routing";

import { getAccountCopy } from "../account.constants";
import { getAccountErrorMessage } from "../lib/account-errors";
import type {
  ChangeEmailSendInput,
  ChangeEmailVerifyInput,
  ChangePhoneSendInput,
  ChangePhoneVerifyInput,
} from "../model/account.schema";
import { accountService } from "./account.service";

export const accountKeys = {
  all: ["account"] as const,
  credentials: () => [...accountKeys.all, "credentials"] as const,
};

export function useAccountCredentials() {
  const { user } = useUser();

  return useQuery({
    queryKey: accountKeys.credentials(),
    queryFn: () => accountService.getCredentials(),
    enabled: Boolean(user?.id),
    staleTime: 60_000,
  });
}

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function useExportPersonalData() {
  const copy = getAccountCopy(getClientLocale()).export;

  return useSingleFlightMutation({
    mutationFn: () => accountService.exportPersonalData(),
    onSuccess: (data) => {
      downloadJson("vietgreenx-personal-data.json", data);
      toastService.success(copy.success);
    },
    onError: () => {
      toastService.error(copy.error);
    },
  });
}

export function useSendChangePasswordOtp() {
  const locale = getClientLocale();

  return useSingleFlightMutation({
    mutationFn: accountService.sendChangePasswordOtp,
    onError: (error) => toastService.error(getAccountErrorMessage(error, locale)),
  });
}

export function useChangePassword() {
  const { logout } = useUser();
  const router = useRouter();
  const locale = getClientLocale();
  const copy = getAccountCopy(locale).password;

  return useSingleFlightMutation({
    mutationFn: accountService.verifyChangePassword,
    onSuccess: async () => {
      toastService.success(copy.success);
      await logout();
      router.replace(ROUTES.login);
    },
    onError: (error) => toastService.error(getAccountErrorMessage(error, locale)),
  });
}

export function useDeleteAccount() {
  const { logout } = useUser();
  const router = useRouter();
  const locale = getClientLocale();
  const copy = getAccountCopy(locale).delete;

  return useSingleFlightMutation({
    mutationFn: accountService.deleteAccount,
    onSuccess: async () => {
      toastService.success(copy.success);
      await logout();
      router.replace(ROUTES.login);
    },
    onError: (error) => toastService.error(getAccountErrorMessage(error, locale)),
  });
}

export function useSendChangeEmailOtp() {
  const locale = getClientLocale();
  return useSingleFlightMutation({
    mutationFn: (input: ChangeEmailSendInput) => accountService.sendChangeEmailOtp(input),
    onError: (error) => toastService.error(getAccountErrorMessage(error, locale)),
  });
}

export function useVerifyChangeEmail() {
  const { logout } = useUser();
  const router = useRouter();
  const locale = getClientLocale();
  const copy = getAccountCopy(locale).email;

  return useSingleFlightMutation({
    mutationFn: (input: ChangeEmailVerifyInput) => accountService.verifyChangeEmail(input),
    onSuccess: async () => {
      toastService.success(copy.success);
      await logout();
      router.replace(ROUTES.login);
    },
    onError: (error) => toastService.error(getAccountErrorMessage(error, locale)),
  });
}

export function useSendChangePhoneOtp() {
  const locale = getClientLocale();
  return useSingleFlightMutation({
    mutationFn: (input: ChangePhoneSendInput) => accountService.sendChangePhoneOtp(input),
    onError: (error) => toastService.error(getAccountErrorMessage(error, locale)),
  });
}

export function useVerifyChangePhone() {
  const { logout } = useUser();
  const router = useRouter();
  const locale = getClientLocale();
  const copy = getAccountCopy(locale).phone;

  return useSingleFlightMutation({
    mutationFn: (input: ChangePhoneVerifyInput) => accountService.verifyChangePhone(input),
    onSuccess: async () => {
      toastService.success(copy.success);
      await logout();
      router.replace(ROUTES.login);
    },
    onError: (error) => toastService.error(getAccountErrorMessage(error, locale)),
  });
}
