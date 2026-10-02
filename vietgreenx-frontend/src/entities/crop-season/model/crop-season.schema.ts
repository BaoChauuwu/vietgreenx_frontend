import { z } from "zod";

export const cropSeasonStatusSchema = z.enum(["planning", "active", "harvested", "cancelled"]);

export const cropSeasonSchema = z.object({
  id: z.string().uuid(),
  greenProfileId: z.string().uuid(),
  productId: z.string().uuid().nullish(),
  organizationId: z.string().uuid().nullish(),
  createdBy: z.string().uuid(),
  seasonName: z.string(),
  cropType: z.string(),
  areaHa: z.coerce.number(),
  startDate: z.string(),
  expectedHarvestDate: z.string(),
  actualHarvestDate: z.string().nullish(),
  status: cropSeasonStatusSchema,
  notes: z.string().nullish(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CropSeason = z.infer<typeof cropSeasonSchema>;
export type CropSeasonStatus = z.infer<typeof cropSeasonStatusSchema>;

export const cropSeasonListSchema = z.object({
  items: z.array(cropSeasonSchema),
  page: z.coerce.number().int().positive(),
  limit: z.coerce.number().int().positive(),
  total: z.coerce.number().int().nonnegative(),
  totalPage: z.coerce.number().int().nonnegative(),
});

export type CropSeasonList = z.infer<typeof cropSeasonListSchema>;

export interface ListCropSeasonsParams {
  page?: number;
  limit?: number;
  status?: CropSeasonStatus;
  greenProfileId?: string;
}
