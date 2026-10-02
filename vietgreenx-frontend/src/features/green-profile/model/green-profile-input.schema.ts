import { z } from "zod";

import type { AppLocale } from "@/shared/i18n/locale";

import { getGreenProfileValidationCopy } from "../green-profile.constants";

/** Form input — aligned with BE `CreateGreenProfileRequestDto`. */
export function createCreateGreenProfileInputSchema(locale: AppLocale) {
  const v = getGreenProfileValidationCopy(locale);

  return z.object({
    organizationId: z.string().uuid().optional(),
    profileName: z.string().trim().min(1, v.profileNameRequired).max(200),
    province: z.string().trim().min(1, v.provinceRequired),
    ward: z.string().trim().max(100).optional().nullable(),
    provinceCode: z.number().int().positive().optional(),
    wardCode: z.number().int().positive().optional().nullable(),
    district: z.string().trim().max(100).optional().nullable(),
    districtCode: z.number().int().positive().optional().nullable(),
    addressDetail: z.string().trim().max(500).optional().nullable(),
    growingZoneCode: z.string().trim().max(100).optional(),
    mainCategoryIds: z.array(z.string().uuid()).optional(),
    farmAreaHa: z.number().positive(v.farmAreaPositive).optional(),
    annualYieldTonnes: z.number().positive().optional(),
    photoMediaIds: z.array(z.string().uuid()).max(20).optional(),
    videoMediaIds: z.array(z.string().uuid()).max(3).optional(),
    avatarMediaId: z.string().uuid().optional().nullable(),
    metaDescription: z.string().trim().max(500).optional(),
    productionProcess: z.string().trim().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  });
}

export function createUpdateGreenProfileInputSchema(locale: AppLocale) {
  return createCreateGreenProfileInputSchema(locale).omit({ organizationId: true }).partial();
}

export type CreateGreenProfileInput = z.infer<
  ReturnType<typeof createCreateGreenProfileInputSchema>
>;
export type UpdateGreenProfileInput = z.infer<
  ReturnType<typeof createUpdateGreenProfileInputSchema>
>;

/** UI form — aligned with GreenProfileFormShell. Numbers are strings pre-parse. */
export function createGreenProfileFormSchema(locale: AppLocale) {
  const v = getGreenProfileValidationCopy(locale);

  return z
    .object({
      profileName: z.string().trim().min(1, v.profileNameRequired).max(200),
      metaDescription: z.string().trim().max(500).optional(),
      productionProcess: z.string().trim().optional(),
      province: z.string().trim().min(1, v.provinceRequired),
      ward: z.string().trim().max(100).optional(),
      provinceCode: z.string().trim().optional(),
      wardCode: z.string().trim().optional(),
      addressDetail: z.string().trim().max(500).optional(),
      growingZoneCode: z.string().trim().max(100).optional(),
      farmAreaHa: z.string().trim().optional(),
      annualYieldTonnes: z.string().trim().optional(),
      latitude: z.string().trim().optional(),
      longitude: z.string().trim().optional(),
      avatarMediaId: z.string().uuid().optional().nullable(),
      photoMediaIds: z.array(z.string().uuid()).max(20).optional(),
      videoMediaIds: z.array(z.string().uuid()).max(3).optional(),
    })
    .superRefine((data, ctx) => {
      const area = data.farmAreaHa?.trim();
      if (area) {
        const n = Number(area);
        if (Number.isNaN(n) || n <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: v.farmAreaPositive,
            path: ["farmAreaHa"],
          });
        }
      }
      const yield_ = data.annualYieldTonnes?.trim();
      if (yield_) {
        const n = Number(yield_);
        if (Number.isNaN(n) || n <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: v.yieldPositive,
            path: ["annualYieldTonnes"],
          });
        }
      }
      const lat = data.latitude?.trim();
      const lng = data.longitude?.trim();
      if (lat) {
        const latN = Number(lat);
        if (Number.isNaN(latN) || latN < -90 || latN > 90) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: v.latInvalid, path: ["latitude"] });
        }
      }
      if (lng) {
        const lngN = Number(lng);
        if (Number.isNaN(lngN) || lngN < -180 || lngN > 180) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: v.lngInvalid, path: ["longitude"] });
        }
      }
    });
}

export type GreenProfileFormInput = z.infer<ReturnType<typeof createGreenProfileFormSchema>>;

function parseOptionalPositiveNumber(raw: string | undefined): number | undefined {
  if (!raw?.trim()) return undefined;
  const n = Number(raw.trim());
  return Number.isNaN(n) || n <= 0 ? undefined : n;
}

function parseOptionalNumber(raw: string | undefined): number | undefined {
  if (!raw?.trim()) return undefined;
  const n = Number(raw.trim());
  return Number.isNaN(n) ? undefined : n;
}

export function greenProfileFormToCreateInput(
  data: GreenProfileFormInput,
  organizationId?: string,
): CreateGreenProfileInput {
  return {
    organizationId,
    profileName: data.profileName,
    province: data.province,
    ward: data.ward || undefined,
    provinceCode: data.provinceCode ? Number(data.provinceCode) : undefined,
    wardCode: data.wardCode ? Number(data.wardCode) : undefined,
    addressDetail: data.addressDetail?.trim() || undefined,
    growingZoneCode: data.growingZoneCode?.trim() || undefined,
    metaDescription: data.metaDescription?.trim() || undefined,
    farmAreaHa: parseOptionalPositiveNumber(data.farmAreaHa),
    annualYieldTonnes: parseOptionalPositiveNumber(data.annualYieldTonnes),
    latitude: parseOptionalNumber(data.latitude),
    longitude: parseOptionalNumber(data.longitude),
    avatarMediaId: data.avatarMediaId ?? undefined,
    photoMediaIds: data.photoMediaIds?.length ? data.photoMediaIds : undefined,
    videoMediaIds: data.videoMediaIds?.length ? data.videoMediaIds : undefined,
  };
}

export function greenProfileFormToUpdateInput(
  data: GreenProfileFormInput,
): UpdateGreenProfileInput {
  const { organizationId: _, ...base } = greenProfileFormToCreateInput(data);
  return {
    ...base,
    district: null,
    districtCode: null,
    avatarMediaId: data.avatarMediaId ?? undefined,
    photoMediaIds: data.photoMediaIds ?? [],
    videoMediaIds: data.videoMediaIds ?? [],
  };
}
