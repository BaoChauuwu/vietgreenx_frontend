"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useUser } from "@/shared/auth";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { useSingleFlightMutation } from "@/shared/lib/use-single-flight-mutation";
import { toastService } from "@/shared/lib/toast";

import type { CreateBatchInput, UpdateBatchInput } from "../model/batch-input.schema";
import { getBatchesCopy } from "../batches.constants";
import { batchService } from "./batch.service";

export const batchKeys = {
  all: ["batches"] as const,
  list: (page: number, productId?: string) => [...batchKeys.all, "list", page, productId] as const,
  detail: (id: string) => [...batchKeys.all, "detail", id] as const,
};

export function useBatches(page = 1, limit = 20, productId?: string) {
  const { user } = useUser();

  return useQuery({
    queryKey: batchKeys.list(page, productId),
    queryFn: () => batchService.list(page, limit, productId),
    enabled: Boolean(user?.id),
    staleTime: 60_000,
  });
}

export function useBatchDetail(batchId: string) {
  const { user } = useUser();

  return useQuery({
    queryKey: batchKeys.detail(batchId),
    queryFn: () => batchService.byId(batchId),
    enabled: Boolean(user?.id) && Boolean(batchId),
    staleTime: 60_000,
  });
}

export function useCreateBatch() {
  const qc = useQueryClient();
  const toast = getBatchesCopy(getClientLocale()).toast;

  return useSingleFlightMutation({
    mutationFn: (input: CreateBatchInput) => batchService.create(input),
    onSuccess: () => {
      toastService.success(toast.createSuccess);
      void qc.invalidateQueries({ queryKey: batchKeys.all });
    },
    onError: () => {
      toastService.error(toast.createError);
    },
  });
}

export function useUpdateBatch(batchId: string) {
  const qc = useQueryClient();
  const toast = getBatchesCopy(getClientLocale()).toast;

  return useSingleFlightMutation({
    mutationFn: (input: UpdateBatchInput) => batchService.update(batchId, input),
    onSuccess: () => {
      toastService.success(toast.updateSuccess);
      void qc.invalidateQueries({ queryKey: batchKeys.all });
      void qc.invalidateQueries({ queryKey: batchKeys.detail(batchId) });
    },
    onError: () => {
      toastService.error(toast.updateError);
    },
  });
}
