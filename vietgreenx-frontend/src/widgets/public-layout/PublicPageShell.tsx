import type { ReactNode } from "react";

import { SiteFooter, SiteHeader } from "@/features/landing";
import type { AppLocale } from "@/shared/i18n/locale";

interface PublicPageShellProps {
  locale: AppLocale;
  children: ReactNode;
}

export function PublicPageShell({ locale, children }: PublicPageShellProps) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <SiteHeader locale={locale} />
      <main className="flex flex-1 flex-col">{children}</main>
      <SiteFooter locale={locale} />
    </div>
  );
}
