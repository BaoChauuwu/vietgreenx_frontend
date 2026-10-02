"use client";

import { useQuery } from "@tanstack/react-query";

import { locationService } from "@/entities/location";

const REGION_STALE_MS = 30 * 24 * 60 * 60 * 1000;

export const postRegionKeys = {
  all: ["posts", "regions"] as const,
  provinces: () => [...postRegionKeys.all, "provinces"] as const,
};

export function usePostRegionProvinces() {
  return useQuery({
    queryKey: postRegionKeys.provinces(),
    queryFn: () => locationService.provinces(),
    staleTime: REGION_STALE_MS,
  });
}
