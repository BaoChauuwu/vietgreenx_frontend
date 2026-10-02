import { ROUTES } from "@/shared/routing/route-contract";

import {
  hasRole,
  ORG_DASHBOARD_ROLES,
  PRODUCTION_ACCESS_ROLES,
  type UserRole,
} from "./roles";

const NAV_ROUTE_ROLES: Partial<Record<string, UserRole[]>> = {
  [ROUTES.greenProfile]: PRODUCTION_ACCESS_ROLES,
  [ROUTES.products]: PRODUCTION_ACCESS_ROLES,
  [ROUTES.batches]: PRODUCTION_ACCESS_ROLES,
  [ROUTES.qr]: PRODUCTION_ACCESS_ROLES,
  [ROUTES.org]: ORG_DASHBOARD_ROLES,
};

export function canAccessNavRoute(role: UserRole | undefined, href: string): boolean {
  const allowed = NAV_ROUTE_ROLES[href];
  if (!allowed) return true;
  return hasRole(role, allowed);
}
