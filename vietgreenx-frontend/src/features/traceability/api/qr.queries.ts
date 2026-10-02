"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useUser } from "@/shared/auth";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { toNormalizedApiError } from "@/shared/api/api";
import { useSingleFlightMutation } from "@/shared/lib/use-single-flight-mutation";
import { toastService } from "@/shared/lib/toast";

import { qrService, type ExportQrPdfInput } from "./qr.service";
import type { GenerateQrInput } from "../model/qr-input.schema";
import { getTraceCopy } from "../trace.constants";

export const qrKeys = {
  all: ["qr"] as const,
  list: (page: number, productId?: string) => [...qrKeys.all, "list", page, productId] as const,
  byBatch: (batchId: string) => [...qrKeys.all, "batch", batchId] as const,
  quota: () => [...qrKeys.all, "quota"] as const,
};

export function useQrQuota() {
  const { user } = useUser();

  return useQuery({
    queryKey: qrKeys.quota(),
    queryFn: () => qrService.quota(),
    enabled: Boolean(user?.id),
    staleTime: 60_000,
    retry: false,
  });
}

export function useQrApiAvailable() {
  const { isSuccess, isError, isLoading } = useQrQuota();
  return {
    isLoading,
    isAvailable: isSuccess,
    isUnavailable: isError,
  };
}

export function useQrTokens(page = 1, limit = 20, productId?: string) {
  const { user } = useUser();

  return useQuery({
    queryKey: qrKeys.list(page, productId),
    queryFn: () => qrService.list({ page, limit, productId }),
    enabled: Boolean(user?.id),
    staleTime: 60_000,
    retry: false,
  });
}

export function useTraceTokenForBatch(batchId: string, enabled = true) {
  const { user } = useUser();

  return useQuery({
    queryKey: qrKeys.byBatch(batchId),
    queryFn: () => qrService.getForBatch(batchId),
    enabled: Boolean(user?.id) && Boolean(batchId) && enabled,
    staleTime: 60_000,
    retry: false,
  });
}

export function useGenerateQr() {
  const qc = useQueryClient();
  const toast = getTraceCopy(getClientLocale()).toast;

  return useSingleFlightMutation({
    mutationFn: (input: GenerateQrInput) => qrService.generate(input),
    onSuccess: (token) => {
      toastService.success(toast.generateSuccess);
      void qc.invalidateQueries({ queryKey: qrKeys.all });
      void qc.invalidateQueries({ queryKey: qrKeys.quota() });
      if (token.batchId) {
        void qc.invalidateQueries({ queryKey: qrKeys.byBatch(token.batchId) });
      }
      void qc.invalidateQueries({ queryKey: ["batches"] });
    },
    onError: (error) => {
      const normalized = toNormalizedApiError(error);
      if (normalized.status === 404) {
        toastService.error(toast.generateUnavailable);
        return;
      }
      toastService.error(toast.generateError);
    },
  });
}

export function useExportQrPdf(locale = getClientLocale()) {
  return useSingleFlightMutation({
    mutationFn: (input: ExportQrPdfInput) => qrService.exportPdf(input),
    onSuccess: () => {
      toastService.success(
        locale === "en" ? "QR PDF exported successfully" : "Đã xuất PDF nhãn QR thành công",
      );
    },
    onError: (error) => {
      const normalized = toNormalizedApiError(error);
      toastService.error(
        normalized.message ||
          (locale === "en" ? "Failed to export QR PDF" : "Không thể xuất file PDF nhãn QR"),
      );
    },
  });
}
