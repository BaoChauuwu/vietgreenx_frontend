import { z } from "zod";

import type { AppLocale } from "@/shared/i18n/locale";

import { getBatchesValidationCopy } from "../batches.constants";

export function createCreateBatchInputSchema(locale: AppLocale) {
  const v = getBatchesValidationCopy(locale);

  return z.object({
    batchCode: z.string().trim().min(1, v.batchCodeRequired).max(100),
    productId: z.string().uuid(v.productRequired),
    cropSeasonId: z.string().uuid(v.cropSeasonRequired),
    quantity: z.coerce.number().positive(v.quantityPositive),
    quantityUnit: z.string().trim().min(1, v.unitRequired).max(50),
    harvestDate: z.string().trim().optional(),
  });
}

export function createUpdateBatchInputSchema(locale: AppLocale) {
  return createCreateBatchInputSchema(locale).partial();
}

export type CreateBatchInput = z.infer<ReturnType<typeof createCreateBatchInputSchema>>;
export type UpdateBatchInput = z.infer<ReturnType<typeof createUpdateBatchInputSchema>>;

export function createBatchEditFormSchema(locale: AppLocale) {
  return createCreateBatchInputSchema(locale).omit({ productId: true, cropSeasonId: true });
}

export type BatchEditFormInput = z.infer<ReturnType<typeof createBatchEditFormSchema>>;

export function batchToEditFormValues(batch: {
  batchCode: string;
  quantity: number;
  quantityUnit: string;
  harvestDate?: string | null;
}): BatchEditFormInput {
  return {
    batchCode: batch.batchCode,
    quantity: batch.quantity,
    quantityUnit: batch.quantityUnit,
    harvestDate: batch.harvestDate ?? "",
  };
}

export function batchEditFormToUpdateInput(data: BatchEditFormInput): UpdateBatchInput {
  return {
    batchCode: data.batchCode,
    quantity: data.quantity,
    quantityUnit: data.quantityUnit,
    harvestDate: data.harvestDate?.trim() || undefined,
  };
}
