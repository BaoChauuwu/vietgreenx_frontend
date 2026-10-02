import { z } from "zod";

import { cropSeasonStatusSchema } from "@/entities/crop-season";
import type { AppLocale } from "@/shared/i18n/locale";

import { getCropSeasonValidationCopy } from "../crop-season.constants";

export function createCreateCropSeasonInputSchema(locale: AppLocale) {
  const v = getCropSeasonValidationCopy(locale);

  return z
    .object({
      greenProfileId: z.string().uuid(v.greenProfileRequired),
      seasonName: z.string().trim().min(1, v.seasonNameRequired).max(200),
      cropType: z.string().trim().min(1, v.cropTypeRequired).max(100),
      areaHa: z.coerce.number().positive(v.areaPositive),
      startDate: z.string().trim().min(1, v.startDateRequired),
      expectedHarvestDate: z.string().trim().min(1, v.harvestDateRequired),
      productId: z.string().uuid().optional(),
      notes: z.string().trim().max(2000).optional(),
    })
    .refine((data) => data.expectedHarvestDate >= data.startDate, {
      message: v.harvestAfterStart,
      path: ["expectedHarvestDate"],
    });
}

export type CreateCropSeasonInput = z.infer<ReturnType<typeof createCreateCropSeasonInputSchema>>;

function createUpdateCropSeasonObjectSchema(locale: AppLocale) {
  const v = getCropSeasonValidationCopy(locale);

  return z.object({
    seasonName: z.string().trim().min(1, v.seasonNameRequired).max(200),
    cropType: z.string().trim().min(1, v.cropTypeRequired).max(100),
    areaHa: z.coerce.number().positive(v.areaPositive),
    startDate: z.string().trim().min(1, v.startDateRequired),
    expectedHarvestDate: z.string().trim().min(1, v.harvestDateRequired),
    productId: z.string().optional(),
    notes: z.string().trim().max(2000).optional(),
  });
}

export function createUpdateCropSeasonFormSchema(locale: AppLocale) {
  const v = getCropSeasonValidationCopy(locale);

  return createUpdateCropSeasonObjectSchema(locale).refine(
    (data) => data.expectedHarvestDate >= data.startDate,
    {
      message: v.harvestAfterStart,
      path: ["expectedHarvestDate"],
    },
  );
}

export type UpdateCropSeasonFormInput = z.infer<
  ReturnType<typeof createUpdateCropSeasonFormSchema>
>;

export function createUpdateCropSeasonInputSchema(locale: AppLocale) {
  const v = getCropSeasonValidationCopy(locale);

  return createUpdateCropSeasonObjectSchema(locale)
    .extend({
      productId: z.string().uuid().optional(),
    })
    .refine((data) => data.expectedHarvestDate >= data.startDate, {
      message: v.harvestAfterStart,
      path: ["expectedHarvestDate"],
    });
}

export type UpdateCropSeasonInput = z.infer<ReturnType<typeof createUpdateCropSeasonInputSchema>>;

export function cropSeasonToEditFormValues(season: {
  seasonName: string;
  cropType: string;
  areaHa: number;
  startDate: string;
  expectedHarvestDate: string;
  productId?: string | null | undefined;
  notes?: string | null | undefined;
}): UpdateCropSeasonFormInput {
  return {
    seasonName: season.seasonName,
    cropType: season.cropType,
    areaHa: season.areaHa,
    startDate: season.startDate.slice(0, 10),
    expectedHarvestDate: season.expectedHarvestDate.slice(0, 10),
    productId: season.productId ?? "",
    notes: season.notes ?? "",
  };
}

export function cropSeasonFormToUpdateInput(
  data: UpdateCropSeasonFormInput,
): UpdateCropSeasonInput {
  return {
    seasonName: data.seasonName.trim(),
    cropType: data.cropType.trim(),
    areaHa: data.areaHa,
    startDate: data.startDate,
    expectedHarvestDate: data.expectedHarvestDate,
    productId: data.productId?.trim() || undefined,
    notes: data.notes?.trim() || undefined,
  };
}

export interface UpdateCropSeasonVariables {
  id: string;
  input: UpdateCropSeasonInput;
}

export const updateCropSeasonStatusInputSchema = z.object({
  status: cropSeasonStatusSchema,
});

export type UpdateCropSeasonStatusInput = z.infer<typeof updateCropSeasonStatusInputSchema>;

export interface UpdateCropSeasonStatusVariables {
  id: string;
  input: UpdateCropSeasonStatusInput;
}
