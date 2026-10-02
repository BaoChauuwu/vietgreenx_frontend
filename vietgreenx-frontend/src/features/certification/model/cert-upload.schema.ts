import { z } from "zod";

export const createCertUploadUrlInputSchema = z.object({
  fileName: z.string().trim().min(1).max(255),
  mimeType: z.string().trim().min(1).max(100),
  fileSize: z.number().int().positive(),
});

export type CreateCertUploadUrlInput = z.infer<typeof createCertUploadUrlInputSchema>;

export const certUploadUrlResponseSchema = z.object({
  storageKey: z.string(),
  uploadUrl: z.string(),
  uploadMethod: z.string(),
  uploadField: z.string().optional(),
});

export type CertUploadUrlResponse = z.infer<typeof certUploadUrlResponseSchema>;

export const certUploadResponseSchema = z.object({
  storageKey: z.string(),
});

export type CertUploadResponse = z.infer<typeof certUploadResponseSchema>;
