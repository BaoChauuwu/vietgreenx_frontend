export enum UserRole {
  CONSUMER = "consumer",
  SELLER = "seller",
  COOPERATIVE = "cooperative",
  ENTERPRISE = "enterprise",
  EXPERT = "expert",
  ADMIN = "admin",
  GUEST = "guest",
}

export type Permission =
  // Community permissions
  | "post_create"
  | "post_delete"
  // Production & traceability permissions
  | "qr_generate"
  | "log_create"
  | "batch_manage"
  // Organization permissions
  | "org_invite_member"
  | "org_manage"
  | "org_verify"
  // Admin permissions
  | "content_manage"
  | "user_manage"
  | "category_manage";

export const PERMISSION_MAP: Record<UserRole, Permission[] | ["all"]> = {
  [UserRole.GUEST]: [],
  // consumer: view feed, create/delete own posts, scan QR
  [UserRole.CONSUMER]: ["post_create", "post_delete"],
  // seller: consumer + green profile, production log, QR
  [UserRole.SELLER]: ["post_create", "post_delete", "qr_generate", "log_create"],
  // cooperative: seller + manage batch & organization members
  [UserRole.COOPERATIVE]: [
    "post_create",
    "post_delete",
    "qr_generate",
    "log_create",
    "batch_manage",
    "org_invite_member",
    "org_manage",
  ],
  // enterprise: create post, manage batch & org (B2B search, quotation)
  [UserRole.ENTERPRISE]: ["post_create", "post_delete", "batch_manage", "org_manage"],
  // expert: create post + verify green profile of seller/cooperative
  [UserRole.EXPERT]: ["post_create", "post_delete", "org_verify"],
  [UserRole.ADMIN]: ["all"],
};

export function can(role: UserRole | undefined, permission: Permission): boolean {
  if (!role) return false;
  const perms = PERMISSION_MAP[role];
  if (!perms || perms[0] === "all") return true;
  return (perms as Permission[]).includes(permission);
}

export function hasRole(role: UserRole | undefined, allowed: UserRole[]): boolean {
  if (!role) return false;
  return allowed.includes(role);
}

/** Route-level role groups — dùng với AuthWrapper.requiredRoles */
export const PRODUCTION_ACCESS_ROLES: UserRole[] = [
  UserRole.SELLER,
  UserRole.COOPERATIVE,
  UserRole.ENTERPRISE,
  UserRole.ADMIN,
];

export const ORG_DASHBOARD_ROLES: UserRole[] = [
  UserRole.COOPERATIVE,
  UserRole.ENTERPRISE,
  UserRole.ADMIN,
];

export const ORG_EDIT_ROLES: UserRole[] = [UserRole.COOPERATIVE, UserRole.ENTERPRISE];

export const MARKETPLACE_SELL_ROLES: UserRole[] = [
  UserRole.SELLER,
  UserRole.COOPERATIVE,
  UserRole.ENTERPRISE,
  UserRole.ADMIN,
];

export const MARKETPLACE_BUY_ROLES: UserRole[] = [
  UserRole.COOPERATIVE,
  UserRole.ENTERPRISE,
  UserRole.ADMIN,
];

export const ROLE_DISPLAY_VI: Record<UserRole, string> = {
  [UserRole.CONSUMER]: "Người mua",
  [UserRole.SELLER]: "Người bán",
  [UserRole.COOPERATIVE]: "HTX",
  [UserRole.ENTERPRISE]: "Doanh nghiệp",
  [UserRole.EXPERT]: "Chuyên gia",
  [UserRole.ADMIN]: "Quản trị",
  [UserRole.GUEST]: "Khách",
};

export const ROLE_DISPLAY_EN: Record<UserRole, string> = {
  [UserRole.CONSUMER]: "Buyer",
  [UserRole.SELLER]: "Seller",
  [UserRole.COOPERATIVE]: "Cooperative",
  [UserRole.ENTERPRISE]: "Enterprise",
  [UserRole.EXPERT]: "Expert",
  [UserRole.ADMIN]: "Admin",
  [UserRole.GUEST]: "Guest",
};

export function getRoleLabel(role: UserRole, locale: string): string {
  const map = locale === "en" ? ROLE_DISPLAY_EN : ROLE_DISPLAY_VI;
  return map[role] ?? role;
}
