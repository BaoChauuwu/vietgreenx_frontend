import { z } from "zod";

export const productStatusSchema = z.enum(["draft", "active", "out_of_stock", "archived"]);

export const productSchema = z.object({
  id: z.string().uuid(),
  ownerUserId: z.string().uuid().nullable(),
  organizationId: z.string().uuid().nullable(),
  greenProfileId: z.string().uuid().nullable(),
  categoryId: z.string().uuid(),
  name: z.string(),
  slug: z.string().nullable(),
  description: z.string().nullable(),
  productionLocation: z.string().nullable(),
  province: z.string().nullable().optional(),
  ward: z.string().nullable().optional(),
  provinceCode: z.preprocess(
    (val) => (val == null || val === "" ? null : Number(val)),
    z.number().nullable().optional(),
  ),
  wardCode: z.preprocess(
    (val) => (val == null || val === "" ? null : Number(val)),
    z.number().nullable().optional(),
  ),
  harvestDate: z.string().nullable(),
  priceReference: z.number().nullable(),
  priceUnit: z.string().nullable(),
  availableQuantity: z.number().nullable(),
  qualityStandards: z.array(z.string()),
  photoMediaIds: z.array(z.string()),
  photoMedias: z
    .array(z.object({ id: z.string(), cdnUrl: z.string(), mimeType: z.string() }))
    .optional(),
  certificationIds: z.array(z.string()).optional(),
  status: productStatusSchema,
  isForMarketplace: z.boolean(),
  hasQr: z.boolean(),
  viewCount: z.number().int().nonnegative(),
  version: z.number().int().nonnegative(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Product = z.infer<typeof productSchema>;

export const productListSchema = z.object({
  items: z.array(productSchema),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPage: z.number().int().nonnegative(),
});

export type ProductList = z.infer<typeof productListSchema>;
