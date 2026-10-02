"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useUser } from "@/shared/auth";
import { useIsOrgAdmin } from "../lib/use-is-org-admin";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { useSingleFlightMutation } from "@/shared/lib/use-single-flight-mutation";
import { toastService } from "@/shared/lib/toast";

import { getGreenProfileCopy } from "../green-profile.constants";
import type {
  CreateGreenProfileInput,
  UpdateGreenProfileInput,
} from "../model/green-profile-input.schema";
import { greenProfileService } from "./green-profile.service";
import { greenProfileKeys } from "./green-profile.keys";

export { greenProfileKeys };

export function useMyGreenProfile() {
  const { user } = useUser();

  return useQuery({
    queryKey: greenProfileKeys.me(),
    queryFn: () => greenProfileService.me(),
    enabled: Boolean(user?.id),
    staleTime: 5 * 60_000,
  });
}

export function useActiveGreenProfile() {
  const { user } = useUser();
  const isOrgAdmin = useIsOrgAdmin();

  const personal = useQuery({
    queryKey: greenProfileKeys.me(),
    queryFn: () => greenProfileService.me(),
    enabled: Boolean(user?.id) && !isOrgAdmin,
    staleTime: 5 * 60_000,
  });

  const org = useQuery({
    queryKey: greenProfileKeys.org(user?.orgId ?? ""),
    queryFn: () => greenProfileService.getOrganizationProfile(user?.orgId ?? ""),
    enabled: Boolean(user?.id) && isOrgAdmin && Boolean(user?.orgId),
    staleTime: 5 * 60_000,
  });

  return isOrgAdmin ? org : personal;
}

export function useGreenProfileBySlug(slug: string, enabled = true) {
  return useQuery({
    queryKey: greenProfileKeys.bySlug(slug),
    queryFn: () => greenProfileService.bySlug(slug),
    staleTime: 5 * 60_000,
    enabled: Boolean(slug) && enabled,
  });
}

export function useCreateGreenProfile() {
  const qc = useQueryClient();
  const toast = getGreenProfileCopy(getClientLocale()).hub.toast;

  return useSingleFlightMutation({
    mutationFn: (input: CreateGreenProfileInput) => greenProfileService.create(input),
    onSuccess: () => {
      toastService.success(toast.createSuccess);
      void qc.invalidateQueries({ queryKey: greenProfileKeys.all });
    },
    onError: () => {
      toastService.error(toast.createError);
    },
  });
}

export function useUpdateMyGreenProfile(organizationId?: string | null) {
  const qc = useQueryClient();
  const toast = getGreenProfileCopy(getClientLocale()).hub.toast;
  const isOrg = Boolean(organizationId);

  return useSingleFlightMutation({
    mutationFn: (input: UpdateGreenProfileInput) => {
      if (!organizationId) return greenProfileService.updateMe(input);
      return greenProfileService.updateOrganization(organizationId, input);
    },
    onSuccess: () => {
      toastService.success(toast.updateSuccess);
      void qc.invalidateQueries({ queryKey: greenProfileKeys.all });
    },
    onError: () => {
      toastService.error(toast.updateError);
    },
  });
}

export function useToggleGreenProfilePublish(organizationId?: string | null) {
  const qc = useQueryClient();
  const toast = getGreenProfileCopy(getClientLocale()).hub.toast;
  const isOrg = Boolean(organizationId);

  return useSingleFlightMutation({
    mutationFn: () => {
      if (!organizationId) return greenProfileService.togglePublishMe();
      return greenProfileService.togglePublishOrganization(organizationId);
    },
    onSuccess: (profile) => {
      toastService.success(profile.isPublished ? toast.publishSuccess : toast.unpublishSuccess);
      void qc.invalidateQueries({ queryKey: greenProfileKeys.all });
    },
    onError: () => {
      toastService.error(toast.publishError);
    },
  });
}
