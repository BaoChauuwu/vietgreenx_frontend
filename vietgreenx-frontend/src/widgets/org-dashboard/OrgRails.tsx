"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Building2, ShoppingBag, UserPlus } from "lucide-react";

import { getOrganizationCopy } from "@/features/organization";
import { getPostsCopy } from "@/features/posts";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { ROUTES } from "@/shared/routing";
import { Button } from "@/shared/ui/button";
import { FarmTipsRail, WorkspaceRailCard } from "@/shared/ui/workspace-rail-card";

interface LocaleProps {
  locale?: AppLocale;
}

function RailButtonStack({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

export function OrgDashboardRail({ locale = getClientLocale() }: LocaleProps) {
  const copy = getOrganizationCopy(locale).dashboard;
  const aside = getPostsCopy(locale).aside;

  return (
    <>
      <WorkspaceRailCard title={copy.rail.title} description={copy.subtitle}>
        <RailButtonStack>
          <Button asChild variant="outline" size="sm" className="w-full justify-start gap-1.5">
            <Link href={ROUTES.orgMembers}>
              <UserPlus className="size-4" />
              {copy.manageMembers}
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="w-full justify-start gap-1.5">
            <Link href={ROUTES.orgEdit}>
              <Building2 className="size-4" />
              {copy.editOrg}
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="w-full justify-start gap-1.5">
            <Link href={ROUTES.marketplace}>
              <ShoppingBag className="size-4" />
              {copy.stats.listings}
            </Link>
          </Button>
        </RailButtonStack>
      </WorkspaceRailCard>
      <FarmTipsRail tipsTitle={aside.tipsTitle} tips={aside.tips} />
    </>
  );
}

export function OrgMembersRail({ locale = getClientLocale() }: LocaleProps) {
  const { members: copy, nav } = getOrganizationCopy(locale);
  const aside = getPostsCopy(locale).aside;

  return (
    <>
      <WorkspaceRailCard title={copy.rail.title} description={copy.emptyDescription}>
        <RailButtonStack>
          <Button disabled size="sm" className="w-full justify-start gap-1.5">
            <UserPlus className="size-4" />
            {copy.inviteCta}
          </Button>
          <Button asChild variant="outline" size="sm" className="w-full justify-start gap-1.5">
            <Link href={ROUTES.org}>
              <Building2 className="size-4" />
              {nav.dashboard}
            </Link>
          </Button>
        </RailButtonStack>
      </WorkspaceRailCard>
      <FarmTipsRail tipsTitle={aside.tipsTitle} tips={aside.tips} />
    </>
  );
}
