import { cookies, headers } from "next/headers";

import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  detectLocaleFromHeader,
  isAppLocale,
  type AppLocale,
} from "./locale";

export function getRequestLocale(): AppLocale {
  const cookieLocale = cookies().get(LOCALE_COOKIE_NAME)?.value;
  return (
    (isAppLocale(cookieLocale) && cookieLocale) ||
    detectLocaleFromHeader(headers().get("accept-language")) ||
    DEFAULT_LOCALE
  );
}
