import { z } from "zod";

export const certificationTypeSchema = z.enum([
  "vietgap",
  "globalgap",
  "organic",
  "ocop",
  "halal",
  "iso22000",
  "haccp",
  "other",
]);

export const certificationStatusSchema = z.enum([
  "pending",
  "approved",
  "rejected",
  "valid",
  "expired",
  "pending_renewal",
  "revoked",
]);

export const certificationSchema = z.object({
  id: z.string().uuid(),
  greenProfileId: z.string().uuid(),
  certType: certificationTypeSchema,
  certNumber: z.string().nullable(),
  issuingAuthority: z.string(),
  issueDate: z.string(),
  expiryDate: z.string(),
  documentUrl: z.string(),
  status: certificationStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Certification = z.infer<typeof certificationSchema>;
export type CertificationType = z.infer<typeof certificationTypeSchema>;
export type CertificationStatus = z.infer<typeof certificationStatusSchema>;

export const certificationListSchema = z.array(certificationSchema);
