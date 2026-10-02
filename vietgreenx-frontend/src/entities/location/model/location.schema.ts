import { z } from "zod";

/** Open API VN v2 — post-2025 merger: Tỉnh/TP → Phường/Xã (2 cấp). */
export const adminUnitSchema = z.object({
  name: z.string(),
  code: z.number(),
  division_type: z.string().optional(),
  codename: z.string().optional(),
});

export const provinceSchema = adminUnitSchema.extend({
  phone_code: z.number().optional(),
  wards: z.array(z.unknown()).optional(),
});

export const districtSchema = adminUnitSchema.extend({
  province_code: z.number().optional(),
});

export const wardSchema = adminUnitSchema.extend({
  province_code: z.number().optional(),
  district_code: z.number().optional(),
});

export const provinceListSchema = z.array(provinceSchema);
export const districtListSchema = z.array(districtSchema);
export const wardListSchema = z.array(wardSchema);

export type Province = z.infer<typeof provinceSchema>;
export type District = z.infer<typeof districtSchema>;
export type Ward = z.infer<typeof wardSchema>;
export type AdminUnit = z.infer<typeof adminUnitSchema>;
