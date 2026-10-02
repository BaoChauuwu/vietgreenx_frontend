import Image from "next/image";

import type { AppLocale } from "@/shared/i18n/locale";
import { getLandingCopy } from "../landing.constants";
import { FooterNewsletter } from "./FooterNewsletter";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface SiteFooterProps {
  locale: AppLocale;
}

export function SiteFooter({ locale }: SiteFooterProps) {
  const copy = getLandingCopy(locale);
  const footer = copy.footer;

  return (
    <footer className="border-t border-border bg-card">
      <div className="container flex flex-col gap-5 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:max-w-sm">
          <Image src="/images/logo.svg" alt="VietGreenX" width={122} height={32} />
          <p className="max-w-xs text-sm text-foreground/75">{footer.brandNote}</p>
          <div className="pt-1">
            <LanguageSwitcher locale={locale} className="text-[11px]" />
          </div>
        </div>

        <FooterNewsletter
          hint={footer.newsletterHint}
          placeholder={footer.emailPlaceholder}
          submitAriaLabel={footer.submitAriaLabel}
        />
      </div>

      <div className="border-t border-border py-4 text-center text-xs text-foreground/65 sm:text-sm">
        {footer.copyright}
      </div>
    </footer>
  );
}
