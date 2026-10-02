"use client";

import Link from "next/link";
import { Building2, Pencil, Users } from "lucide-react";

import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { cn } from "@/shared/lib/cn";
import { ROUTES } from "@/shared/routing";

import { getOrganizationCopy } from "../organization.constants";

type OrgNavKey = "dashboard" | "members" | "edit";

interface OrgSubNavProps {
  locale?: AppLocale;
  active: OrgNavKey;
  className?: string;
}

export function OrgSubNav({ locale = getClientLocale(), active, className }: OrgSubNavProps) {
  const copy = getOrganizationCopy(locale).nav;

  const items: { key: OrgNavKey; href: string; label: string; icon: typeof Building2 }[] = [
    { key: "dashboard", href: ROUTES.org, label: copy.dashboard, icon: Building2 },
    { key: "members", href: ROUTES.orgMembers, label: copy.members, icon: Users },
    { key: "edit", href: ROUTES.orgEdit, label: copy.edit, icon: Pencil },
  ];

  return (
    <nav className={cn("no-scrollbar flex overflow-x-auto", className)}>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.key;
        return (
          <Link
            key={item.key}
            href={item.href}
            className={cn(
              "flex shrink-0 items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-all duration-150",
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:border-border/60 hover:text-foreground",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon
              className={cn(
                "size-4 shrink-0",
                isActive ? "text-primary" : "text-muted-foreground/70",
              )}
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
