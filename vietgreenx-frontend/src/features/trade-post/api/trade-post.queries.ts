import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSingleFlightMutation } from "@/shared/lib/use-single-flight-mutation";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { toNormalizedApiError } from "@/shared/api/api";
import { toastService } from "@/shared/lib/toast";
import type {
  TradePostItem,
  CreateSellOfferInput,
  CreateBuyRequestInput,
  UpdateTradePostInput,
} from "@/entities/trade-post";

import { TRADE_POST_COPY } from "../trade-post.constants";
import { tradePostClientService, type TradePostQueryParams } from "./trade-post.service";

export const tradePostKeys = {
  all: ["trade-posts"] as const,
  lists: () => [...tradePostKeys.all, "list"] as const,
  list: (params?: TradePostQueryParams) => [...tradePostKeys.lists(), params] as const,
  details: () => [...tradePostKeys.all, "detail"] as const,
  detail: (id: string) => [...tradePostKeys.details(), id] as const,
};

export function useTradePosts(params?: TradePostQueryParams) {
  return useQuery({
    queryKey: tradePostKeys.list(params),
    queryFn: () => tradePostClientService.findAll(params),
    staleTime: 60_000,
  });
}

export function useTradePostById(id: string) {
  return useQuery({
    queryKey: tradePostKeys.detail(id),
    queryFn: () => tradePostClientService.findOne(id),
    enabled: Boolean(id),
    staleTime: 60_000,
  });
}

export function useCreateSellOffer(locale: AppLocale = getClientLocale()) {
  const queryClient = useQueryClient();
  const copy = TRADE_POST_COPY[locale].toast;

  return useSingleFlightMutation<TradePostItem, Error, CreateSellOfferInput>({
    mutationFn: (input: CreateSellOfferInput) => tradePostClientService.createSellOffer(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tradePostKeys.all });
      toastService.success(copy.createSellSuccess);
    },
    onError: (error: unknown) => {
      const apiError = toNormalizedApiError(error);
      toastService.error(apiError.message || copy.error);
    },
  });
}

export function useCreateBuyRequest(locale: AppLocale = getClientLocale()) {
  const queryClient = useQueryClient();
  const copy = TRADE_POST_COPY[locale].toast;

  return useSingleFlightMutation<TradePostItem, Error, CreateBuyRequestInput>({
    mutationFn: (input: CreateBuyRequestInput) => tradePostClientService.createBuyRequest(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tradePostKeys.all });
      toastService.success(copy.createBuySuccess);
    },
    onError: (error: unknown) => {
      const apiError = toNormalizedApiError(error);
      toastService.error(apiError.message || copy.error);
    },
  });
}

export function useUpdateTradePost(locale: AppLocale = getClientLocale()) {
  const queryClient = useQueryClient();
  const copy = TRADE_POST_COPY[locale].toast;

  return useSingleFlightMutation<TradePostItem, Error, { id: string; input: UpdateTradePostInput }>(
    {
      mutationFn: ({ id, input }) => tradePostClientService.update(id, input),
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: tradePostKeys.all });
        toastService.success(copy.updateSuccess);
      },
      onError: (error: unknown) => {
        const apiError = toNormalizedApiError(error);
        toastService.error(apiError.message || copy.error);
      },
    },
  );
}

export function useCloseTradePost(locale: AppLocale = getClientLocale()) {
  const queryClient = useQueryClient();
  const copy = TRADE_POST_COPY[locale].toast;

  return useSingleFlightMutation<TradePostItem, Error, string>({
    mutationFn: (id: string) => tradePostClientService.close(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tradePostKeys.all });
      toastService.success(copy.closeSuccess);
    },
    onError: (error: unknown) => {
      const apiError = toNormalizedApiError(error);
      toastService.error(apiError.message || copy.error);
    },
  });
}
