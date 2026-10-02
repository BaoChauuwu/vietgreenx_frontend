import { useQuery } from "@tanstack/react-query";

export interface CascadingLocationItem {
  id: string;
  name: string;
  name_en: string;
  full_name: string;
  full_name_en: string;
  latitude: string;
  longitude: string;
}

interface LocationResponse {
  error: number;
  error_text: string;
  data_name: string;
  data: CascadingLocationItem[];
}

export const cascadingLocationKeys = {
  all: ["location"] as const,
  provinces: () => [...cascadingLocationKeys.all, "provinces"] as const,
  districts: (provinceId?: string | null) =>
    [...cascadingLocationKeys.all, "districts", provinceId] as const,
  wards: (districtId?: string | null) =>
    [...cascadingLocationKeys.all, "wards", districtId] as const,
};

const LOCATION_API_URL =
  process.env.NEXT_PUBLIC_LOCATION_API_URL || "https://esgoo.net/api-tinhthanh";

async function fetchProvinces(): Promise<CascadingLocationItem[]> {
  const res = await fetch(`${LOCATION_API_URL}/1/0.htm`);
  if (!res.ok) throw new Error("Failed to fetch provinces");
  const data = (await res.json()) as LocationResponse;
  if (data.error !== 0) throw new Error(data.error_text || "Location API error");
  return data.data || [];
}

async function fetchDistricts(provinceId: string): Promise<CascadingLocationItem[]> {
  const res = await fetch(`${LOCATION_API_URL}/2/${provinceId}.htm`);
  if (!res.ok) throw new Error("Failed to fetch districts");
  const data = (await res.json()) as LocationResponse;
  if (data.error !== 0) throw new Error(data.error_text || "Location API error");
  return data.data || [];
}

async function fetchWards(districtId: string): Promise<CascadingLocationItem[]> {
  const res = await fetch(`${LOCATION_API_URL}/3/${districtId}.htm`);
  if (!res.ok) throw new Error("Failed to fetch wards");
  const data = (await res.json()) as LocationResponse;
  if (data.error !== 0) throw new Error(data.error_text || "Location API error");
  return data.data || [];
}

export function useProvinces() {
  return useQuery({
    queryKey: cascadingLocationKeys.provinces(),
    queryFn: fetchProvinces,
    staleTime: Infinity,
  });
}

export function useDistricts(provinceId?: string | null) {
  return useQuery({
    queryKey: cascadingLocationKeys.districts(provinceId),
    queryFn: () => fetchDistricts(provinceId!),
    enabled: Boolean(provinceId),
    staleTime: Infinity,
  });
}

export function useWards(districtId?: string | null) {
  return useQuery({
    queryKey: cascadingLocationKeys.wards(districtId),
    queryFn: () => fetchWards(districtId!),
    enabled: Boolean(districtId),
    staleTime: Infinity,
  });
}
