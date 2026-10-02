import { HeroSection } from "./sections";
import type { AppLocale } from "@/shared/i18n/locale";
import type { ReactNode } from "react";

interface LandingPageProps {
  locale: AppLocale;
  statsStrip?: ReactNode;
}

/** Landing main content only — wrap with `PublicPageShell` at page/widget layer. */
export function LandingPage({ locale, statsStrip }: LandingPageProps) {
  return <HeroSection locale={locale} statsStrip={statsStrip} />;
}
