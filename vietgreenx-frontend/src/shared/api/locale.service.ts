import type { AppLocale } from "@/shared/i18n/locale";

export const localeService = {
  async setLocale(locale: AppLocale): Promise<void> {
    await fetch("/api/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale }),
    });
  },
};
