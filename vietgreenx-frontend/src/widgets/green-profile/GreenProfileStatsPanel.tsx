"use client";

import { Award, Hash, Leaf, Ruler, Scale } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { GreenProfile } from "@/entities/green-profile";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { getGreenProfileCopy } from "@/features/green-profile";

function StatItem({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border/50 bg-white p-4 shadow-sm">
      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
        <Icon className="size-4.5 text-emerald-600" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 truncate text-sm font-bold leading-snug">{value}</p>
        {sub ? <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p> : null}
      </div>
    </div>
  );
}

export function GreenProfileStatsPanel({
  profile,
  certifications,
  locale,
}: {
  profile?: GreenProfile;
  certifications?: { certType: string }[];
  locale?: AppLocale;
}) {
  const currentLocale = locale || getClientLocale();
  const t = getGreenProfileCopy(currentLocale).hub.statsPanel;
  const hasProfile = Boolean(profile);

  const certNames =
    certifications && certifications.length > 0
      ? certifications
          .map((c) =>
            c.certType === "vietgap"
              ? "VietGAP"
              : c.certType === "organic"
                ? "Hữu cơ" // We probably should i18n this too if we have generic translation, but let's stick to simple
                : c.certType.toUpperCase(),
          )
          .join(", ")
      : t.notUpdated;

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
      <StatItem
        icon={Leaf}
        label={t.mainProducts}
        value={hasProfile && profile?.mainCategoryIds.length ? t.cleanOrganic : t.notUpdated}
      />
      <StatItem
        icon={Ruler}
        label={t.area}
        value={profile?.farmAreaHa != null ? `${profile.farmAreaHa} ${t.ha}` : "—"}
        sub={t.cultivationZone}
      />
      <StatItem
        icon={Scale}
        label={t.yield}
        value={
          profile?.annualYieldTonnes != null
            ? `${profile.annualYieldTonnes} ${t.tonnesPerYear}`
            : "—"
        }
        sub={`${t.yieldEstimate} ${new Date().getFullYear()}`}
      />
      <StatItem icon={Award} label={t.certifications} value={certNames} />
      <StatItem icon={Hash} label={t.growingZone} value={profile?.growingZoneCode || "—"} />
    </div>
  );
}
