import { z } from "zod";

import { UserRole } from "./roles";

export const REGISTERABLE_ROLES = [
  UserRole.CONSUMER,
  UserRole.SELLER,
  UserRole.COOPERATIVE,
  UserRole.ENTERPRISE,
  UserRole.EXPERT,
] as const;

export type RegisterableRole = (typeof REGISTERABLE_ROLES)[number];

export const authUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email().nullable(),
  fullName: z.string(),
  role: z.nativeEnum(UserRole),
  orgId: z.string().nullable(),
  onboardingCompleted: z.boolean(),
});

export type AuthUserPayload = z.infer<typeof authUserSchema>;

export function isRegisterableRole(role: UserRole | undefined): role is RegisterableRole {
  return REGISTERABLE_ROLES.includes(role as RegisterableRole);
}
