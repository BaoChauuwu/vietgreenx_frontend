import { z } from "zod";

import {
  certificationTypeSchema,
  type CertificationType,
} from "@/entities/certification";
import type { AppLocale } from "@/shared/i18n/locale";

import {
  CERTIFICATION_ACCEPT,
  CERTIFICATION_MAX_BYTES,
  getCertificationValidationCopy,
} from "../certification.constants";

const ACCEPTED_MIME_TYPES = CERTIFICATION_ACCEPT.split(",").map((value) => value.trim());

export function createCreateCertificationInputSchema(locale: AppLocale) {
  const v = getCertificationValidationCopy(locale);

  return z
    .object({
      greenProfileId: z.string().uuid(),
      certType: certificationTypeSchema,
      certNumber: z.string().trim().max(100).optional(),
      issuingAuthority: z.string().trim().min(1, v.issuingAuthorityRequired),
      issueDate: z.string().trim().min(1, v.issueDateRequired),
      expiryDate: z.string().trim().min(1, v.expiryDateRequired),
      documentUrl: z.string().trim().min(1, v.documentRequired),
    })
    .refine((data) => data.expiryDate > data.issueDate, {
      message: v.expiryAfterIssue,
      path: ["expiryDate"],
    });
}

export type CreateCertificationInput = z.infer<
  ReturnType<typeof createCreateCertificationInputSchema>
>;

export function createCreateCertificationFormSchema(locale: AppLocale) {
  const v = getCertificationValidationCopy(locale);

  return z
    .object({
      greenProfileId: z.string().uuid(),
      certType: certificationTypeSchema,
      certNumber: z.string().trim().max(100).optional(),
      issuingAuthority: z.string().trim().min(1, v.issuingAuthorityRequired),
      issueDate: z.string().trim().min(1, v.issueDateRequired),
      expiryDate: z.string().trim().min(1, v.expiryDateRequired),
      documentFile: z.custom<File>(
        (value) => value instanceof File,
        v.documentRequired,
      ),
    })
    .refine((data) => data.documentFile.size <= CERTIFICATION_MAX_BYTES, {
      message: v.fileTooLarge,
      path: ["documentFile"],
    })
    .refine((data) => ACCEPTED_MIME_TYPES.includes(data.documentFile.type), {
      message: v.fileInvalidType,
      path: ["documentFile"],
    })
    .refine((data) => data.expiryDate > data.issueDate, {
      message: v.expiryAfterIssue,
      path: ["expiryDate"],
    });
}

export type CreateCertificationFormInput = z.infer<
  ReturnType<typeof createCreateCertificationFormSchema>
>;

export function certificationFormToCreateInput(
  data: CreateCertificationFormInput,
  documentUrl: string,
): CreateCertificationInput {
  return {
    greenProfileId: data.greenProfileId,
    certType: data.certType as CertificationType,
    certNumber: data.certNumber?.trim() || undefined,
    issuingAuthority: data.issuingAuthority.trim(),
    issueDate: data.issueDate,
    expiryDate: data.expiryDate,
    documentUrl,
  };
}

export function createUpdateCertificationInputSchema(locale: AppLocale) {
  const v = getCertificationValidationCopy(locale);

  return z
    .object({
      certType: certificationTypeSchema,
      certNumber: z.string().trim().max(100).optional(),
      issuingAuthority: z.string().trim().min(1, v.issuingAuthorityRequired),
      issueDate: z.string().trim().min(1, v.issueDateRequired),
      expiryDate: z.string().trim().min(1, v.expiryDateRequired),
      documentUrl: z.string().trim().min(1).optional(),
    })
    .refine((data) => data.expiryDate > data.issueDate, {
      message: v.expiryAfterIssue,
      path: ["expiryDate"],
    });
}

export type UpdateCertificationInput = z.infer<
  ReturnType<typeof createUpdateCertificationInputSchema>
>;

export function createUpdateCertificationFormSchema(locale: AppLocale) {
  const v = getCertificationValidationCopy(locale);

  return z
    .object({
      certType: certificationTypeSchema,
      certNumber: z.string().trim().max(100).optional(),
      issuingAuthority: z.string().trim().min(1, v.issuingAuthorityRequired),
      issueDate: z.string().trim().min(1, v.issueDateRequired),
      expiryDate: z.string().trim().min(1, v.expiryDateRequired),
      documentFile: z.custom<File | undefined>((value) => value === undefined || value instanceof File),
    })
    .superRefine((data, ctx) => {
      if (!(data.documentFile instanceof File)) return;

      if (data.documentFile.size > CERTIFICATION_MAX_BYTES) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: v.fileTooLarge,
          path: ["documentFile"],
        });
      }

      if (!ACCEPTED_MIME_TYPES.includes(data.documentFile.type)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: v.fileInvalidType,
          path: ["documentFile"],
        });
      }
    })
    .refine((data) => data.expiryDate > data.issueDate, {
      message: v.expiryAfterIssue,
      path: ["expiryDate"],
    });
}

export type UpdateCertificationFormInput = z.infer<
  ReturnType<typeof createUpdateCertificationFormSchema>
>;

export function certificationToEditFormValues(cert: {
  certType: CertificationType;
  certNumber: string | null;
  issuingAuthority: string;
  issueDate: string;
  expiryDate: string;
}): UpdateCertificationFormInput {
  return {
    certType: cert.certType,
    certNumber: cert.certNumber ?? "",
    issuingAuthority: cert.issuingAuthority,
    issueDate: cert.issueDate.slice(0, 10),
    expiryDate: cert.expiryDate.slice(0, 10),
    documentFile: undefined,
  };
}

export function certificationFormToUpdateInput(
  data: UpdateCertificationFormInput,
  newDocumentUrl?: string,
): UpdateCertificationInput {
  return {
    certType: data.certType,
    certNumber: data.certNumber?.trim() || undefined,
    issuingAuthority: data.issuingAuthority.trim(),
    issueDate: data.issueDate,
    expiryDate: data.expiryDate,
    ...(newDocumentUrl ? { documentUrl: newDocumentUrl } : {}),
  };
}

export interface UpdateCertificationVariables {
  id: string;
  input: UpdateCertificationInput;
}
