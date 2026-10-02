"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

import { useUser } from "@/shared/auth";
import { toastService } from "@/shared/lib/toast";
import { useSingleFlightMutation } from "@/shared/lib/use-single-flight-mutation";
import { ROUTES, sanitizeRedirectPath } from "@/shared/routing";

import { getClientLocale } from "@/shared/i18n/get-client-locale";

import { getAuthErrorMessage } from "../lib/auth-errors";
import { isUsernameCheckable } from "../lib/username";
import { authSessionService } from "./auth-session.service";
import { authService } from "./auth.service";
import { getAuthCopy } from "../auth.constants";

function usePostAuthRedirect() {
  const router = useRouter();
  const params = useSearchParams();

  return () => {
    router.replace(sanitizeRedirectPath(params.get("redirect")));
  };
}

export function useLogin() {
  const { refresh } = useUser();
  const redirect = usePostAuthRedirect();

  return useSingleFlightMutation({
    mutationFn: authService.login,
    onSuccess: async (user) => {
      await refresh(user);
      redirect();
    },
    onError: (error) => toastService.error(getAuthErrorMessage(error, "login", getClientLocale())),
  });
}

export function useCheckPhoneOtp() {
  return useSingleFlightMutation({
    mutationFn: authService.checkPhoneOtp,
    onError: (error) => toastService.error(getAuthErrorMessage(error, "verifyOtp", getClientLocale())),
  });
}

export function useRegisterPhone() {
  return useSingleFlightMutation({
    mutationFn: authService.registerPhone,
    onError: (error) => toastService.error(getAuthErrorMessage(error, "registerPhone", getClientLocale())),
  });
}

export function useVerifyPhoneRegister() {
  const { refresh } = useUser();
  const redirect = usePostAuthRedirect();

  return useSingleFlightMutation({
    mutationFn: authService.verifyPhoneRegister,
    onSuccess: async (user) => {
      await refresh(user);
      redirect();
    },
    onError: (error) =>
      toastService.error(getAuthErrorMessage(error, "verifyOtp", getClientLocale())),
  });
}

export function useResendPhoneOtp() {
  const locale = getClientLocale();
  const copy = getAuthCopy(locale).errors.resendOtp;

  return useSingleFlightMutation({
    mutationFn: authService.registerPhone,
    onSuccess: () => toastService.success(copy.success),
    onError: (error) => toastService.error(getAuthErrorMessage(error, "resendOtp", locale)),
  });
}

export function useRegisterEmail() {
  return useSingleFlightMutation({
    mutationFn: authService.registerEmail,
    onError: (error) => toastService.error(getAuthErrorMessage(error, "register", getClientLocale())),
  });
}

export function useResendRegisterEmail() {
  const locale = getClientLocale();
  const copy = getAuthCopy(locale).errors.resendEmail;

  return useSingleFlightMutation({
    mutationFn: authService.registerEmail,
    onSuccess: () => toastService.success(copy.success),
    onError: (error) => toastService.error(getAuthErrorMessage(error, "resendEmail", locale)),
  });
}

export function useVerifyEmailRegister() {
  const { refresh } = useUser();
  const redirect = usePostAuthRedirect();

  return useSingleFlightMutation({
    mutationFn: authService.verifyEmailRegister,
    onSuccess: async (user) => {
      await refresh(user);
      redirect();
    },
    onError: (error) => toastService.error(getAuthErrorMessage(error, "verifyEmail", getClientLocale())),
  });
}

export function useForgotPassword() {
  return useSingleFlightMutation({
    mutationFn: authService.forgotPassword,
    onError: (error) => toastService.error(getAuthErrorMessage(error, "forgotPassword", getClientLocale())),
  });
}

export function useLogout() {
  const { logout } = useUser();
  const router = useRouter();

  return useSingleFlightMutation({
    mutationFn: () => logout(),
    onSuccess: () => router.replace(ROUTES.login),
    onError: () => toastService.error(getAuthCopy(getClientLocale()).errors.generic),
  });
}

export function useForgotPasswordByPhone() {
  return useSingleFlightMutation({
    mutationFn: authService.forgotPasswordByPhone,
    onError: (error) => toastService.error(getAuthErrorMessage(error, "forgotPassword", getClientLocale())),
  });
}

export function useForgotPasswordByEmail() {
  return useSingleFlightMutation({
    mutationFn: authService.forgotPasswordByEmail,
    onError: (error) => toastService.error(getAuthErrorMessage(error, "forgotPassword", getClientLocale())),
  });
}

export function useResetPassword() {
  const router = useRouter();
  const locale = getClientLocale();
  const copy = getAuthCopy(locale).resetPasswordForm;

  return useSingleFlightMutation({
    mutationFn: authService.resetPassword,
    onSuccess: () => {
      toastService.success(copy.success);
      router.replace(ROUTES.login);
    },
    onError: (error) => toastService.error(getAuthErrorMessage(error, "resetPassword", locale)),
  });
}

export const sessionKeys = {
  all: ["auth", "sessions"] as const,
};

export function useAuthSessions() {
  const { user } = useUser();

  return useQuery({
    queryKey: sessionKeys.all,
    queryFn: () => authSessionService.listSessions(),
    enabled: Boolean(user?.id),
    staleTime: 30_000,
  });
}

export function useRevokeAuthSession() {
  const qc = useQueryClient();
  const locale = getClientLocale();
  const copy = getAuthCopy(locale).sessions;

  return useSingleFlightMutation({
    mutationFn: (sessionId: string) => authSessionService.revokeSession(sessionId),
    onSuccess: () => {
      toastService.success(copy.revoked);
      void qc.invalidateQueries({ queryKey: sessionKeys.all });
    },
    onError: () => toastService.error(getAuthCopy(locale).errors.generic),
  });
}

export const usernameCheckKeys = {
  all: ["auth", "check-username"] as const,
  byName: (username: string) => [...usernameCheckKeys.all, username] as const,
};

export function useCheckUsernameAvailability(username: string) {
  const trimmed = username.trim();
  return useQuery({
    queryKey: usernameCheckKeys.byName(trimmed),
    queryFn: () => authService.checkUsername(trimmed),
    enabled: isUsernameCheckable(trimmed),
    staleTime: 60_000,
  });
}

export async function fetchUsernameAvailability(username: string) {
  const trimmed = username.trim();
  return authService.checkUsername(trimmed);
}

export function useRevokeAllAuthSessions() {
  const { logout } = useUser();
  const router = useRouter();
  const locale = getClientLocale();
  const copy = getAuthCopy(locale).sessions;

  return useSingleFlightMutation({
    mutationFn: () => authSessionService.revokeAllSessions(),
    onSuccess: async () => {
      toastService.success(copy.revokedAll);
      await logout();
      router.replace(ROUTES.login);
    },
    onError: () => toastService.error(getAuthCopy(locale).errors.generic),
  });
}
