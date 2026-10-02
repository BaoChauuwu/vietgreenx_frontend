import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, UserPlus } from "lucide-react";

import { Button } from "@/shared/ui/button";
import type { AppLocale } from "@/shared/i18n/locale";
import { cn } from "@/shared/lib/cn";
import { ProductPhoneMock } from "@/shared/ui/ProductPhoneMock";

import { getLandingCopy, type ProofAccent } from "../landing.constants";

interface HeroSectionProps {
  locale: AppLocale;
  statsStrip?: ReactNode;
}

const PROOF_KEY_CLASS: Record<ProofAccent, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  tertiary: "text-tertiary",
};

const PROOF_CARD_CLASS: Record<ProofAccent, string> = {
  primary: "border-border bg-card",
  secondary: "border-secondary/35 bg-secondary-50/40",
  tertiary: "border-tertiary/25 bg-tertiary-50/30",
};

export function HeroSection({ locale, statsStrip }: HeroSectionProps) {
  const copy = getLandingCopy(locale);
  const hero = copy.hero;
  const title = hero.titleLines[0];
  const brand = "VietGreenX";
  const [beforeBrand, afterBrand] = title.split(brand);
  const hasBrandInTitle = title.includes(brand);

  return (
    <section className="container grid items-center gap-10 py-8 md:gap-12 md:py-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:py-14">
      <div className="flex flex-col items-center gap-6 text-center md:items-start md:text-left">
        <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
          <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary-50 px-3 py-1 text-xs font-semibold tracking-wide text-primary">
            {hero.badge}
          </span>
          <span
            title={copy.beta.hint}
            className="inline-flex items-center rounded-full border border-secondary/35 bg-secondary-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-secondary-700"
          >
            {copy.beta.label}
          </span>
        </div>

        <h1 className="max-w-[18ch] text-3xl font-bold leading-[1.06] tracking-tight sm:text-4xl md:text-5xl lg:text-[3.25rem]">
          {hasBrandInTitle ? (
            <>
              {beforeBrand}
              <span className="text-primary">{brand}</span>
              {afterBrand}
            </>
          ) : (
            title
          )}
        </h1>

        <p className="max-w-[58ch] text-base text-foreground/80 sm:text-lg">{hero.description}</p>

        {statsStrip}

        <div className="grid w-full max-w-[58ch] gap-2 sm:grid-cols-3">
          {hero.proofStrip.map((item) => (
            <div
              key={item.key}
              className={cn(
                "rounded-lg border px-3 py-2.5 text-left",
                PROOF_CARD_CLASS[item.accent],
              )}
            >
              <p
                className={cn(
                  "text-xs font-semibold uppercase tracking-wide",
                  PROOF_KEY_CLASS[item.accent],
                )}
              >
                {item.key}
              </p>
              <p className="mt-1 text-xs text-foreground/75">{item.detail}</p>
            </div>
          ))}
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
          <Button
            asChild
            size="lg"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
          >
            <Link href={hero.primaryCta.href}>
              {hero.primaryCta.label}
              <ArrowRight />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full border-border bg-background text-foreground hover:bg-muted/50 sm:w-auto"
          >
            <Link href={hero.secondaryCta.href}>
              {hero.secondaryCta.label}
              <UserPlus />
            </Link>
          </Button>
        </div>
      </div>

      <div className="relative flex justify-center lg:justify-end">
        <div className="relative rounded-2xl border border-primary/15 bg-gradient-to-br from-primary-50 via-background to-primary-50/50 px-8 py-10 sm:px-10">
          <ProductPhoneMock size="lg" />
        </div>
      </div>
    </section>
  );
}
