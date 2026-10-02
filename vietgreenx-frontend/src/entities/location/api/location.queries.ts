"use client";

import { useQuery } from "@tanstack/react-query";

import { locationService } from "@/entities/location";

/** Admin divisions change infrequently — cache like categories/config (DEV-PLAYBOOK). */
const LOCATION_STALE_MS = 30 * 24 * 60 * 60 * 1000;

export const locationKeys = {
  all: ["location", "v2"] as const,
  provinces: () => [...locationKeys.all, "provinces"] as const,
  districts: (provinceCode: number) => [...locationKeys.all, "districts", provinceCode] as const,
  wards: (provinceCode: number) => [...locationKeys.all, "wards", provinceCode] as const,
};

export function useProvinces() {
  return useQuery({
    queryKey: locationKeys.provinces(),
    queryFn: () => locationService.provinces(),
    staleTime: LOCATION_STALE_MS,
  });
}

export function useDistrictsByProvince(provinceCode: number | undefined) {
  return useQuery({
    queryKey: locationKeys.districts(provinceCode ?? 0),
    queryFn: () => {
      if (provinceCode == null) throw new Error("provinceCode required");
      return locationService.districtsByProvince(provinceCode);
    },
    enabled: provinceCode != null,
    staleTime: LOCATION_STALE_MS,
  });
}

export function useWardsByProvince(provinceCode: number | undefined) {
  return useQuery({
    queryKey: locationKeys.wards(provinceCode ?? 0),
    queryFn: () => {
      if (provinceCode == null) throw new Error("provinceCode required");
      return locationService.wardsByProvince(provinceCode);
    },
    enabled: provinceCode != null,
    staleTime: LOCATION_STALE_MS,
  });
}
