import {
  Building2,
  Crown,
  Home,
  Layers,
  Leaf,
  MessageCircle,
  Package,
  Pencil,
  QrCode,
  ShoppingBag,
  Truck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { ROUTES } from "@/shared/routing";

import type { ShellNavLabelKey } from "./shell-nav.config";

export const SHELL_NAV_ICONS: Partial<Record<ShellNavLabelKey, LucideIcon>> = {
  feed: Home,
  marketplace: ShoppingBag,
  greenProfile: Leaf,
  products: Package,
  batches: Layers,
  qr: QrCode,
  org: Building2,
  pricing: Crown,
  saved: Truck,
};

export const SHELL_NAV_ICON_TILE: Record<string, string> = {
  feed: "bg-primary/15 text-primary",
  marketplace: "bg-secondary-100 text-secondary-700",
  greenProfile: "bg-primary/10 text-primary",
  products: "bg-amber-100 text-amber-700",
  batches: "bg-orange-100 text-orange-700",
  qr: "bg-tertiary-50 text-tertiary",
  org: "bg-slate-200 text-slate-700",
  pricing: "bg-emerald-100 text-emerald-700",
  saved: "bg-emerald-100 text-emerald-700",
};

export const SHELL_FEED_SHORTCUT_ICONS: Partial<Record<string, LucideIcon>> = {
  [ROUTES.marketplace]: ShoppingBag,
  [ROUTES.greenProfile]: Leaf,
  [ROUTES.profileEdit]: Pencil,
  [ROUTES.chat]: MessageCircle,
};

export const SHELL_FEED_SHORTCUT_TILES = [
  "from-secondary-100 to-secondary-50",
  "from-primary/20 to-primary/5",
  "from-amber-100 to-amber-50",
  "from-sky-100 to-sky-50",
] as const;
