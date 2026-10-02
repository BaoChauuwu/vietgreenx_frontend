import { provinceListSchema, districtListSchema, wardListSchema } from "../model/location.schema";
import type { Province, District, Ward } from "../model/location.types";

const PROXY_BASE = "/api/vn-locations";

async function fetchJson<T>(path: string, schema: { parse: (data: unknown) => T }): Promise<T> {
  const res = await fetch(path, { method: "GET" });
  if (!res.ok) {
    throw new Error(`Location request failed (${res.status})`);
  }
  return schema.parse(await res.json());
}

export const locationService = {
  provinces(): Promise<Province[]> {
    return fetchJson(`${PROXY_BASE}/p/`, provinceListSchema);
  },

  districtsByProvince(provinceCode: number): Promise<District[]> {
    return fetchJson(`${PROXY_BASE}/d/?province=${provinceCode}`, districtListSchema);
  },

  wardsByProvince(provinceCode: number): Promise<Ward[]> {
    return fetchJson(`${PROXY_BASE}/w/?province=${provinceCode}`, wardListSchema);
  },
};
