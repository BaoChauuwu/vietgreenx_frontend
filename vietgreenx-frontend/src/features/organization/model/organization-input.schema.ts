import { z } from "zod";

import { organizationTypeSchema } from "@/entities/organization";
import type { AppLocale } from "@/shared/i18n/locale";

import { getOrganizationValidationCopy } from "../organization.constants";

const optionalTrimmedString = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => {
      if (value === undefined) return undefined;
      return value.length > 0 ? value : undefined;
    });

export const orgMemberRoleSchema = z.enum(["org_admin", "org_member", "org_viewer"]);

export type OrgMemberRole = z.infer<typeof orgMemberRoleSchema>;

export function createCreateOrganizationInputSchema(locale: AppLocale) {
  const v = getOrganizationValidationCopy(locale);

  return z.object({
    name: z.string().trim().min(1, v.nameRequired).max(200),
    orgType: organizationTypeSchema,
    taxCode: optionalTrimmedString(50),
    province: optionalTrimmedString(100),
    provinceCode: z.coerce.number().int().positive().optional(),
    address: optionalTrimmedString(500),
    description: optionalTrimmedString(2000),
  });
}

export function createUpdateOrganizationInputSchema(locale: AppLocale) {
  return createCreateOrganizationInputSchema(locale).partial();
}

export type CreateOrganizationInput = z.infer<
  ReturnType<typeof createCreateOrganizationInputSchema>
>;
export type UpdateOrganizationInput = z.infer<
  ReturnType<typeof createUpdateOrganizationInputSchema>
>;

export function createAddOrganizationMemberInputSchema(locale: AppLocale) {
  const v = getOrganizationValidationCopy(locale);

  return z.object({
    userId: z.string().uuid(v.userIdInvalid),
    orgRole: orgMemberRoleSchema,
  });
}

export type AddOrganizationMemberInput = z.infer<
  ReturnType<typeof createAddOrganizationMemberInputSchema>
>;

export function createSubmitVerificationInputSchema(locale: AppLocale) {
  const v = getOrganizationValidationCopy(locale);

  return z.object({
    documentType: z.string().trim().min(1, v.documentTypeRequired),
    documentFrontUrl: z.string().url(v.documentFrontUrlInvalid),
    documentBackUrl: z
      .string()
      .trim()
      .optional()
      .refine((value) => !value || z.string().url().safeParse(value).success, {
        message: v.documentBackUrlInvalid,
      }),
  });
}

export type SubmitVerificationInput = z.infer<
  ReturnType<typeof createSubmitVerificationInputSchema>
>;

export function createAcceptInviteInputSchema(locale: AppLocale) {
  const v = getOrganizationValidationCopy(locale);

  return z.object({
    token: z.string().min(1, v.tokenRequired),
  });
}

export type AcceptInviteInput = z.infer<ReturnType<typeof createAcceptInviteInputSchema>>;

export function createUpdateOrganizationMemberInputSchema(_locale: AppLocale) {
  return z.object({
    orgRole: orgMemberRoleSchema.optional(),
    status: z.enum(["active", "inactive"]).optional(),
  });
}

export type UpdateOrganizationMemberInput = z.infer<
  ReturnType<typeof createUpdateOrganizationMemberInputSchema>
>;
