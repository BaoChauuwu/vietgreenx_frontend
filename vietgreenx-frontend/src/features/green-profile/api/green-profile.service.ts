import {
  greenProfileSchema,
  publicGreenProfileSchema,
  type GreenProfile,
  type PublicGreenProfile,
} from "@/entities/green-profile";
import { createService } from "@/shared/api/create-service";
import { toNormalizedApiError } from "@/shared/api/api";
import { getClientLocale } from "@/shared/i18n/get-client-locale";

import {
  createCreateGreenProfileInputSchema,
  createUpdateGreenProfileInputSchema,
  type CreateGreenProfileInput,
  type UpdateGreenProfileInput,
} from "../model/green-profile-input.schema";

const http = createService("/green-profiles");

export const greenProfileService = {
  async me(): Promise<GreenProfile | null> {
    try {
      const res = await http.get<GreenProfile>("/me", undefined, { schema: greenProfileSchema });
      return res;
    } catch (error) {
      const normalized = toNormalizedApiError(error);
      if (normalized.status === 404) return null;
      throw error;
    }
  },

  bySlug(slug: string): Promise<PublicGreenProfile> {
    return http.get<PublicGreenProfile>(`/${slug}`, undefined, {
      schema: publicGreenProfileSchema,
    });
  },

  create(input: CreateGreenProfileInput): Promise<GreenProfile> {
    const payload = createCreateGreenProfileInputSchema(getClientLocale()).parse(input);
    return http.post<GreenProfile>("", payload, { schema: greenProfileSchema });
  },

  updateMe(input: UpdateGreenProfileInput): Promise<GreenProfile> {
    const payload = createUpdateGreenProfileInputSchema(getClientLocale()).parse(input);
    return http.patch<GreenProfile>("/me", payload, { schema: greenProfileSchema });
  },

  togglePublishMe(): Promise<GreenProfile> {
    return http.patch<GreenProfile>("/me/publish", undefined, { schema: greenProfileSchema });
  },

  async getOrganizationProfile(organizationId: string): Promise<GreenProfile | null> {
    try {
      return await http.get<GreenProfile>(`/organization/${organizationId}`, undefined, {
        schema: greenProfileSchema,
      });
    } catch (error) {
      const normalized = toNormalizedApiError(error);
      if (normalized.status === 404) return null;
      throw error;
    }
  },

  updateOrganization(
    organizationId: string,
    input: UpdateGreenProfileInput,
  ): Promise<GreenProfile> {
    const payload = createUpdateGreenProfileInputSchema(getClientLocale()).parse(input);
    return http.patch<GreenProfile>(`/organization/${organizationId}`, payload, {
      schema: greenProfileSchema,
    });
  },

  togglePublishOrganization(organizationId: string): Promise<GreenProfile> {
    return http.patch<GreenProfile>(`/organization/${organizationId}/publish`, undefined, {
      schema: greenProfileSchema,
    });
  },
};
