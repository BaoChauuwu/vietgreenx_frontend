"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import type {
  AcceptInviteInput,
  AddOrganizationMemberInput,
  CreateOrganizationInput,
  SubmitVerificationInput,
  UpdateOrganizationInput,
  UpdateOrganizationMemberInput,
} from "../model/organization-input.schema";
import { useUser } from "@/shared/auth";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { useSingleFlightMutation } from "@/shared/lib/use-single-flight-mutation";
import { toastService } from "@/shared/lib/toast";

import {
  getStoredActiveOrganizationId,
  setStoredActiveOrganizationId,
} from "../lib/active-organization-id";
import { organizationService } from "./organization.service";
import { getOrganizationCopy } from "../organization.constants";
import { ROUTES } from "@/shared/routing";

export const organizationKeys = {
  all: ["organizations"] as const,
  list: (params: { page?: number; limit?: number }) =>
    [...organizationKeys.all, "list", params] as const,
  detail: (id: string) => [...organizationKeys.all, "detail", id] as const,
  members: (id: string) => [...organizationKeys.all, "members", id] as const,
};

export function useActiveOrganizationId(): string | null {
  const { user } = useUser();
  return user?.orgId ?? getStoredActiveOrganizationId();
}

export function useOrganizations(page = 1, limit = 20) {
  return useQuery({
    queryKey: organizationKeys.list({ page, limit }),
    queryFn: () => organizationService.list(page, limit),
    staleTime: 60_000,
  });
}

export function useOrganization(orgId: string | null) {
  return useQuery({
    queryKey: organizationKeys.detail(orgId ?? "unknown"),
    queryFn: () => organizationService.byId(orgId as string),
    enabled: Boolean(orgId),
    staleTime: 5 * 60_000,
  });
}

