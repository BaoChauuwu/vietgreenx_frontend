import { NextResponse } from "next/server";

import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  isAppLocale,
  type AppLocale,
} from "@/shared/i18n/locale";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { locale?: string } | null;
  const locale = isAppLocale(body?.locale) ? (body?.locale as AppLocale) : DEFAULT_LOCALE;

  const res = NextResponse.json({ ok: true, locale });
  res.cookies.set(LOCALE_COOKIE_NAME, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return res;
}
