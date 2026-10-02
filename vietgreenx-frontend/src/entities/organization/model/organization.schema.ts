import { z } from "zod";

import { paginatedListSchema } from "@/shared/lib/paginated-list.schema";

export const organizationTypeSchema = z.enum([
  "cooperative",
  "enterprise",
  "ngo",
  "government_agency",
  "other",
]);

export const verificationLevelSchema = z.enum([
  "unverified",
  "basic",
  "certified",
  "trusted_partner",
]);

export const organizationSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  orgType: organizationTypeSchema,
  taxCode: z.string().nullable().optional(),
  registrationNumber: z.string().nullable().optional(),
  province: z.string().nullable().optional(),
  provinceCode: z.preprocess(
    (val) => (val == null || val === "" ? null : Number(val)),
    z.number().nullable().optional(),
  ),
  districtCode: z.preprocess(
    (val) => (val == null || val === "" ? null : Number(val)),
    z.number().nullable().optional(),
  ),
  wardCode: z.preprocess(
    (val) => (val == null || val === "" ? null : Number(val)),
    z.number().nullable().optional(),
  ),
  registrationCertUrl: z.string().nullable().optional(),
  isActive: z.preprocess((val) => (val == null ? true : Boolean(val)), z.boolean()),
  memberLimit: z.preprocess(
    (val) => (val == null ? 10 : Number(val)),
    z.number().int().nonnegative(),
  ),
  followerCount: z.preprocess(
    (val) => (val == null ? 0 : Number(val)),
    z.number().int().nonnegative(),
  ),
  memberCount: z.preprocess(
    (val) => (val == null ? 1 : Number(val)),
    z.number().int().nonnegative(),
  ),
  website: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  verificationLevel: z.preprocess(
    (val) => (val == null ? "unverified" : val),
    verificationLevelSchema,
  ),
  logoUrl: z.string().nullable().optional(),
  coverUrl: z.string().nullable().optional(),
  createdAt: z.string(),
});

export const organizationMemberUserSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  displayName: z.string().nullable(),
  avatarUrl: z.string().nullable(),
});

export const organizationMemberSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  userId: z.string().uuid(),
  orgRole: z.string(),
  status: z.string(),
  joinedAt: z.string(),
  user: organizationMemberUserSchema,
});

export const organizationMemberListSchema = paginatedListSchema(organizationMemberSchema);
export const organizationListSchema = paginatedListSchema(organizationSchema);

export type OrganizationType = z.infer<typeof organizationTypeSchema>;
export type VerificationLevel = z.infer<typeof verificationLevelSchema>;
export type Organization = z.infer<typeof organizationSchema>;
export type OrganizationList = z.infer<typeof organizationListSchema>;
export type OrganizationMember = z.infer<typeof organizationMemberSchema>;
export type OrganizationMemberList = z.infer<typeof organizationMemberListSchema>;

export function isOrganizationVerified(level: VerificationLevel): boolean {
  return level !== "unverified";
}

export function organizationMemberDisplayName(member: OrganizationMember): string {
  return member.user.displayName?.trim() || member.user.username;
}

export const inviteMemberResponseSchema = z.object({
  inviteLink: z.string(),
  member: organizationMemberSchema,
});

export type InviteMemberResponse = z.infer<typeof inviteMemberResponseSchema>;