export function useOrganizationMembers(orgId: string | null, page = 1, limit = 20) {
  const { user } = useUser();

  return useQuery({
    queryKey: [...organizationKeys.members(orgId ?? "unknown"), page, limit],
    queryFn: () => organizationService.listMembers(orgId as string, page, limit),
    enabled: Boolean(orgId) && Boolean(user?.id),
    staleTime: 60_000,
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const locale = getClientLocale();
  const copy = getOrganizationCopy(locale).create;

  return useSingleFlightMutation({
    mutationFn: (input: CreateOrganizationInput) => organizationService.create(input),
    onSuccess: (org) => {
      setStoredActiveOrganizationId(org.id);
      void queryClient.invalidateQueries({ queryKey: organizationKeys.all });
      toastService.success(copy.success);
      router.refresh();
    },
    onError: () => toastService.error(copy.error),
  });
}

export function useUpdateOrganization(orgId: string | null) {
  const queryClient = useQueryClient();
  const locale = getClientLocale();
  const copy = getOrganizationCopy(locale).edit;

  return useSingleFlightMutation({
    mutationFn: (input: UpdateOrganizationInput) => {
      if (!orgId) throw new Error("No organization selected");
      return organizationService.update(orgId, input);
    },
    onSuccess: (org) => {
      queryClient.setQueryData(organizationKeys.detail(org.id), org);
      void queryClient.invalidateQueries({ queryKey: organizationKeys.detail(org.id) });
      toastService.success(copy.saved);
    },
    onError: () => toastService.error(copy.saveError),
  });
}

export function useInviteOrganizationMember(orgId: string | null) {
  const queryClient = useQueryClient();
  const locale = getClientLocale();
  const copy = getOrganizationCopy(locale).members.invite;

  return useSingleFlightMutation({
    mutationFn: (input: AddOrganizationMemberInput) => {
      if (!orgId) throw new Error("No organization selected");
      return organizationService.addMember(orgId, input);
    },
    onSuccess: (result) => {
      if (!orgId) return;
      void queryClient.invalidateQueries({ queryKey: organizationKeys.members(orgId) });
      toastService.success(copy.success);
      if (result.inviteLink) {
        void navigator.clipboard?.writeText(result.inviteLink).catch(() => undefined);
        toastService.info(copy.linkCopied);
      }
    },
    onError: () => toastService.error(copy.error),
  });
}

export function useSubmitOrganizationVerification(orgId: string | null) {
  const queryClient = useQueryClient();
  const locale = getClientLocale();
  const copy = getOrganizationCopy(locale).verification;

  return useSingleFlightMutation({
    mutationFn: (input: SubmitVerificationInput) => {
      if (!orgId) throw new Error("No organization selected");
      return organizationService.submitVerification(orgId, input);
    },
    onSuccess: (org) => {
      queryClient.setQueryData(organizationKeys.detail(org.id), org);
      void queryClient.invalidateQueries({ queryKey: organizationKeys.detail(org.id) });
      toastService.success(copy.success);
    },
    onError: () => toastService.error(copy.error),
  });
}

export function useAcceptOrganizationInvite() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const locale = getClientLocale();
  const copy = getOrganizationCopy(locale).acceptInvite;

  return useSingleFlightMutation({
    mutationFn: (input: AcceptInviteInput) => organizationService.acceptInvite(input),
    onSuccess: async (member) => {
      setStoredActiveOrganizationId(member.organizationId);
      await queryClient.invalidateQueries({ queryKey: organizationKeys.all });
      toastService.success(copy.accepted);
      router.replace(ROUTES.org);
    },
    onError: () => toastService.error(copy.error),
  });
}

export function useDeclineOrganizationInvite() {
  const router = useRouter();
  const locale = getClientLocale();
  const copy = getOrganizationCopy(locale).acceptInvite;

  return useSingleFlightMutation({
    mutationFn: (input: AcceptInviteInput) => organizationService.declineInvite(input),
    onSuccess: () => {
      toastService.success(copy.declined);
      router.replace(ROUTES.feed);
    },
    onError: () => toastService.error(copy.error),
  });
}

export function useDeleteOrganization(orgId: string | null) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const locale = getClientLocale();
  const copy = getOrganizationCopy(locale).delete;

  return useSingleFlightMutation({
    mutationFn: () => {
      if (!orgId) throw new Error("No organization selected");
      return organizationService.remove(orgId);
    },
    onSuccess: async () => {
      setStoredActiveOrganizationId(null);
      await queryClient.invalidateQueries({ queryKey: organizationKeys.all });
      toastService.success(copy.success);
      router.replace(ROUTES.org);
      router.refresh();
    },
    onError: () => toastService.error(copy.error),
  });
}

export function useRemoveOrganizationMember(orgId: string | null) {
  const queryClient = useQueryClient();
  const locale = getClientLocale();
  const copy = getOrganizationCopy(locale).members.remove;

  return useSingleFlightMutation({
    mutationFn: (memberUserId: string) => {
      if (!orgId) throw new Error("No organization selected");
      return organizationService.removeMember(orgId, memberUserId);
    },
    onSuccess: () => {
      if (!orgId) return;
      void queryClient.invalidateQueries({ queryKey: organizationKeys.members(orgId) });
      toastService.success(copy.success);
    },
    onError: () => toastService.error(copy.error),
  });
}

export function useUpdateOrganizationMember(orgId: string | null) {
  const queryClient = useQueryClient();
  const locale = getClientLocale();
  const copy = getOrganizationCopy(locale).members.updateRole;

  return useSingleFlightMutation({
    mutationFn: ({
      memberUserId,
      input,
    }: {
      memberUserId: string;
      input: UpdateOrganizationMemberInput;
    }) => {
      if (!orgId) throw new Error("No organization selected");
      return organizationService.updateMember(orgId, memberUserId, input);
    },
    onSuccess: () => {
      if (!orgId) return;
      void queryClient.invalidateQueries({ queryKey: organizationKeys.members(orgId) });
      toastService.success(copy.success);
    },
    onError: () => toastService.error(copy.error),
  });
}
