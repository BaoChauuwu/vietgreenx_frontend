"use client";

import {
  MemberListShell,
  OrgDashboardShell,
  OrgEditFormShell,
} from "@/features/organization";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { ModulePageShell } from "@/shared/ui/module-page-shell";
import { OrgDashboardRail, OrgMembersRail } from "./OrgRails";

interface OrgDashboardScreenProps {
  locale?: AppLocale;
}

export function OrgDashboardScreen({ locale = getClientLocale() }: OrgDashboardScreenProps) {
  return (
    <ModulePageShell
      width="work"
      rightRail={
        <OrgDashboardRail locale={locale} />
      }
    >
      <OrgDashboardShell locale={locale} />
    </ModulePageShell>
  );
}

interface OrgMembersScreenProps {
  locale?: AppLocale;
}

export function OrgMembersScreen({ locale = getClientLocale() }: OrgMembersScreenProps) {
  return (
    <ModulePageShell
      width="work"
      rightRail={
        <OrgMembersRail locale={locale} />
      }
    >
      <MemberListShell locale={locale} />
    </ModulePageShell>
  );
}

interface OrgEditScreenProps {
  locale?: AppLocale;
}

export function OrgEditScreen({ locale = getClientLocale() }: OrgEditScreenProps) {
  return (
    <ModulePageShell width="form">
      <OrgEditFormShell locale={locale} />
    </ModulePageShell>
  );
}
