import { z } from "zod";

export const mediaPurposeSchema = z.enum([
  "post_image",
  "avatar",
  "cover",
  "production_log_image",
  "product_image",
  "green_profile_photo",
  "green_profile_video",
]);
export type MediaPurpose = z.infer<typeof mediaPurposeSchema>;

export const createUploadUrlInputSchema = z.object({
  purpose: mediaPurposeSchema,
  fileName: z.string().min(1),
  mimeType: z.string().min(1),
  fileSize: z.number().int().positive(),
});

export type CreateUploadUrlInput = z.infer<typeof createUploadUrlInputSchema>;

export const uploadUrlResponseSchema = z.object({
  mediaId: z.string().uuid(),
  uploadUrl: z.string(),
  uploadMethod: z.enum(["PUT", "POST"]),
  uploadField: z.string().optional(),
  expiresIn: z.number(),
  cdnUrl: z.string(),
  mimeType: z.string(),
});

export type UploadUrlResponse = z.infer<typeof uploadUrlResponseSchema>;

export const mediaCompleteResponseSchema = z.object({
  id: z.string().uuid(),
  cdnUrl: z.string(),
  mimeType: z.string(),
  processingStatus: z.literal("ready"),
});

export type MediaCompleteResponse = z.infer<typeof mediaCompleteResponseSchema>;

export type UploadedMedia = {
  mediaId: string;
  cdnUrl: string;
  mimeType: string;
};
