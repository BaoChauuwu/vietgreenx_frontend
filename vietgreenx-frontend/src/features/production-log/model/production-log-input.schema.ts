import { z } from "zod";

import { activityTypeSchema } from "@/entities/production-log";
import type { AppLocale } from "@/shared/i18n/locale";

import { getProductionLogValidationCopy } from "../production-log.constants";

export function createCreateProductionLogInputSchema(locale: AppLocale) {
  const v = getProductionLogValidationCopy(locale);

  return z.object({
    logDate: z.string().trim().min(1, v.logDateRequired),
    activityType: activityTypeSchema,
    notes: z.string().trim().max(2000).optional(),
    inputMaterial: z.string().trim().max(500).optional(),
    dosage: z.string().trim().max(100).optional(),
    dosageUnit: z.string().trim().max(50).optional(),
    weather: z.string().trim().max(200).optional(),
    pestStatus: z.string().trim().max(500).optional(),
    estimatedYield: z.number().positive().optional(),
    mediaIds: z.array(z.string().uuid()).optional(),
  });
}

export type CreateProductionLogInput = z.infer<
  ReturnType<typeof createCreateProductionLogInputSchema>
>;

export function createProductionLogFormSchema(locale: AppLocale) {
  const v = getProductionLogValidationCopy(locale);

  return z.object({
    cropSeasonId: z.string().uuid(v.cropSeasonRequired),
    activityType: activityTypeSchema,
    logDate: z.string().trim().min(1, v.logDateRequired),
    notes: z.string().trim().max(2000).optional(),
    inputMaterial: z.string().trim().max(500).optional(),
    dosage: z.string().trim().max(100).optional(),
    dosageUnit: z.string().trim().max(50).optional(),
    weather: z.string().trim().max(200).optional(),
    pestStatus: z.string().trim().max(500).optional(),
    estimatedYield: z.string().trim().optional(),
    mediaIds: z.array(z.string().uuid()).optional(),
  });
}

export type ProductionLogFormInput = z.infer<ReturnType<typeof createProductionLogFormSchema>>;

export function productionLogFormToCreateInput(
  data: ProductionLogFormInput,
): CreateProductionLogInput {
  const estimatedYield = data.estimatedYield ? parseFloat(data.estimatedYield) : undefined;
  return {
    logDate: data.logDate,
    activityType: data.activityType,
    notes: data.notes?.trim() || undefined,
    inputMaterial: data.inputMaterial?.trim() || undefined,
    dosage: data.dosage?.trim() || undefined,
    dosageUnit: data.dosageUnit?.trim() || undefined,
    weather: data.weather?.trim() || undefined,
    pestStatus: data.pestStatus?.trim() || undefined,
    estimatedYield: estimatedYield && !isNaN(estimatedYield) ? estimatedYield : undefined,
    mediaIds: data.mediaIds?.length ? data.mediaIds : undefined,
  };
}

export interface CreateProductionLogVariables {
  cropSeasonId: string;
  input: CreateProductionLogInput;
}
