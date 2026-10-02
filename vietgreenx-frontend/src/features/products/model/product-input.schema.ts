import { z } from "zod";

import type { AppLocale } from "@/shared/i18n/locale";

import { getProductsValidationCopy } from "../products.constants";

function optionalNonNegativeNumber() {
  return z.preprocess((value) => {
    if (value === "" || value === null || value === undefined) return undefined;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? value : parsed;
  }, z.number().min(0).optional());
}

export function createCreateProductInputSchema(locale: AppLocale) {
  const v = getProductsValidationCopy(locale);

  return z.object({
    name: z.string().trim().min(1, v.nameRequired).max(200),
    categoryId: z.string().uuid(v.categoryRequired),
    priceUnit: z.string().trim().min(1, v.unitRequired).max(50),
    description: z.string().trim().max(2000).optional(),
    productionLocation: z.string().trim().max(500).optional(),
    province: z.string().trim().max(100).optional(),
    ward: z.string().trim().max(100).optional(),
    provinceCode: z.coerce.number().int().positive().optional(),
    wardCode: z.coerce.number().int().positive().optional(),
    harvestDate: z.string().trim().optional(),
    priceReference: optionalNonNegativeNumber(),
    availableQuantity: optionalNonNegativeNumber(),
    photoMediaIds: z.array(z.string().uuid()).max(9).optional(),
    qualityStandards: z.array(z.string()).optional(),
    certificationIds: z.array(z.string().uuid()).optional(),
    isForMarketplace: z.boolean().optional(),
    hasQr: z.boolean().optional(),
    status: z.enum(["draft", "active", "out_of_stock", "archived"]).optional(),
  });
}

export function createUpdateProductInputSchema(locale: AppLocale) {
  return createCreateProductInputSchema(locale).partial();
}

export const archiveProductInputSchema = z.object({
  status: z.literal("archived"),
});

export type ArchiveProductInput = z.infer<typeof archiveProductInputSchema>;

export type CreateProductInput = z.infer<ReturnType<typeof createCreateProductInputSchema>>;
export type UpdateProductInput = z.infer<ReturnType<typeof createUpdateProductInputSchema>>;
