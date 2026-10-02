import { z } from "zod";

import { createService } from "@/shared/api/create-service";
import { getApiRoot } from "@/shared/api/api-root";
import { unwrapResponseData } from "@/shared/api/unwrap-response";

import {
  inviteMemberResponseSchema,
  organizationMemberListSchema,
  organizationListSchema,
  organizationMemberSchema,
  organizationSchema,
  type InviteMemberResponse,
  type Organization,
  type OrganizationList,
  type OrganizationMember,
  type OrganizationMemberList,
} from "@/entities/organization";
import type {
  AcceptInviteInput,
  AddOrganizationMemberInput,
  CreateOrganizationInput,
  SubmitVerificationInput,
  UpdateOrganizationInput,
  UpdateOrganizationMemberInput,
} from "../model/organization-input.schema";

const http = createService("/organizations");

const messageSchema = z.object({ message: z.string().optional() });
const successSchema = z.object({ success: z.boolean() });

export const organizationService = {
  /** GET /organizations — get list of active orgs. */
  list(page = 1, limit = 20): Promise<OrganizationList> {
    return http.get<OrganizationList>(
      "",
      { params: { page, limit } },
      { schema: organizationListSchema },
    );
  },

  /** GET /organizations/:id — public org detail. */
  byId(id: string): Promise<Organization> {
    return http.get<Organization>(`/${id}`, undefined, { schema: organizationSchema });
  },

  /** GET /organizations/:id/members */
  listMembers(orgId: string, page = 1, limit = 20): Promise<OrganizationMemberList> {
    return http.get<OrganizationMemberList>(
      `/${orgId}/members`,
      { params: { page, limit } },
      { schema: organizationMemberListSchema },
    );
  },

  /** POST /organizations — create org; caller becomes org_admin. */
  create(input: CreateOrganizationInput): Promise<Organization> {
    return http.post<Organization>("", input, { schema: organizationSchema });
  },

  /** PATCH /organizations/:id — org_admin only. */
  update(orgId: string, input: UpdateOrganizationInput): Promise<Organization> {
    return http.patch<Organization>(`/${orgId}`, input, { schema: organizationSchema });
  },

  /** POST /organizations/:id/members — invite/add member (org_admin). */
  addMember(orgId: string, input: AddOrganizationMemberInput): Promise<InviteMemberResponse> {
    return http.post<InviteMemberResponse>(`/${orgId}/members`, input, {
      schema: inviteMemberResponseSchema,
    });
  },

  /** POST /organizations/:id/verification — submit verification docs (org_admin). */
  submitVerification(orgId: string, input: SubmitVerificationInput): Promise<Organization> {
    const payload = {
      ...input,
      documentBackUrl: input.documentBackUrl || undefined,
    };
    return http.post<Organization>(`/${orgId}/verification`, payload, {
      schema: organizationSchema,
    });
  },

  /** POST /organizations/invites/accept */
  acceptInvite(input: AcceptInviteInput): Promise<OrganizationMember> {
    return http.post<OrganizationMember>("/invites/accept", input, {
      schema: organizationMemberSchema,
    });
  },

  /** POST /organizations/invites/decline */
  declineInvite(input: AcceptInviteInput): Promise<{ message?: string }> {
    return http.post<{ message?: string }>("/invites/decline", input, { schema: messageSchema });
  },

  /** DELETE /organizations/:id — org_admin only. */
  remove(orgId: string): Promise<void> {
    return http.delete<void>(`/${orgId}`);
  },

  /** PATCH /organizations/:id/members/:memberUserId */
  updateMember(
    orgId: string,
    memberUserId: string,
    input: UpdateOrganizationMemberInput,
  ): Promise<OrganizationMember> {
    return http.patch<OrganizationMember>(`/${orgId}/members/${memberUserId}`, input, {
      schema: organizationMemberSchema,
    });
  },

  /** DELETE /organizations/:id/members/:memberUserId */
  removeMember(orgId: string, memberUserId: string): Promise<{ success: boolean }> {
    return http.delete<{ success: boolean }>(`/${orgId}/members/${memberUserId}`, undefined, {
      schema: successSchema,
    });
  },
};

/** Server-side fetch for public `/org/[id]` SEO page (no auth). */
export async function fetchPublicOrganization(id: string): Promise<Organization | null> {
  try {
    const res = await fetch(`${getApiRoot()}/app/organizations/${id}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const payload = unwrapResponseData<unknown>(await res.json());
    return organizationSchema.parse(payload);
  } catch {
    return null;
  }
}
