"use client";

import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  isAppLocale,
  type AppLocale,
} from "./locale";

/** Read locale from cookie on the client (matches `getRequestLocale` on server). */
export function getClientLocale(): AppLocale {
  if (typeof document === "undefined") return DEFAULT_LOCALE;

  const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE_NAME}=([^;]*)`));
  const value = match?.[1] ? decodeURIComponent(match[1]) : undefined;
  return isAppLocale(value) ? value : DEFAULT_LOCALE;
}
