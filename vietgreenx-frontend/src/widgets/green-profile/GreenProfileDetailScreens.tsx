"use client";

import type { GreenProfile } from "@/entities/green-profile";
import {
  GreenProfileContextHeader,
  GreenProfileFormShell,
  GreenProfileRouteGate,
  type GreenProfileRouteSegment,
} from "@/features/green-profile";
import { GreenProfileCertificationsPanel } from "./GreenProfileCertificationsPanel";
import { GreenProfileLogPanel } from "./GreenProfileLogPanel";
import { GreenProfileSeasonsPanel } from "./GreenProfileSeasonsPanel";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import { ModulePageShell } from "@/shared/ui/module-page-shell";
import { GreenProfileContextRail } from "./GreenProfileRails";

interface GreenProfileDetailShellProps {
  greenProfileId: string;
  segment: GreenProfileRouteSegment;
  locale: AppLocale;
  children: (profile: GreenProfile) => React.ReactNode;
}

function GreenProfileDetailShell({
  greenProfileId,
  segment,
  locale,
  children,
}: GreenProfileDetailShellProps) {
  return (
    <ModulePageShell
      width="work"
      contentClassName="space-y-6"
      rightRail={<GreenProfileContextRail greenProfileId={greenProfileId} locale={locale} />}
    >
      <GreenProfileRouteGate profileId={greenProfileId} segment={segment} locale={locale}>
        {(profile) => (
          <ElevatedCard className="overflow-hidden rounded-3xl border border-emerald-500/20 bg-card shadow-md shadow-emerald-500/5">
            <div className="border-b border-border/60 bg-gradient-to-r from-emerald-50/60 via-card to-card p-5 px-6 pb-0">
              <GreenProfileContextHeader
                greenProfileId={profile.id}
                profileName={profile.profileName}
                locale={locale}
              />
            </div>
            <div className="p-0">{children(profile)}</div>
          </ElevatedCard>
        )}
      </GreenProfileRouteGate>
    </ModulePageShell>
  );
}

interface ScreenProps {
  greenProfileId: string;
  locale?: AppLocale;
}

export function GreenProfileEditScreen({
  greenProfileId,
  locale = getClientLocale(),
}: ScreenProps) {
  return (
    <GreenProfileDetailShell greenProfileId={greenProfileId} segment="edit" locale={locale}>
      {(profile) => (
        <GreenProfileFormShell mode="edit" profile={profile} locale={locale}>
          <GreenProfileCertificationsPanel profile={profile} locale={locale} />
        </GreenProfileFormShell>
      )}
    </GreenProfileDetailShell>
  );
}

export function GreenProfileSeasonsScreen({
  greenProfileId,
  locale = getClientLocale(),
}: ScreenProps) {
  return (
    <GreenProfileDetailShell greenProfileId={greenProfileId} segment="seasons" locale={locale}>
      {(profile) => <GreenProfileSeasonsPanel profile={profile} locale={locale} />}
    </GreenProfileDetailShell>
  );
}

export function GreenProfileLogScreen({ greenProfileId, locale = getClientLocale() }: ScreenProps) {
  return (
    <GreenProfileDetailShell greenProfileId={greenProfileId} segment="log" locale={locale}>
      {(profile) => <GreenProfileLogPanel profile={profile} locale={locale} />}
    </GreenProfileDetailShell>
  );
}
