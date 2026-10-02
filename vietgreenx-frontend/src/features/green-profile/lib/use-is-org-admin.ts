"use client";

import { useUser, hasRole, ORG_EDIT_ROLES } from "@/shared/auth";

/** Single source of truth: user is an org admin when they have an orgId AND an org-level role. */
export function useIsOrgAdmin() {
  const { user } = useUser();
  return Boolean(user?.orgId) && hasRole(user?.role, ORG_EDIT_ROLES);
}
