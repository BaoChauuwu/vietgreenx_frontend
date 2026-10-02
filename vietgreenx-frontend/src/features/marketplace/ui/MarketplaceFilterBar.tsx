"use client";

import { useState } from "react";

import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";

import { MARKETPLACE_TABS, getMarketplaceCopy } from "../marketplace.constants";
import type { MarketplaceTab } from "../marketplace.types";

interface MarketplaceFilterBarProps {
  locale?: AppLocale;
  className?: string;
  value?: MarketplaceTab;
  onChange?: (tab: MarketplaceTab) => void;
}

export function MarketplaceFilterBar({
  locale = getClientLocale(),
  className,
  value,
  onChange,
}: MarketplaceFilterBarProps) {
  const copy = getMarketplaceCopy(locale).tabs;
  const [internal, setInternal] = useState<MarketplaceTab>("all");
  const active = value ?? internal;

  const setActive = (tab: MarketplaceTab) => {
    setInternal(tab);
    onChange?.(tab);
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)} role="tablist" aria-label={copy.all}>
      {MARKETPLACE_TABS.map((tab) => (
        <Button
          key={tab}
          type="button"
          role="tab"
          aria-selected={active === tab}
          variant={active === tab ? "default" : "outline"}
          size="sm"
          className="h-8 rounded-full px-3.5"
          onClick={() => setActive(tab)}
        >
          {copy[tab]}
        </Button>
      ))}
    </div>
  );
}
