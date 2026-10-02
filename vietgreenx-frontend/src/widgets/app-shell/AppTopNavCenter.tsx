"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";

import { canAccessNavRoute, useUser } from "@/shared/auth";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { getShellCopy } from "@/shared/i18n/shell.copy";
import { cn } from "@/shared/lib/cn";
import { SHELL_NAV_ICONS, SHELL_TOP_NAV_ITEMS } from "@/shared/navigation";

interface AppTopNavCenterProps {
  locale?: AppLocale;
  className?: string;
}

export function AppTopNavCenter({ locale = getClientLocale(), className }: AppTopNavCenterProps) {
  const pathname = usePathname();
  const { role } = useUser();
  const shellCopy = getShellCopy(locale);
  const sideCopy = shellCopy.sideNav;

  const visibleItems = SHELL_TOP_NAV_ITEMS.filter((item) => canAccessNavRoute(role, item.href));

  if (visibleItems.length === 0) return null;

  return (
    <nav
      aria-label={shellCopy.topNav.centerAriaLabel}
      className={cn("flex items-stretch justify-center gap-0.5", className)}
    >
      {visibleItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const label = sideCopy[item.labelKey];
        const Icon = SHELL_NAV_ICONS[item.labelKey] ?? Home;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            aria-label={label}
            title={label}
            className={cn(
              "relative flex h-14 w-[4.25rem] items-center justify-center rounded-lg transition-colors",
              isActive
                ? "text-primary after:absolute after:bottom-0 after:left-2 after:right-2 after:h-[3px] after:rounded-full after:bg-primary"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            <Icon className="size-6" aria-hidden />
          </Link>
        );
      })}
    </nav>
  );
}
