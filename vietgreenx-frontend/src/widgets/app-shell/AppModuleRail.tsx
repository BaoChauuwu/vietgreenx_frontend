"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronUp, Home, ShoppingBag } from "lucide-react";

import { useMyProfile } from "@/features/profile";
import { getInitials } from "@/entities/user";
import { canAccessNavRoute, useUser } from "@/shared/auth";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { getShellCopy } from "@/shared/i18n/shell.copy";
import { cn } from "@/shared/lib/cn";
import { resolveMediaUrl } from "@/shared/lib/resolve-media-url";
import {
  SHELL_FEED_SHORTCUT_ICONS,
  SHELL_FEED_SHORTCUT_TILES,
  SHELL_NAV_ICON_TILE,
  SHELL_NAV_ICONS,
  SHELL_NAV_ITEMS,
  SHELL_NAV_TOUR_IDS,
} from "@/shared/navigation";
import { ROUTES } from "@/shared/routing";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { VGX_GHOST_ITEM, VGX_MICRO_SURFACE } from "@/shared/ui/page-layout";

interface AppModuleRailProps {
  locale?: AppLocale;
}

export function AppModuleRail({ locale = getClientLocale() }: AppModuleRailProps) {
  const pathname = usePathname();
  const { role, user } = useUser();
  const { data: profile } = useMyProfile();
  const shellCopy = getShellCopy(locale);
  const sideCopy = shellCopy.sideNav;
  const columnCopy = shellCopy.feedColumn;
  const [isProductsOpen, setIsProductsOpen] = useState(true);

  const visibleItems = SHELL_NAV_ITEMS.filter((item) => canAccessNavRoute(role, item.href));
  const shortcuts = columnCopy.shortcuts.filter((item) => canAccessNavRoute(role, item.href));
  const footerLinks = columnCopy.footer.filter((item) => canAccessNavRoute(role, item.href));

  const displayName = profile?.displayName ?? user?.email ?? "VietGreenX";
  const avatarSrc = resolveMediaUrl(profile?.avatarUrl);

  return (
    <nav
      aria-label={sideCopy.ariaLabel}
      className="sticky top-20 flex max-h-[calc(100dvh-5.5rem)] flex-col"
    >
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pb-4">
        <Link href={ROUTES.profile} className={cn(VGX_GHOST_ITEM, "flex items-center gap-3")}>
          <Avatar className="size-9 shrink-0">
            {avatarSrc && <AvatarImage src={avatarSrc} alt={displayName} />}
            <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
          <span className="truncate text-[15px] font-semibold text-foreground">{displayName}</span>
        </Link>

        <ul className="space-y-0.5">
          {visibleItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const label = sideCopy[item.labelKey];
            const Icon = SHELL_NAV_ICONS[item.labelKey] ?? Home;
            const tileClass = SHELL_NAV_ICON_TILE[item.labelKey] ?? "bg-muted text-foreground";

            if (item.href === ROUTES.products) {
              const isProductsCreate = pathname === ROUTES.productCreate;
              const isProductsMyList = isActive && !isProductsCreate;

              return (
                <li key={item.href} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setIsProductsOpen(!isProductsOpen)}
                    className={cn(
                      VGX_GHOST_ITEM,
                      "flex w-full items-center justify-between gap-3",
                      isActive && VGX_MICRO_SURFACE,
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center rounded-full",
                          tileClass,
                        )}
                      >
                        <Icon className="size-[18px]" aria-hidden />
                      </span>
                      <span
                        className={cn(
                          "text-[15px] font-medium leading-tight",
                          isActive ? "font-semibold text-foreground" : "text-foreground/90",
                        )}
                      >
                        {label}
                      </span>
                    </div>
                    <ChevronUp
                      className={cn(
                        "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                        !isProductsOpen && "rotate-180",
                      )}
                    />
                  </button>

                  {isProductsOpen && (
                    <div className="my-1 ml-4 flex flex-col gap-1 border-l-2 border-primary/30 pl-3">
                      <Link
                        href={ROUTES.products}
                        className={cn(
                          "block truncate rounded-lg px-3 py-2 text-sm font-medium transition-all",
                          isProductsMyList
                            ? "bg-primary/10 font-semibold text-primary shadow-sm"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        {sideCopy.productsMyList}
                      </Link>
                      <Link
                        href={ROUTES.productCreate}
                        className={cn(
                          "block truncate rounded-lg px-3 py-2 text-sm font-medium transition-all",
                          isProductsCreate
                            ? "border border-emerald-600/30 bg-emerald-600/15 font-semibold text-emerald-600 shadow-sm dark:text-emerald-400"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        {sideCopy.productsCreate}
                      </Link>
                    </div>
                  )}
                </li>
              );
            }

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  data-tour={SHELL_NAV_TOUR_IDS[item.href]}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    VGX_GHOST_ITEM,
                    "flex items-center gap-3",
                    isActive && VGX_MICRO_SURFACE,
                  )}
                >
                  <span
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-full",
                      tileClass,
                    )}
                  >
                    <Icon className="size-[18px]" aria-hidden />
                  </span>
                  <span
                    className={cn(
                      "text-[15px] font-medium leading-tight",
                      isActive ? "text-foreground" : "text-foreground/90",
                    )}
                  >
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {shortcuts.length > 0 && (
          <section aria-labelledby="app-module-rail-shortcuts">
            <h2
              id="app-module-rail-shortcuts"
              className="px-2 pb-1 pt-2 text-[17px] font-semibold tracking-tight text-muted-foreground"
            >
              {columnCopy.shortcutsTitle}
            </h2>
            <ul className="space-y-0.5">
              {shortcuts.map((item, index) => {
                const Icon = SHELL_FEED_SHORTCUT_ICONS[item.href] ?? ShoppingBag;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(VGX_GHOST_ITEM, "flex items-center gap-3")}
                    >
                      <span
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br",
                          SHELL_FEED_SHORTCUT_TILES[index % SHELL_FEED_SHORTCUT_TILES.length],
                        )}
                      >
                        <Icon className="size-4 text-foreground/80" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[15px] font-medium text-foreground">
                        {item.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>

      {footerLinks.length > 0 && (
        <div className="shrink-0 border-t border-border/60 px-2 pb-2 pt-3">
          <ul className="flex flex-wrap gap-x-2 gap-y-1">
            {footerLinks.map((link) => (
              <li key={`${link.href}-${link.label}`}>
                <Link
                  href={link.href}
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
