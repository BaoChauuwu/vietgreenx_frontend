"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { UpdateProfileInput } from "@/entities/user";
import { useUser } from "@/shared/auth";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { useSingleFlightMutation } from "@/shared/lib/use-single-flight-mutation";
import { toastService } from "@/shared/lib/toast";

import { profileQueryKeys } from "@/shared/lib/profile-query-keys";

import { getProfileCopy } from "../profile.constants";
import { profileService } from "./profile.service";

export const profileKeys = profileQueryKeys;

export function useMyProfile() {
  const { user } = useUser();

  return useQuery({
    queryKey: profileKeys.me(user?.id ?? ""),
    queryFn: () => profileService.byUserId(user?.id ?? ""),
    enabled: Boolean(user?.id),
    staleTime: 5 * 60_000,
  });
}

export function useUserProfile(userId?: string) {
  return useQuery({
    queryKey: profileKeys.detail(userId ?? ""),
    queryFn: () => profileService.byUserId(userId ?? ""),
    enabled: Boolean(userId),
    staleTime: 5 * 60_000,
  });
}

export function useTransactionHistory(userId?: string, page = 1, limit = 20) {
  const { user } = useUser();
  const targetId = userId || user?.id;

  return useQuery({
    queryKey: ["profile", "transaction-history", targetId, page, limit] as const,
    queryFn: () => profileService.getTransactionHistory(targetId ?? "", page, limit),
    enabled: Boolean(targetId),
    staleTime: 60_000,
  });
}

export function useUpdateProfile() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const copy = getProfileCopy(getClientLocale()).edit;

  return useSingleFlightMutation({
    mutationFn: (input: UpdateProfileInput) => {
      if (!user?.id) throw new Error("Not authenticated");
      return profileService.update(user.id, input);
    },
    onSuccess: (data) => {
      if (user?.id) {
        queryClient.setQueryData(profileKeys.me(user.id), data);
        void queryClient.invalidateQueries({ queryKey: profileKeys.all });
      }
    },
    onError: () => toastService.error(copy.saveError),
  });
}

export function useUploadAvatar() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const copy = getProfileCopy(getClientLocale()).edit;

  return useSingleFlightMutation({
    mutationFn: (file: File) => {
      if (!user?.id) throw new Error("Not authenticated");
      return profileService.uploadAvatar(user.id, file);
    },
    onSuccess: (data) => {
      if (user?.id) {
        queryClient.setQueryData(profileKeys.me(user.id), data);
        void queryClient.invalidateQueries({ queryKey: profileKeys.all });
      }
    },
    onError: () => toastService.error(copy.avatarSaveError),
  });
}
