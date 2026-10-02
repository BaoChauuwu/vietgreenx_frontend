"use client";

import { Check, Loader2, Package, QrCode, ShoppingBag, Sparkles, Zap } from "lucide-react";

import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import { CardContent, CardHeader } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";

import { useMembershipTiers, useMyMembershipPlan } from "../api/pricing.queries";
import { getPricingCopy, getPricingPlans, normalizePlanId } from "../pricing.constants";

interface PricingTableShellProps {
  locale?: AppLocale;
  currentPlanId?: "free" | "seller" | "coop_enterprise" | string;
}

export function PricingTableShell({
  locale = getClientLocale(),
  currentPlanId = "free",
}: PricingTableShellProps) {
  const copy = getPricingCopy(locale);
  const defaultPlans = getPricingPlans(locale);

  const { data: apiTiers, isLoading: isLoadingTiers } = useMembershipTiers();
  const { data: myPlanData } = useMyMembershipPlan();

  const activePlanId = myPlanData?.currentPlan ?? currentPlanId;

  // Sort API tiers by sortOrder if available
  const sortedApiTiers = apiTiers
    ? [...apiTiers].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    : null;

  const currencySymbol = locale === "en" ? "$" : "đ";
  const localeCode = locale === "en" ? "en-US" : "vi-VN";

  return (
    <div className="w-full space-y-6">
      {/* Premium Hero Banner Header */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950 via-primary-950 to-teal-950 p-8 text-center text-white shadow-xl md:p-12">
        {/* Background Orbs & Mesh Effects */}
        <div className="pointer-events-none absolute -right-16 -top-16 size-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 size-72 rounded-full bg-teal-400/20 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.25),rgba(255,255,255,0))]" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-semibold text-emerald-300 shadow-inner backdrop-blur-md">
            <Sparkles className="size-4 animate-pulse text-emerald-400" />
            <span>VietGreenX Premium Membership</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
            <span className="drop-shadow-xs bg-gradient-to-r from-emerald-200 via-teal-100 to-white bg-clip-text text-transparent">
              {copy.title}
            </span>
          </h1>

          <p className="mx-auto max-w-xl text-sm font-normal leading-relaxed text-emerald-100/90 sm:text-base">
            {copy.subtitle}
          </p>

          {/* Feature Pills */}
          {copy.pills && copy.pills.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs font-medium text-emerald-200">
              {copy.pills.map((pill) => (
                <span
                  key={pill}
                  className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3.5 py-1 backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  {pill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {isLoadingTiers ? (
        <div className="shadow-xs flex h-56 w-full items-center justify-center rounded-2xl border border-border/50 bg-card p-6">
          <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
            <Loader2 className="size-5 animate-spin text-primary" />
            <span>{copy.loading}</span>
          </div>
        </div>
      ) : sortedApiTiers && sortedApiTiers.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-3">
          {sortedApiTiers.map((tier, index) => {
            const normalizedId = normalizePlanId(tier.plan);
            const isCurrent =
              tier.plan === activePlanId ||
              (normalizedId !== null && normalizedId === activePlanId);
            const matchedDefault = defaultPlans.find(
              (p) => (normalizedId !== null && p.id === normalizedId) || p.id === tier.plan,
            );
            const isHighlighted = tier.plan === "seller" || normalizedId === "seller";

            const badgeText =
              (normalizedId && copy.planBadges[normalizedId as keyof typeof copy.planBadges]) ??
              tier.plan.toUpperCase();

            const formattedMonthlyPrice =
              tier.priceMonthly === 0
                ? copy.priceFree
                : `${tier.priceMonthly.toLocaleString(localeCode)}${currencySymbol}`;

            const formattedYearlyPrice =
              tier.priceYearly !== null && tier.priceYearly !== undefined && tier.priceYearly > 0
                ? `${tier.priceYearly.toLocaleString(localeCode)}${currencySymbol}`
                : null;

            return (
              <ElevatedCard
                key={`${tier.plan}-${index}`}
                className={cn(
                  "group relative flex flex-col rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
                  isHighlighted
                    ? "border-primary/40 bg-gradient-to-b from-primary/[0.04] via-card to-card shadow-md ring-2 ring-primary/30"
                    : "border-border/60 bg-card hover:border-border",
                )}
              >
                {/* Popular Badge */}
                {isHighlighted && (
                  <div className="absolute -top-3 right-4 z-20 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-600 to-primary px-3 py-0.5 text-[11px] font-bold text-white shadow-sm">
                    <Zap className="size-3 fill-white" />
                    <span>{copy.popularBadge}</span>
                  </div>
                )}

                <CardHeader className="space-y-3 pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider",
                        isHighlighted
                          ? "bg-primary/15 text-primary"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {badgeText}
                    </span>

                    {isCurrent && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                        {copy.current}
                      </span>
                    )}
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-foreground">{tier.displayName}</h2>
                    {tier.description && (
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {tier.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-2">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-extrabold tabular-nums tracking-tight text-foreground">
                        {formattedMonthlyPrice}
                      </span>
                      {tier.priceMonthly > 0 && (
                        <span className="text-sm font-medium text-muted-foreground">
                          {copy.perMonth}
                        </span>
                      )}
                    </div>

                    {formattedYearlyPrice && (
                      <div className="mt-1.5 inline-flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        <span>{copy.yearlyPricePrefix}</span>
                        <span>
                          {formattedYearlyPrice} {copy.perYear}
                        </span>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col gap-5 pt-1">
                  {/* Detailed Spec / Limit Box */}
                  <div className="space-y-2.5 rounded-xl border border-border/50 bg-muted/30 p-3.5 text-sm transition-colors group-hover:bg-muted/40">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 font-medium text-muted-foreground">
                        <span className="flex size-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <QrCode className="size-3.5" />
                        </span>
                        {copy.qrLimitLabel}
                      </span>
                      <span className="font-bold text-foreground">
                        {tier.qrLimit === -1
                          ? copy.unlimited
                          : `${tier.qrLimit.toLocaleString(localeCode)} ${copy.unitQr}`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 font-medium text-muted-foreground">
                        <span className="flex size-6 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                          <Package className="size-3.5" />
                        </span>
                        {copy.productLimitLabel}
                      </span>
                      <span className="font-bold text-foreground">
                        {tier.productLimit === -1
                          ? copy.unlimited
                          : `${tier.productLimit.toLocaleString(localeCode)} ${copy.unitProduct}`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 font-medium text-muted-foreground">
                        <span className="flex size-6 items-center justify-center rounded-lg bg-secondary-500/10 text-secondary-600 dark:text-secondary-400">
                          <ShoppingBag className="size-3.5" />
                        </span>
                        {copy.tradePostAllowedLabel}
                      </span>
                      <span
                        className={cn(
                          "font-bold",
                          tier.tradePostAllowed
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-muted-foreground",
                        )}
                      >
                        {tier.tradePostAllowed ? copy.allowed : copy.notSupported}
                      </span>
                    </div>
                  </div>

                  {/* Standard features checklist */}
                  {matchedDefault?.features && matchedDefault.features.length > 0 && (
                    <ul className="space-y-2.5 text-sm">
                      {matchedDefault.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 text-foreground/90">
                          <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                            <Check className="size-3 stroke-[3]" aria-hidden />
                          </span>
                          <span className="text-xs font-medium leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <Button
                    className={cn(
                      "shadow-xs mt-auto h-11 w-full rounded-xl font-semibold transition-all",
                      isHighlighted
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md"
                        : "border-border/80 hover:bg-accent hover:text-accent-foreground",
                    )}
                    variant={isHighlighted ? "default" : "outline"}
                    disabled={isCurrent}
                  >
                    {isCurrent ? copy.current : `${copy.upgrade} (${copy.comingSoon})`}
                  </Button>
                </CardContent>
              </ElevatedCard>
            );
          })}
        </div>
      ) : (
        /* Fallback if no API tiers */
        <div className="grid gap-6 md:grid-cols-3">
          {defaultPlans.map((plan) => {
            const isCurrent = plan.id === activePlanId;

            return (
              <ElevatedCard
                key={plan.id}
                className={cn(
                  "flex flex-col rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
                  plan.highlighted
                    ? "border-primary/40 bg-gradient-to-b from-primary/[0.04] via-card to-card shadow-md ring-2 ring-primary/30"
                    : "border-border/60 bg-card",
                )}
              >
                <CardHeader className="space-y-2 pb-2">
                  <h2 className="text-xl font-bold text-foreground">{plan.name}</h2>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                  <p className="pt-1">
                    <span className="text-3xl font-extrabold tabular-nums tracking-tight text-foreground">
                      {plan.priceLabel}
                    </span>
                    {plan.periodLabel && (
                      <span className="text-sm font-medium text-muted-foreground">
                        {plan.periodLabel}
                      </span>
                    )}
                  </p>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-4 pt-0">
                  <ul className="space-y-2.5 text-sm">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-foreground/90">
                        <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                          <Check className="size-3 stroke-[3]" aria-hidden />
                        </span>
                        <span className="text-xs font-medium leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="mt-auto h-11 w-full rounded-xl font-semibold"
                    variant={plan.highlighted ? "default" : "outline"}
                    disabled={isCurrent}
                  >
                    {isCurrent ? copy.current : `${copy.upgrade} (${copy.comingSoon})`}
                  </Button>
                </CardContent>
              </ElevatedCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
