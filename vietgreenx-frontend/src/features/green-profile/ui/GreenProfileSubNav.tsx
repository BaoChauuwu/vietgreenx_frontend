"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { cn } from "@/shared/lib/cn";
import { ROUTES } from "@/shared/routing";

import { getGreenProfileCopy } from "../green-profile.constants";

interface GreenProfileSubNavProps {
  greenProfileId: string;
  locale?: AppLocale;
  className?: string;
}

export function GreenProfileSubNav({
  greenProfileId,
  locale = getClientLocale(),
  className,
}: GreenProfileSubNavProps) {
  const copy = getGreenProfileCopy(locale).nav;
  const pathname = usePathname();

  const tabs = [
    { href: ROUTES.greenProfileEdit(greenProfileId), label: copy.edit },
    { href: ROUTES.greenProfileSeasons(greenProfileId), label: copy.seasons },
    { href: ROUTES.greenProfileLog(greenProfileId), label: copy.log },
  ] as const;

  return (
    <nav
      className={cn("no-scrollbar flex gap-1 overflow-x-auto border-b border-border", className)}
      aria-label={copy.breadcrumb}
    >
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "-mb-px whitespace-nowrap border-b-[3px] px-3 pb-2.5 pt-1 text-sm font-medium transition-colors",
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
