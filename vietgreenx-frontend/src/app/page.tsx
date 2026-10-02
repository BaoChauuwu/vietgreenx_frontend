import { LandingPage } from "@/features/landing";
import { getRequestLocale } from "@/shared/i18n/get-request-locale";
import { PublicStatsStripConnected } from "@/widgets/landing";
import { PublicPageShell } from "@/widgets/public-layout";

import { ROUTES } from "@/shared/routing";

// Landing page pending — redirect to login until it's ready
export default function Home() {
  const locale = getRequestLocale();

  return (
    <PublicPageShell locale={locale}>
      <LandingPage
        locale={locale}
        statsStrip={
          <PublicStatsStripConnected locale={locale} className="justify-center md:justify-start" />
        }
      />
    </PublicPageShell>
  );
}
