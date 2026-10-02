export const ACCESS_COOKIE = "access_token";

// ─── Route map ────────────────────────────────────────────────────────────────

export const ROUTES = {
  // ── Auth Zone (guest only) ──────────────────────────────────────────────────
  login: "/login",
  register: "/register",
  otp: "/otp",
  verifyEmail: "/verify-email",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",

  onboarding: "/onboarding",

  // ── App Zone home (sau khi login + onboarding xong) ────────────────────────
  home: "/feed",
  feed: "/feed",

  // ── Feed ────────────────────────────────────────────────────────────────────
  post: (id: string) => `/post/${id}`,

  // ── Profile ─────────────────────────────────────────────────────────────────
  profile: "/profile",
  profileEdit: "/profile/edit",
  settings: "/settings",

  // ── Green Profile (seller+) ──────────────────────────────────────────────────
  greenProfile: "/green-profile",
  greenProfileCreate: "/green-profile/create",
  greenProfileEdit: (id: string) => `/green-profile/${id}/edit`,
  greenProfileSeasons: (id: string) => `/green-profile/${id}/seasons`,
  greenProfileLog: (id: string) => `/green-profile/${id}/log`,

  // ── Products (seller+) ───────────────────────────────────────────────────────
  products: "/products",
  productCreate: "/products/create",
  productDetail: (id: string) => `/products/${id}`,

  // ── Batches (seller+) ────────────────────────────────────────────────────────
  batches: "/batches",
  batchCreate: "/batches/create",
  batchDetail: (id: string) => `/batches/${id}`,

  // ── QR Traceability (seller+) ────────────────────────────────────────────────
  qr: "/qr",
  qrPreview: "/qr/preview",

  // ── Marketplace ──────────────────────────────────────────────────────────────
  marketplace: "/marketplace",
  marketplaceSellCreate: "/marketplace/sell/create",
  marketplaceBuyCreate: "/marketplace/buy/create",
  marketplaceDetail: (id: string) => `/marketplace/${id}`,

  // ── Chat (TASK 18, 19) ───────────────────────────────────────────────────────
  chat: "/chat",
  chatDetail: (conversationId: string) => `/chat/${conversationId}`,

  // ── Notifications ────────────────────────────────────────────────────────────
  notifications: "/notifications",

  // ── Quotations ───────────────────────────────────────────────────────────────
  quotations: "/quotations",

  // ── Saved Suppliers (TASK 35) ────────────────────────────────────────────────
  savedSuppliers: "/saved-suppliers",

  // ── Search ───────────────────────────────────────────────────────────────────
  search: "/search",

  // ── Organization Management (org_admin+) ────────────────────────────────────
  org: "/org",
  orgMembers: "/org/members",
  orgEdit: "/org/edit",
  acceptInvite: "/accept-invite",

  // ── Membership Pricing ───────────────────────────────────────────────────────
  pricing: "/pricing",

  // ── Public Pages (no auth, SSR, SEO) ─────────────────────────────────────────
  userProfile: (username: string) => `/${username}`,
  trace: (token: string) => `/trace/${token}`,
  publicOrg: (slug: string) => `/org/${slug}`,
  legal: "/legal",
  support: "/support",

  // ── Error pages ──────────────────────────────────────────────────────────────
  forbidden: "/403",
} as const;

export const AUTH_PAGES = [
  ROUTES.login,
  ROUTES.register,
  ROUTES.otp,
  ROUTES.forgotPassword,
  ROUTES.resetPassword,
] as const;

export function isEmailVerifyCompletionPage(pathname: string): boolean {
  return pathname === ROUTES.verifyEmail;
}

const PROTECTED_PREFIXES = [
  "/feed",
  "/profile",
  "/settings",
  "/search",
  "/notifications",
  "/pricing",
  "/post",
  "/green-profile",
  "/products",
  "/batches",
  "/qr",
  "/marketplace",
  "/chat",
  "/quotations",
  "/saved-suppliers",
] as const;

const PROTECTED_EXACT = [
  ROUTES.onboarding,
  ROUTES.org,
  ROUTES.orgMembers,
  ROUTES.orgEdit,
  ROUTES.acceptInvite,
] as const;

// ─── Middleware helpers ───────────────────────────────────────────────────────

/** Trả true nếu đây là trang auth (login/register/otp/...) */
export function isGuestAuthPage(pathname: string): boolean {
  return (AUTH_PAGES as readonly string[]).some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

/** Trả true nếu route cần đăng nhập */
export function isProtectedPath(pathname: string): boolean {
  if ((PROTECTED_EXACT as readonly string[]).includes(pathname)) return true;
  if ((PROTECTED_PREFIXES as readonly string[]).some((p) => pathname.startsWith(p))) return true;
  return false;
}

/** Làm sạch redirect param — chống open redirect */
export function sanitizeRedirectPath(redirect: string | null | undefined): string {
  if (!redirect) return ROUTES.home;
  if (!redirect.startsWith("/") || redirect.startsWith("//")) return ROUTES.home;
  if (isGuestAuthPage(redirect)) return ROUTES.home;
  return redirect;
}

// ─── Middleware matcher config ────────────────────────────────────────────────
export const MIDDLEWARE_MATCHER = [
  // Auth pages
  "/login",
  "/register",
  "/otp",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
  "/onboarding",

  // Protected app zone
  "/feed/:path*",
  "/profile/:path*",
  "/settings/:path*",
  "/search/:path*",
  "/notifications/:path*",
  "/pricing/:path*",
  "/post/:path*",
  "/green-profile/:path*",
  "/products/:path*",
  "/batches/:path*",
  "/qr/:path*",
  "/marketplace/:path*",
  "/chat/:path*",
  "/quotations",
  "/quotations/:path*",

  "/org",
  "/org/:path*",
  "/accept-invite",
] as const;
