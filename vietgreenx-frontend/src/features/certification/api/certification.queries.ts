"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useUser } from "@/shared/auth";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { useSingleFlightMutation } from "@/shared/lib/use-single-flight-mutation";
import { toastService } from "@/shared/lib/toast";

import { getCertificationCopy } from "../certification.constants";
import type { CreateCertificationInput, UpdateCertificationVariables } from "../model/certification-input.schema";
import { certificationService } from "./certification.service";

export const certificationKeys = {
  all: ["certifications"] as const,
  byProfile: (greenProfileId: string) =>
    [...certificationKeys.all, "profile", greenProfileId] as const,
};

export function useCertifications(greenProfileId?: string, enabled = true) {
  const { user } = useUser();

  return useQuery({
    queryKey: certificationKeys.byProfile(greenProfileId ?? "none"),
    queryFn: () => {
      if (!greenProfileId) throw new Error("greenProfileId is required");
      return certificationService.listByProfile(greenProfileId);
    },
    staleTime: 60_000,
    enabled: enabled && Boolean(user?.id) && Boolean(greenProfileId),
  });
}

export function useCreateCertification(greenProfileId: string) {
  const qc = useQueryClient();
  const toast = getCertificationCopy(getClientLocale()).toast;

  return useSingleFlightMutation({
    mutationFn: (input: CreateCertificationInput) => certificationService.create(input),
    onSuccess: () => {
      toastService.success(toast.createSuccess);
      void qc.invalidateQueries({ queryKey: certificationKeys.byProfile(greenProfileId) });
    },
    onError: () => {
      toastService.error(toast.createError);
    },
  });
}

export function useUpdateCertification(greenProfileId: string) {
  const qc = useQueryClient();
  const toast = getCertificationCopy(getClientLocale()).toast;

  return useSingleFlightMutation({
    mutationFn: ({ id, input }: UpdateCertificationVariables) =>
      certificationService.update(id, input),
    onSuccess: () => {
      toastService.success(toast.updateSuccess);
      void qc.invalidateQueries({ queryKey: certificationKeys.byProfile(greenProfileId) });
    },
    onError: () => {
      toastService.error(toast.updateError);
    },
  });
}

export function useDeleteCertification(greenProfileId: string) {
  const qc = useQueryClient();
  const toast = getCertificationCopy(getClientLocale()).toast;

  return useSingleFlightMutation({
    mutationFn: (id: string) => certificationService.delete(id),
    onSuccess: () => {
      toastService.success(toast.deleteSuccess);
      void qc.invalidateQueries({ queryKey: certificationKeys.byProfile(greenProfileId) });
    },
    onError: () => {
      toastService.error(toast.deleteError);
    },
  });
}
