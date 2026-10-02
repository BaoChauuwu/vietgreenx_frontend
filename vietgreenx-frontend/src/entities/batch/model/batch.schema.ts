import { z } from "zod";

export const batchStatusSchema = z.enum(["created", "qr_generated", "shipped", "sold", "recalled"]);

export const batchSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  cropSeasonId: z.string().uuid().optional(),
  greenProfileId: z.string().uuid().optional(),
  batchCode: z.string(),
  harvestDate: z.string().nullable().optional(),
  quantity: z.number(),
  quantityUnit: z.string(),
  qualityStandard: z.string().nullable().optional(),
  qualityNotes: z.string().nullable().optional(),
  status: batchStatusSchema,
  createdBy: z.string().uuid(),
  version: z.number().int().nonnegative(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Batch = z.infer<typeof batchSchema>;
export type BatchStatus = z.infer<typeof batchStatusSchema>;

export const batchListSchema = z.object({
  items: z.array(batchSchema),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPage: z.number().int().nonnegative(),
});

export type BatchList = z.infer<typeof batchListSchema>;

export const batchDetailSchema = batchSchema.extend({
  cropSeason: z
    .object({
      id: z.string().uuid(),
      seasonName: z.string(),
      cropType: z.string(),
    })
    .optional(),
  productionLogs: z.array(z.object({ id: z.string().uuid() })).optional(),
});

export type BatchDetail = z.infer<typeof batchDetailSchema>;
