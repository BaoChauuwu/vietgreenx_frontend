import { z } from "zod";

export const greenProfileSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid().nullable(),
  organizationId: z.string().uuid().nullable(),
  profileName: z.string(),
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
  addressDetail: z.string().nullable(),
  growingZoneCode: z.string().nullable(),
  mainCategoryIds: z.array(z.string().uuid()),
  farmAreaHa: z.number().nullable(),
  annualYieldTonnes: z.number().nullable(),
  avatarUrl: z.string().nullable().optional(),
  photoMediaIds: z.array(z.string().uuid()),
  photoMedias: z
    .array(z.object({ id: z.string(), cdnUrl: z.string(), mimeType: z.string() }))
    .optional(),
  videoMediaIds: z.array(z.string().uuid()),
  videoMedias: z
    .array(z.object({ id: z.string(), cdnUrl: z.string(), mimeType: z.string() }))
    .optional(),
  rating: z.number().nullable(),
  reviewCount: z.number().int().nonnegative(),
  slug: z.string().nullable(),
  metaDescription: z.string().nullable(),
  isPublished: z.boolean(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  phone: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const greenProfileCertSummarySchema = z.object({
  id: z.string().uuid(),
  certType: z.string(),
  certNumber: z.string().nullable(),
  expiryDate: z.string().nullable().optional(),
  status: z.string(),
});

export const greenProfileProductPreviewSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

export const publicGreenProfileSchema = greenProfileSchema.extend({
  certifications: z.array(greenProfileCertSummarySchema),
  products: z.array(greenProfileProductPreviewSchema),
});

export type GreenProfile = z.infer<typeof greenProfileSchema>;
export type PublicGreenProfile = z.infer<typeof publicGreenProfileSchema>;

export function isGreenProfilePublished(profile: GreenProfile): boolean {
  return profile.isPublished;
}

export function formatGreenProfileLocation(
  profile: Pick<GreenProfile, "ward" | "province">,
): string {
  return [profile.ward, profile.province].filter(Boolean).join(", ");
}
