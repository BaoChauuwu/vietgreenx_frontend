"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Home, QrCode, ShoppingBag, User } from "lucide-react";

import { canAccessNavRoute, useUser } from "@/shared/auth";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { cn } from "@/shared/lib/cn";
import { ROUTES } from "@/shared/routing";

import { getShellCopy } from "@/shared/i18n/shell.copy";

import { NotificationUnreadBadge } from "./NotificationUnreadBadge";

interface AppBottomNavProps {
  locale?: AppLocale;
}

export function AppBottomNav({ locale = getClientLocale() }: AppBottomNavProps) {
  const pathname = usePathname();
  const { role } = useUser();
  const copy = getShellCopy(locale).bottomNav;

  const bottomItems: Array<{
    href: string;
    label: string;
    icon: typeof Home;
    accent?: "tertiary";
    tourId?: string;
  }> = [
    { href: ROUTES.feed, label: copy.feed, icon: Home },
    {
      href: ROUTES.marketplace,
      label: copy.marketplace,
      icon: ShoppingBag,
      tourId: "tour-nav-marketplace",
    },
    { href: ROUTES.qr, label: copy.qr, icon: QrCode, accent: "tertiary", tourId: "tour-nav-qr" },
    { href: ROUTES.notifications, label: copy.notifications, icon: Bell },
    { href: ROUTES.profile, label: copy.profile, icon: User },
  ];

  const visibleItems = bottomItems.filter((item) => canAccessNavRoute(role, item.href));

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 border-t border-border/50 bg-card/95 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] backdrop-blur supports-[backdrop-filter]:bg-card/90 md:hidden">
      {visibleItems.map(({ href, label, icon: Icon, accent, tourId }) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={href}
            href={href}
            data-tour={tourId}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors",
              isActive
                ? "text-primary"
                : accent === "tertiary"
                  ? "text-muted-foreground/70 hover:text-tertiary"
                  : "text-muted-foreground/70 hover:text-primary",
            )}
          >
            <span
              className={cn(
                "relative flex h-7 min-w-[52px] items-center justify-center rounded-full transition-all duration-200",
                isActive
                  ? accent === "tertiary"
                    ? "bg-tertiary/10"
                    : "bg-primary/10"
                  : "",
              )}
            >
              <Icon
                className={cn(
                  "size-[22px] transition-all",
                  isActive && accent !== "tertiary" && "text-primary",
                  isActive && accent === "tertiary" && "text-tertiary",
                )}
              />
              {href === ROUTES.notifications ? (
                <NotificationUnreadBadge className="-right-0.5 -top-0.5" />
              ) : null}
            </span>
            <span className={cn("text-[10px]", isActive ? "font-semibold" : "font-medium")}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
