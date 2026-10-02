"use client";

import { useQuery } from "@tanstack/react-query";

import { useUser } from "@/shared/auth";

import { pricingService } from "./pricing.service";

export const pricingKeys = {
  all: ["pricing"] as const,
  tiers: () => [...pricingKeys.all, "tiers"] as const,
  myPlan: () => [...pricingKeys.all, "myPlan"] as const,
};

export function useMembershipTiers() {
  return useQuery({
    queryKey: pricingKeys.tiers(),
    queryFn: () => pricingService.listTiers(),
    staleTime: 5 * 60_000,
  });
}

export function useMyMembershipPlan() {
  const { user } = useUser();

  return useQuery({
    queryKey: pricingKeys.myPlan(),
    queryFn: () => pricingService.getMyPlan(),
    enabled: Boolean(user?.id),
    staleTime: 60_000,
  });
}
