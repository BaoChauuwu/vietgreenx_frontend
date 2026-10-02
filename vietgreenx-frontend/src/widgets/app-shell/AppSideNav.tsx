"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  Building2,
  ChevronUp,
  HelpCircle,
  Home,
  MessageCircle,
  Package,
  QrCode,
  Settings,
  Star,
  User,
  UserCheck,
  Store,
  DollarSign,
} from "lucide-react";

import { canAccessNavRoute, useUser } from "@/shared/auth";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { getShellCopy } from "@/shared/i18n/shell.copy";
import { cn } from "@/shared/lib/cn";
import { ROUTES } from "@/shared/routing";

interface AppSideNavProps {
  locale?: AppLocale;
}

function NavItem({
  href,
  icon,
  label,
  isActive,
  disabled,
  comingSoon,
}: {
  href: string | null;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  disabled?: boolean;
  comingSoon?: string;
}) {
  const cls = cn(
    "flex items-center justify-center gap-2 rounded px-3 py-2.5 text-sm font-medium transition-colors lg:justify-start",
    isActive
      ? "bg-primary-800 font-semibold text-white"
      : disabled
        ? "cursor-not-allowed text-white/30"
        : "text-white hover:bg-white/10",
  );

  if (!href || disabled) {
    return (
      <span
        className={cls}
        aria-disabled="true"
        title={comingSoon ? `${label} — ${comingSoon}` : label}
      >
        {icon}
        <span className="hidden lg:inline">{label}</span>
      </span>
    );
  }

  return (
    <Link href={href} aria-current={isActive ? "page" : undefined} className={cls} title={label}>
      {icon}
      <span className="hidden lg:inline">{label}</span>
    </Link>
  );
}

export function AppSideNav({ locale = getClientLocale() }: AppSideNavProps) {
  const pathname = usePathname();
  const { role } = useUser();
  const copy = getShellCopy(locale).sideNav;
  const [isProductsOpen, setIsProductsOpen] = useState(true);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const primaryNav = [
    { href: ROUTES.feed, label: copy.feed, icon: <Home className="size-5 shrink-0" /> },
    {
      href: ROUTES.greenProfile,
      label: copy.greenProfile,
      icon: <User className="size-5 shrink-0" />,
    },
    { href: ROUTES.products, label: copy.products, icon: <Package className="size-5 shrink-0" /> },
    { href: ROUTES.qr, label: copy.qr, icon: <QrCode className="size-5 shrink-0" /> },
    { href: "/orgs", label: copy.organizations, icon: <Store className="size-5 shrink-0" /> },
    { href: ROUTES.chat, label: copy.chat, icon: <MessageCircle className="size-5 shrink-0" /> },
    {
      href: ROUTES.org,
      label: copy.org,
      icon: <Building2 className="size-5 shrink-0" />,
    },
    {
      href: ROUTES.quotations,
      label: copy.quotations,
      icon: <DollarSign className="size-5 shrink-0" />,
    },
  ].filter((item) => canAccessNavRoute(role, item.href));

  const secondaryNav = [
    {
      href: ROUTES.notifications,
      label: copy.notifications,
      icon: <Bell className="size-5 shrink-0" />,
      disabled: false,
    },
    {
      href: null,
      label: copy.favorites,
      icon: <Star className="size-5 shrink-0" />,
      disabled: true,
    },
    {
      href: ROUTES.savedSuppliers,
      label: copy.saved,
      icon: <UserCheck className="size-5 shrink-0" />,
      disabled: false,
    },
  ];

  const bottomNav = [
    {
      href: ROUTES.settings,
      label: copy.settings,
      icon: <Settings className="size-5 shrink-0" />,
      disabled: false,
    },
    {
      href: null,
      label: copy.help,
      icon: <HelpCircle className="size-5 shrink-0" />,
      disabled: true,
    },
  ];

  return (
    <nav
      aria-label={copy.ariaLabel}
      className="sticky top-16 hidden h-[calc(100dvh-4rem)] w-[60px] shrink-0 flex-col overflow-y-auto bg-primary-900 md:flex lg:w-[230px]"
    >
      <div className="flex flex-col gap-4 px-2 pt-3">
        {primaryNav.map((item) => {
          if (item.href === ROUTES.products) {
            const isProductsActive =
              pathname === ROUTES.products || pathname.startsWith(`${ROUTES.products}/`);
            const isProductsCreate = pathname === ROUTES.productCreate;
            const isProductsMyList = isProductsActive && !isProductsCreate;

            return (
              <div key={item.href} className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsProductsOpen(!isProductsOpen)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded px-3 py-2.5 text-sm font-medium transition-colors lg:justify-between",
                    isProductsActive
                      ? "bg-primary-800 font-semibold text-white shadow-sm"
                      : "text-white hover:bg-white/10",
                  )}
                  title={item.label}
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span className="hidden lg:inline">{item.label}</span>
                  </div>
                  <ChevronUp
                    className={cn(
                      "hidden size-4 shrink-0 transition-transform duration-200 lg:block",
                      !isProductsOpen && "rotate-180",
                    )}
                  />
                </button>

                {isProductsOpen && (
                  <div className="my-0.5 ml-4 hidden flex-col gap-1 border-l-2 border-primary-700/60 pl-3.5 lg:flex">
                    <Link
                      href={ROUTES.products}
                      className={cn(
                        "block truncate rounded-lg px-3 py-2 text-sm font-medium transition-all",
                        isProductsMyList
                          ? "bg-primary-800/90 font-semibold text-white shadow-sm"
                          : "text-white/80 hover:bg-white/10 hover:text-white",
                      )}
                    >
                      {copy.productsMyList}
                    </Link>
                    <Link
                      href={ROUTES.productCreate}
                      className={cn(
                        "block truncate rounded-lg px-3 py-2 text-sm font-medium transition-all",
                        isProductsCreate
                          ? "border border-[#10b981]/40 bg-[#10b981]/25 font-semibold text-white shadow-sm"
                          : "text-white/80 hover:bg-white/10 hover:text-white",
                      )}
                    >
                      {copy.productsCreate}
                    </Link>
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={isActive(item.href)}
            />
          );
        })}
      </div>

      <div className="mx-3 my-2 h-px bg-primary/70" />

      <div className="flex flex-col gap-4 px-2">
        {secondaryNav.map((item) => (
          <NavItem
            key={item.label}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={!!item.href && isActive(item.href)}
            disabled={item.disabled}
            comingSoon={item.disabled ? copy.comingSoon : undefined}
          />
        ))}
      </div>

      <div className="flex-1" />

      <div className="mx-3 my-2 h-px bg-primary/70" />

      <div className="flex flex-col gap-4 px-2 pb-4">
        {bottomNav.map((item) => (
          <NavItem
            key={item.label}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={!!item.href && isActive(item.href)}
            disabled={item.disabled}
            comingSoon={item.disabled ? copy.comingSoon : undefined}
          />
        ))}
      </div>
    </nav>
  );
}
