"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { CropSeasonStatus } from "@/entities/crop-season";
import { useUser } from "@/shared/auth";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { useSingleFlightMutation } from "@/shared/lib/use-single-flight-mutation";
import { toastService } from "@/shared/lib/toast";

import type {
  CreateCropSeasonInput,
  UpdateCropSeasonStatusInput,
  UpdateCropSeasonVariables,
} from "../model/crop-season-input.schema";
import { getCropSeasonCopy } from "../crop-season.constants";
import { cropSeasonService } from "./crop-season.service";

export const cropSeasonKeys = {
  all: ["crop-seasons"] as const,
  list: (page: number, greenProfileId?: string, status?: CropSeasonStatus) =>
    [...cropSeasonKeys.all, "list", page, greenProfileId ?? "all", status ?? "all"] as const,
  detail: (id: string) => [...cropSeasonKeys.all, "detail", id] as const,
};

export function useCropSeasons(
  page = 1,
  limit = 20,
  greenProfileId?: string,
  status?: CropSeasonStatus,
  enabled = true,
) {
  const { user } = useUser();

  return useQuery({
    queryKey: cropSeasonKeys.list(page, greenProfileId, status),
    queryFn: () => cropSeasonService.list({ page, limit, status, greenProfileId }),
    staleTime: 60_000,
    enabled: enabled && Boolean(user?.id),
  });
}

export function useCropSeason(seasonId: string | null, enabled = true) {
  const { user } = useUser();

  return useQuery({
    queryKey: cropSeasonKeys.detail(seasonId ?? ""),
    queryFn: () => cropSeasonService.byId(seasonId as string),
    staleTime: 30_000,
    enabled: enabled && Boolean(user?.id) && Boolean(seasonId),
  });
}

export function useCreateCropSeason() {
  const qc = useQueryClient();
  const toast = getCropSeasonCopy(getClientLocale()).toast;

  return useSingleFlightMutation({
    mutationFn: (input: CreateCropSeasonInput) => cropSeasonService.create(input),
    onSuccess: () => {
      toastService.success(toast.createSuccess);
      void qc.invalidateQueries({ queryKey: cropSeasonKeys.all });
    },
    onError: () => {
      toastService.error(toast.createError);
    },
  });
}

export function useUpdateCropSeason() {
  const qc = useQueryClient();
  const toast = getCropSeasonCopy(getClientLocale()).toast;

  return useSingleFlightMutation({
    mutationFn: ({ id, input }: UpdateCropSeasonVariables) => cropSeasonService.update(id, input),
    onSuccess: () => {
      toastService.success(toast.updateSuccess);
      void qc.invalidateQueries({ queryKey: cropSeasonKeys.all });
    },
    onError: () => {
      toastService.error(toast.updateError);
    },
  });
}

export function useUpdateCropSeasonStatus() {
  const qc = useQueryClient();
  const toast = getCropSeasonCopy(getClientLocale()).toast;

  return useSingleFlightMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCropSeasonStatusInput }) =>
      cropSeasonService.updateStatus(id, input),
    onSuccess: () => {
      toastService.success(toast.statusSuccess);
      void qc.invalidateQueries({ queryKey: cropSeasonKeys.all });
    },
    onError: () => {
      toastService.error(toast.statusError);
    },
  });
}

export function useDeleteCropSeason() {
  const qc = useQueryClient();
  const toast = getCropSeasonCopy(getClientLocale()).toast;

  return useSingleFlightMutation({
    mutationFn: (id: string) => cropSeasonService.delete(id),
    onSuccess: () => {
      toastService.success(toast.deleteSuccess);
      void qc.invalidateQueries({ queryKey: cropSeasonKeys.all });
    },
    onError: () => {
      toastService.error(toast.deleteError);
    },
  });
}
