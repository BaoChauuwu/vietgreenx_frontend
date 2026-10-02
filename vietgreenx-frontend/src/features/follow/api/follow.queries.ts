"use client";

import { useQueryClient } from "@tanstack/react-query";

import type { FollowResponse } from "@/entities/follow";
import { toNormalizedApiError } from "@/shared/api/api";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { useSingleFlightMutation } from "@/shared/lib/use-single-flight-mutation";
import { toastService } from "@/shared/lib/toast";

import { profileQueryKeys } from "@/shared/lib/profile-query-keys";

import { getFollowCopy } from "../follow.constants";
import { followService } from "./follow.service";

export const followKeys = {
  all: ["follows"] as const,
  followers: (userId: string) => [...followKeys.all, "followers", userId] as const,
  following: (userId: string) => [...followKeys.all, "following", userId] as const,
};

function invalidateFollowLists(qc: ReturnType<typeof useQueryClient>, userId: string) {
  void qc.invalidateQueries({ queryKey: followKeys.followers(userId) });
  void qc.invalidateQueries({ queryKey: followKeys.following(userId) });
  void qc.invalidateQueries({ queryKey: profileQueryKeys.all });
}

function toastForFollowResponse(response: FollowResponse) {
  const copy = getFollowCopy(getClientLocale());
  if (response.status === "pending") {
    toastService.success(copy.pendingSuccess);
    return;
  }
  toastService.success(copy.followSuccess);
}

function mapFollowError(error: unknown): string | null {
  const message = toNormalizedApiError(error).message.toLowerCase();
  const copy = getFollowCopy(getClientLocale());
  if (message.includes("already followed") || message.includes("already follow")) {
    return copy.alreadyFollowing;
  }
  if (message.includes("self") || message.includes("yourself")) {
    return copy.selfError;
  }
  return null;
}

export function useFollowUser(viewerUserId?: string) {
  const qc = useQueryClient();
  const copy = getFollowCopy(getClientLocale());

  return useSingleFlightMutation({
    mutationFn: (followeeUserId: string) => followService.followUser({ followeeUserId }),
    onSuccess: (response, followeeUserId) => {
      toastForFollowResponse(response);
      if (viewerUserId) invalidateFollowLists(qc, viewerUserId);
      void qc.invalidateQueries({ queryKey: followKeys.following(followeeUserId) });
    },
    onError: (error) => {
      toastService.error(mapFollowError(error) ?? copy.error);
    },
  });
}

export function useUnfollowUser(viewerUserId?: string) {
  const qc = useQueryClient();
  const copy = getFollowCopy(getClientLocale());

  return useSingleFlightMutation({
    mutationFn: (targetUserId: string) => followService.unfollow(targetUserId),
    onSuccess: (_, targetUserId) => {
      toastService.success(copy.unfollowSuccess);
      if (viewerUserId) invalidateFollowLists(qc, viewerUserId);
      void qc.invalidateQueries({ queryKey: followKeys.following(targetUserId) });
    },
    onError: () => toastService.error(copy.error),
  });
}
