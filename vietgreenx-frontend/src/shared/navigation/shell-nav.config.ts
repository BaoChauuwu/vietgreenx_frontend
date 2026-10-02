import { ROUTES } from "@/shared/routing";

import type { ShellCopy } from "@/shared/i18n/shell.copy";

export type ShellNavLabelKey = keyof ShellCopy["sideNav"];

export interface ShellNavItemConfig {
  href: string;
  labelKey: ShellNavLabelKey;
  accent?: "tertiary";
}

export const SHELL_NAV_TOUR_IDS: Partial<Record<string, string>> = {
  [ROUTES.marketplace]: "tour-nav-marketplace",
  [ROUTES.greenProfile]: "tour-nav-green-profile",
  [ROUTES.products]: "tour-nav-products",
  [ROUTES.batches]: "tour-nav-batches",
  [ROUTES.qr]: "tour-nav-qr",
  [ROUTES.org]: "tour-nav-org",
  [ROUTES.pricing]: "tour-nav-pricing",
  [ROUTES.savedSuppliers]: "tour-nav-saved-suppliers",
};

export const SHELL_NAV_ITEMS: ShellNavItemConfig[] = [
  { href: ROUTES.feed, labelKey: "feed" },
  { href: ROUTES.marketplace, labelKey: "marketplace" },
  { href: ROUTES.greenProfile, labelKey: "greenProfile" },
  { href: ROUTES.products, labelKey: "products" },
  { href: ROUTES.batches, labelKey: "batches" },
  { href: ROUTES.qr, labelKey: "qr", accent: "tertiary" },
  { href: ROUTES.org, labelKey: "org" },
  { href: ROUTES.quotations, labelKey: "quotations" },
  { href: ROUTES.savedSuppliers, labelKey: "saved" },
  { href: ROUTES.pricing, labelKey: "pricing" },
];

/** FB-style primary modules in top nav center (max 5). */
export const SHELL_TOP_NAV_ITEMS: ShellNavItemConfig[] = [
  { href: ROUTES.feed, labelKey: "feed" },
  { href: ROUTES.marketplace, labelKey: "marketplace" },
  { href: ROUTES.greenProfile, labelKey: "greenProfile" },
  { href: ROUTES.products, labelKey: "products" },
  { href: ROUTES.qr, labelKey: "qr", accent: "tertiary" },
  { href: ROUTES.pricing, labelKey: "pricing" },
];
