import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSingleFlightMutation } from "@/shared/lib/use-single-flight-mutation";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { toNormalizedApiError } from "@/shared/api/api";
import { toastService } from "@/shared/lib/toast";
import type { SavedSupplier, SupplierReview, CreateSupplierReviewInput } from "@/entities/supplier";

import { SUPPLIER_COPY } from "../supplier.constants";
import { supplierClientService } from "./supplier.service";

export const supplierKeys = {
  all: ["suppliers"] as const,
  saved: () => [...supplierKeys.all, "saved"] as const,
  savedList: (page: number, limit: number) => [...supplierKeys.saved(), { page, limit }] as const,
  reviews: () => [...supplierKeys.all, "reviews"] as const,
  reviewList: (supplierId: string, page: number, limit: number) =>
    [...supplierKeys.reviews(), supplierId, { page, limit }] as const,
  reviewSummary: (supplierId: string) =>
    [...supplierKeys.reviews(), supplierId, "summary"] as const,
};

export function useSavedSuppliers(page = 1, limit = 10) {
  return useQuery({
    queryKey: supplierKeys.savedList(page, limit),
    queryFn: async () => {
      try {
        return await supplierClientService.listSavedSuppliers(page, limit);
      } catch {
        return { data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 1 } };
      }
    },
    staleTime: 60_000,
    retry: false,
  });
}

export function useSaveSupplier(locale: AppLocale = getClientLocale()) {
  const queryClient = useQueryClient();
  const copy = SUPPLIER_COPY[locale].toast;

  return useSingleFlightMutation<SavedSupplier, Error, string>({
    mutationFn: (supplierId: string) => supplierClientService.saveSupplier(supplierId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: supplierKeys.saved() });
      toastService.success(copy.saveSuccess);
    },
    onError: (error: unknown) => {
      const apiError = toNormalizedApiError(error);
      toastService.error(apiError.message || copy.error);
    },
  });
}

export function useUnsaveSupplier(locale: AppLocale = getClientLocale()) {
  const queryClient = useQueryClient();
  const copy = SUPPLIER_COPY[locale].toast;

  return useSingleFlightMutation<unknown, Error, string>({
    mutationFn: (supplierId: string) => supplierClientService.unsaveSupplier(supplierId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: supplierKeys.saved() });
      toastService.success(copy.unsaveSuccess);
    },
    onError: (error: unknown) => {
      const apiError = toNormalizedApiError(error);
      toastService.error(apiError.message || copy.error);
    },
  });
}

export function useSupplierReviews(supplierId: string, page = 1, limit = 10) {
  return useQuery({
    queryKey: supplierKeys.reviewList(supplierId, page, limit),
    queryFn: () => supplierClientService.listReviews(supplierId, page, limit),
    enabled: Boolean(supplierId),
    staleTime: 60_000,
  });
}

export function useSupplierReviewSummary(supplierId: string) {
  return useQuery({
    queryKey: supplierKeys.reviewSummary(supplierId),
    queryFn: () => supplierClientService.getReviewSummary(supplierId),
    enabled: Boolean(supplierId),
    staleTime: 60_000,
  });
}

export function useCreateSupplierReview(supplierId: string, locale: AppLocale = getClientLocale()) {
  const queryClient = useQueryClient();
  const copy = SUPPLIER_COPY[locale].toast;

  return useSingleFlightMutation<SupplierReview, Error, CreateSupplierReviewInput>({
    mutationFn: (input: CreateSupplierReviewInput) =>
      supplierClientService.createReview(supplierId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: supplierKeys.reviewList(supplierId, 1, 10),
      });
      void queryClient.invalidateQueries({
        queryKey: supplierKeys.reviewSummary(supplierId),
      });
      toastService.success(copy.reviewSuccess);
    },
    onError: (error: unknown) => {
      const apiError = toNormalizedApiError(error);
      toastService.error(apiError.message || copy.error);
    },
  });
}
