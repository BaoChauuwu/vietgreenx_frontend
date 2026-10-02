"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { CreateBlockInput } from "../model/block-input.schema";
import { toNormalizedApiError } from "@/shared/api/api";
import { useUser } from "@/shared/auth";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { useSingleFlightMutation } from "@/shared/lib/use-single-flight-mutation";
import { toastService } from "@/shared/lib/toast";

import { removePostsByAuthorFromAllFeedCaches } from "@/shared/lib/post-query-keys";
import { getBlockCopy } from "../block.constants";
import { blockService } from "./block.service";

export const blockKeys = {
  all: ["blocks"] as const,
  list: (page: number) => [...blockKeys.all, "list", page] as const,
};

export function useBlockedUsers(page = 1) {
  const { user } = useUser();

  return useQuery({
    queryKey: blockKeys.list(page),
    queryFn: () => blockService.list(page, 20),
    enabled: Boolean(user?.id),
    staleTime: 30_000,
  });
}

export function useBlockUser() {
  const qc = useQueryClient();
  const copy = getBlockCopy(getClientLocale());

  return useSingleFlightMutation({
    mutationFn: (input: CreateBlockInput) => blockService.create(input),
    onSuccess: (_, input) => {
      toastService.success(copy.blocked);
      removePostsByAuthorFromAllFeedCaches(qc, input.blockedUserId);
      void qc.invalidateQueries({ queryKey: blockKeys.all });
    },
    onError: (error) => {
      const message = toNormalizedApiError(error).message;
      if (message.includes("already blocked")) {
        toastService.error(copy.alreadyBlocked);
        return;
      }
      toastService.error(copy.error);
    },
  });
}

export function useUnblockUser() {
  const qc = useQueryClient();
  const copy = getBlockCopy(getClientLocale());

  return useSingleFlightMutation({
    mutationFn: (blockedUserId: string) => blockService.remove(blockedUserId),
    onSuccess: () => {
      toastService.success(copy.unblocked);
      void qc.invalidateQueries({ queryKey: blockKeys.all });
    },
    onError: () => toastService.error(copy.error),
  });
}
