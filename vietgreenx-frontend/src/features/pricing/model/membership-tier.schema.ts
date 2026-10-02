import { z } from "zod";

export const membershipTierSchema = z.object({
  plan: z.string(),
  displayName: z.string(),
  description: z.string().nullable().optional(),
  priceMonthly: z.coerce.number(),
  priceYearly: z.coerce.number().nullable().optional(),
  qrLimit: z.coerce.number(),
  productLimit: z.coerce.number(),
  tradePostAllowed: z.boolean(),
  sortOrder: z.coerce.number().optional(),
});

export type MembershipTierResponse = z.infer<typeof membershipTierSchema>;

export const membershipPlanStatusSchema = z.object({
  currentPlan: z.string(),
  effectivePlan: z.string().optional(),
  expiresAt: z.string().nullable().optional(),
  isExpired: z.boolean().optional(),
  qrLimit: z.number().optional(),
  productLimit: z.number().optional(),
  tradePostAllowed: z.boolean().optional(),
});

export type MembershipPlanStatus = z.infer<typeof membershipPlanStatusSchema>;
