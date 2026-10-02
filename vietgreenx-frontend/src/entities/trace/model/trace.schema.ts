import { z } from "zod";

export const traceMediaItemSchema = z.object({
  id: z.string().optional(),
  cdnUrl: z.string().optional(),
  mimeType: z.string().optional(),
  url: z.string().optional(),
});

export type TraceMediaItem = z.infer<typeof traceMediaItemSchema>;
/** Backward compatibility alias */
export type TraceProductMedia = TraceMediaItem;
export type ReviewPhoto = TraceMediaItem;

export const publicProductResponseSchema = z.object({
  id: z.string().uuid(),
  categoryId: z.string().uuid().nullable().optional(),
  name: z.string(),
  slug: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  productionLocation: z.string().nullable().optional(),
  provinceCode: z.union([z.string(), z.number()]).nullable().optional(),
  districtCode: z.union([z.string(), z.number()]).nullable().optional(),
  wardCode: z.union([z.string(), z.number()]).nullable().optional(),
  harvestDate: z.string().nullable().optional(),
  priceReference: z.number().nullable().optional(),
  priceUnit: z.string().nullable().optional(),
  availableQuantity: z.number().nullable().optional(),
  qualityStandards: z.array(z.string()).nullable().optional().default([]),
  photoMediaIds: z.array(z.string()).nullable().optional().default([]),
  photoMedias: z.array(traceMediaItemSchema).nullable().optional().default([]),
  certificationIds: z.array(z.string()).nullable().optional().default([]),
  status: z.string().optional(),
  version: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const publicBatchResponseSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  batchCode: z.string(),
  harvestDate: z.string().nullable().optional(),
  manufactureDate: z.string().nullable().optional(),
  expiryDate: z.string().nullable().optional(),
  quantity: z.number().nullable().optional(),
  quantityUnit: z.string().nullable().optional(),
  soldQuantity: z.number().nullable().optional(),
  notes: z.string().nullable().optional(),
  qualityStandard: z.string().nullable().optional(),
  qualityNotes: z.string().nullable().optional(),
  status: z.string().optional(),
  version: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const traceCertificationResponseSchema = z.object({
  certType: z.string(),
  certNumber: z.string().nullable().optional(),
  issuingAuthority: z.string().optional(),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),
  documentUrl: z.string().optional(),
  validityStatus: z.string().optional(),
});

export const publicProductionLogResponseSchema = z.object({
  id: z.string().uuid(),
  logDate: z.string().optional(),
  activityType: z.string().optional(),
  inputMaterial: z.string().nullable().optional(),
  dosage: z.string().nullable().optional(),
  dosageUnit: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  weather: z.string().nullable().optional(),
  pestStatus: z.string().nullable().optional(),
  estimatedYield: z.number().nullable().optional(),
  mediaIds: z.array(z.string()).nullable().optional().default([]),
  createdAt: z.string().optional(),
});

export const publicQrMilestoneSummaryResponseSchema = z.object({
  milestone: z.string(),
  logs: z.array(publicProductionLogResponseSchema).optional().default([]),
});

export const traceReviewerSchema = z.object({
  id: z.string(),
  username: z.string(),
  displayName: z.string().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
});

export const traceReviewItemSchema = z.object({
  id: z.string(),
  rating: z.number(),
  reviewBody: z.string().nullable().optional(),
  photoMediaIds: z.array(z.string()).optional().default([]),
  photos: z.array(traceMediaItemSchema).optional().default([]),
  createdAt: z.string(),
  reviewer: traceReviewerSchema,
});

export type ReviewItem = z.infer<typeof traceReviewItemSchema>;

export const reviewListResponseSchema = z.object({
  items: z.array(traceReviewItemSchema).optional().default([]),
  total: z.number().optional().default(0),
  page: z.number().optional().default(1),
  limit: z.number().optional().default(10),
  totalPage: z.number().optional().default(0),
});

export type ReviewListResponse = z.infer<typeof reviewListResponseSchema>;

export const traceReviewSummarySchema = z.object({
  avgRating: z.number().optional().default(0),
  reviewCount: z.number().optional().default(0),
  items: z.array(traceReviewItemSchema).optional().default([]),
});

export const createReviewInputSchema = z.object({
  rating: z.number().min(1).max(5),
  reviewBody: z.string().max(2000).optional(),
  photoMediaIds: z.array(z.string()).optional().default([]),
});

export type CreateReviewInput = z.infer<typeof createReviewInputSchema>;

export const farmPhotoItemSchema = z.union([
  z.string(),
  z
    .object({
      url: z.string().nullable().optional(),
      cdnUrl: z.string().nullable().optional(),
    })
    .transform((val) => val.cdnUrl || val.url || ""),
  z.record(z.unknown()).transform((val) => {
    if (typeof val.cdnUrl === "string") return val.cdnUrl;
    if (typeof val.url === "string") return val.url;
    return "";
  }),
]);

export const traceVerificationStatusSchema = z
  .object({
    isVerified: z.boolean(),
    chainLength: z.number(),
    lastVerifiedAt: z.union([z.string(), z.date()]).nullable().optional(),
  })
  .nullable()
  .optional();

export type TraceVerificationStatus = z.infer<typeof traceVerificationStatusSchema>;

export const traceResponseSchema = z.object({
  token: z.string(),
  targetType: z.string(),
  product: publicProductResponseSchema,
  producerSlug: z.string().nullable().optional(),
  farmPhotos: z.array(farmPhotoItemSchema).optional().default([]),
  batch: publicBatchResponseSchema.nullable().optional(),
  milestones: z.array(publicQrMilestoneSummaryResponseSchema).optional().default([]),
  certifications: z.array(traceCertificationResponseSchema).optional().default([]),
  reviews: traceReviewSummarySchema.optional(),
  verificationStatus: traceVerificationStatusSchema,
});

export type TraceReviewer = z.infer<typeof traceReviewerSchema>;
export type TraceReviewItem = z.infer<typeof traceReviewItemSchema>;
export type TraceReviewSummary = z.infer<typeof traceReviewSummarySchema>;
export type TraceResponse = z.infer<typeof traceResponseSchema>;
