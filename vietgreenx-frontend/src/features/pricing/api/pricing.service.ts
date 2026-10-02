import { z } from "zod";

import { createService } from "@/shared/api";

import {
  membershipPlanStatusSchema,
  membershipTierSchema,
  type MembershipPlanStatus,
  type MembershipTierResponse,
} from "../model/membership-tier.schema";

const http = createService("/membership");

export const pricingService = {
  /** GET /app/membership/tiers — list active membership tiers */
  listTiers(): Promise<MembershipTierResponse[]> {
    return http.get<MembershipTierResponse[]>("/tiers", undefined, {
      schema: z.array(membershipTierSchema),
    });
  },

  /** GET /app/membership/me — get current user membership plan status */
  getMyPlan(): Promise<MembershipPlanStatus> {
    return http.get<MembershipPlanStatus>("/me", undefined, {
      schema: membershipPlanStatusSchema,
    });
  },
};
