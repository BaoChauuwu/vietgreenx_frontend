import type { AppLocale } from "@/shared/i18n/locale";

/** Map AppLocale to BCP 47 locale string for Intl APIs. */
export function toIntlLocale(locale: AppLocale): string {
  return locale === "vi" ? "vi-VN" : "en-US";
}

const DIVISIONS: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, unit: "second" },
  { amount: 60, unit: "minute" },
  { amount: 24, unit: "hour" },
  { amount: 7, unit: "day" },
  { amount: 4.34524, unit: "week" },
  { amount: 12, unit: "month" },
  { amount: Number.POSITIVE_INFINITY, unit: "year" },
];

export function formatRelativeTime(value: Date | string, locale: AppLocale = "vi"): string {
  const date = typeof value === "string" ? new Date(value) : value;
  let duration = (date.getTime() - Date.now()) / 1000;

  const rtf = new Intl.RelativeTimeFormat(toIntlLocale(locale), { numeric: "auto" });

  for (const { amount, unit } of DIVISIONS) {
    if (Math.abs(duration) < amount) {
      return rtf.format(Math.round(duration), unit);
    }
    duration /= amount;
  }

  return date.toLocaleDateString(toIntlLocale(locale));
}

export function formatAbsoluteTime(value: Date | string, locale: AppLocale = "vi"): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleString(toIntlLocale(locale));
}
