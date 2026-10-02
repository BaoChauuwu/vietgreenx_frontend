export const LOCALE_COOKIE_NAME = "locale";

export const APP_LOCALES = ["vi", "en"] as const;
export type AppLocale = (typeof APP_LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = "vi";

export function isAppLocale(value: string | undefined): value is AppLocale {
  return Boolean(value && APP_LOCALES.includes(value as AppLocale));
}

export function detectLocaleFromHeader(acceptLanguage: string | null): AppLocale {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  const lower = acceptLanguage.toLowerCase();
  if (lower.includes("vi")) return "vi";
  if (lower.includes("en")) return "en";
  return DEFAULT_LOCALE;
}
