import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSingleFlightMutation } from "@/shared/lib/use-single-flight-mutation";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { toNormalizedApiError } from "@/shared/api/api";
import { toastService } from "@/shared/lib/toast";
import type { QuotationItem, CreateQuotationInput } from "@/entities/quotation";

import { QUOTATION_COPY } from "../quotation.constants";
import { quotationClientService } from "./quotation.service";

export const quotationKeys = {
  all: ["quotations"] as const,
  lists: () => [...quotationKeys.all, "list"] as const,
  list: (page: number, limit: number, type?: string) =>
    [...quotationKeys.lists(), { page, limit, type }] as const,
  details: () => [...quotationKeys.all, "detail"] as const,
  detail: (id: string) => [...quotationKeys.details(), id] as const,
};

export function useQuotations(page = 1, limit = 10, type?: "received" | "sent") {
  return useQuery({
    queryKey: quotationKeys.list(page, limit, type),
    queryFn: () => quotationClientService.list(page, limit, type),
    staleTime: 60_000,
  });
}

export function useQuotationById(id: string) {
  return useQuery({
    queryKey: quotationKeys.detail(id),
    queryFn: () => quotationClientService.getById(id),
    enabled: Boolean(id),
    staleTime: 60_000,
  });
}

export function useCreateQuotation(locale: AppLocale = getClientLocale()) {
  const queryClient = useQueryClient();
  const copy = QUOTATION_COPY[locale].toast;

  return useSingleFlightMutation<QuotationItem, Error, CreateQuotationInput>({
    mutationFn: (input: CreateQuotationInput) => quotationClientService.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: quotationKeys.all });
      toastService.success(copy.sendSuccess);
    },
    onError: (error: unknown) => {
      const apiError = toNormalizedApiError(error);
      toastService.error(apiError.message || copy.error);
    },
  });
}

export function useAcceptQuotation(locale: AppLocale = getClientLocale()) {
  const queryClient = useQueryClient();
  const copy = QUOTATION_COPY[locale].toast;

  return useSingleFlightMutation<QuotationItem, Error, string>({
    mutationFn: (id: string) => quotationClientService.accept(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: quotationKeys.all });
      toastService.success(copy.acceptSuccess);
    },
    onError: (error: unknown) => {
      const apiError = toNormalizedApiError(error);
      toastService.error(apiError.message || copy.error);
    },
  });
}

export function useRejectQuotation(locale: AppLocale = getClientLocale()) {
  const queryClient = useQueryClient();
  const copy = QUOTATION_COPY[locale].toast;

  return useSingleFlightMutation<QuotationItem, Error, { id: string; rejectionNote?: string }>({
    mutationFn: ({ id, rejectionNote }: { id: string; rejectionNote?: string }) =>
      quotationClientService.reject(id, rejectionNote),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: quotationKeys.all });
      toastService.success(copy.rejectSuccess);
    },
    onError: (error: unknown) => {
      const apiError = toNormalizedApiError(error);
      toastService.error(apiError.message || copy.error);
    },
  });
}

export function useWithdrawQuotation(locale: AppLocale = getClientLocale()) {
  const queryClient = useQueryClient();
  const copy = QUOTATION_COPY[locale].toast;

  return useSingleFlightMutation<QuotationItem, Error, string>({
    mutationFn: (id: string) => quotationClientService.withdraw(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: quotationKeys.all });
      toastService.success(copy.withdrawSuccess);
    },
    onError: (error: unknown) => {
      const apiError = toNormalizedApiError(error);
      toastService.error(apiError.message || copy.error);
    },
  });
}
