import { NextResponse, type NextRequest } from "next/server";

import { LOCALE_COOKIE_NAME, detectLocaleFromHeader } from "@/shared/i18n/locale";
import { ACCESS_COOKIE, ROUTES, isProtectedPath, MIDDLEWARE_MATCHER } from "@/shared/routing";

function applyLocaleCookie(res: NextResponse, req: NextRequest): NextResponse {
  const localeCookie = req.cookies.get(LOCALE_COOKIE_NAME)?.value;
  if (localeCookie) return res;

  const locale = detectLocaleFromHeader(req.headers.get("accept-language"));
  res.cookies.set(LOCALE_COOKIE_NAME, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return res;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSession = Boolean(req.cookies.get(ACCESS_COOKIE)?.value);

  if (isProtectedPath(pathname) && !hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = ROUTES.login;
    url.searchParams.set("redirect", pathname);
    return applyLocaleCookie(NextResponse.redirect(url), req);
  }

  return applyLocaleCookie(NextResponse.next(), req);
}

export const config = {
  matcher: [...MIDDLEWARE_MATCHER],
};
