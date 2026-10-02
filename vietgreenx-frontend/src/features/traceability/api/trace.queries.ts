import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSingleFlightMutation } from "@/shared/lib/use-single-flight-mutation";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { toNormalizedApiError } from "@/shared/api/api";
import { toastService } from "@/shared/lib/toast";
import { getTraceCopy } from "../trace.constants";
import { traceClientService, type CreateReviewInput, type ReviewItem } from "./trace.service";

export const traceKeys = {
  all: ["trace"] as const,
  reviews: (token: string, page = 1) => [...traceKeys.all, "reviews", token, page] as const,
};

export function useTraceReviews(token: string, page = 1, limit = 10) {
  return useQuery({
    queryKey: traceKeys.reviews(token, page),
    queryFn: () => traceClientService.getReviews(token, page, limit),
    enabled: Boolean(token),
    retry: false,
    staleTime: 60_000,
  });
}

export function useCreateTraceReview(token: string, locale: AppLocale = getClientLocale()) {
  const queryClient = useQueryClient();
  const copy = getTraceCopy(locale).preview.reviews.toast;

  return useSingleFlightMutation<ReviewItem, Error, CreateReviewInput>({
    mutationFn: (input: CreateReviewInput) => traceClientService.createReview(token, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: traceKeys.all });
      toastService.success(copy.success);
    },
    onError: (error: unknown) => {
      const apiError = toNormalizedApiError(error);
      toastService.error(apiError.message || copy.error);
    },
  });
}
