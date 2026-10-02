"use client";

import { Award, BarChart2, Leaf, MapPin, Pencil, CheckCircle2 } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { CardContent } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import { cn } from "@/shared/lib/cn";
import { resolveMediaUrl } from "@/shared/lib/resolve-media-url";

import Link from "next/link";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { getGreenProfileCopy } from "@/features/green-profile";
import { toIntlLocale } from "@/shared/lib/format-relative-time";
import { GreenProfileStatsPanel } from "./GreenProfileStatsPanel";
import { GreenProfilePhotosPanel } from "./GreenProfilePhotosPanel";
import { GreenProfileVideoPanel } from "./GreenProfileVideoPanel";
import { GreenProfileRatingPanel } from "./GreenProfileRatingPanel";
import { GreenProfileTransactionPanel } from "./GreenProfileTransactionPanel";
import { ROUTES } from "@/shared/routing";
import { useCertifications } from "@/features/certification";
import type { GreenProfile } from "@/entities/green-profile";
import { formatGreenProfileLocation } from "@/entities/green-profile";
import { getInitials } from "@/entities/user";
import { useWardsByProvince } from "@/entities/location/api/location.queries";

export function GreenProfileHubView({
  profile,
  locale = getClientLocale(),
}: {
  profile: GreenProfile;
  locale?: AppLocale;
}) {
  const copy = getGreenProfileCopy(locale);
  const t = copy.hub.view;
  const { data: certifications } = useCertifications(profile.id);
  const activeCertifications = (certifications || []).filter(
    (cert) => cert.status === "approved" || cert.status === "valid",
  );

  const initials = getInitials(profile.profileName);
  const date = new Date(profile.createdAt);
  const month = date.toLocaleDateString(toIntlLocale(locale), { month: "2-digit" });
  const joinedDateStr = t.memberSince(month, date.getFullYear());

  const { data: wards } = useWardsByProvince(profile.provinceCode ?? undefined);
  const wardName = wards?.find((w) => w.code === profile.wardCode)?.name;

  const zoneParts = [profile.addressDetail, wardName].filter(Boolean);
  const productionZone = zoneParts.length > 0 ? zoneParts.join(", ") : t.notUpdated;

  return (
    <div className="space-y-3">
      {/* Profile header */}
      <ElevatedCard className="overflow-hidden rounded-2xl border-none bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-4">
              <div className="relative shrink-0">
                {profile.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={resolveMediaUrl(profile.avatarUrl)}
                    alt={profile.profileName}
                    className="size-[84px] rounded-full object-cover shadow-inner ring-2 ring-emerald-50"
                  />
                ) : (
                  <div className="flex size-[84px] items-center justify-center rounded-full bg-emerald-500 text-3xl font-bold text-white shadow-inner">
                    {initials}
                  </div>
                )}
                {profile.isPublished && (
                  <div className="absolute bottom-0 right-0 flex size-6 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white">
                    <CheckCircle2 className="size-4 text-white" />
                  </div>
                )}
              </div>

              <div className="min-w-0 space-y-2 py-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold leading-tight text-slate-800 sm:text-2xl">
                    {profile.profileName}
                  </h2>
                  {profile.isPublished && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-600">
                      <CheckCircle2 className="size-3" />
                      {t.verified}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] font-medium text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-4 shrink-0 text-muted-foreground/70" />
                    {formatGreenProfileLocation(profile)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Leaf className="size-4 shrink-0 text-emerald-600" />
                    {t.growingZoneLabel}: {productionZone}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-1">
                  {activeCertifications.length > 0 ? (
                    activeCertifications.map((cert) => (
                      <span
                        key={cert.id}
                        className={cn(
                          "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-bold",
                          cert.certType === "vietgap"
                            ? "border-orange-100 bg-orange-50 text-orange-600"
                            : cert.certType === "organic"
                              ? "border-emerald-100 bg-emerald-50 text-emerald-600"
                              : "border-blue-100 bg-blue-50 text-blue-600",
                        )}
                      >
                        {cert.certType === "vietgap" || cert.certType === "organic" ? (
                          <Leaf className="size-3" />
                        ) : (
                          <Award className="size-3" />
                        )}
                        {cert.certType === "vietgap"
                          ? copy.hub.certLabels.vietgap
                          : cert.certType === "organic"
                            ? copy.hub.certLabels.organic
                            : cert.certType.toUpperCase()}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs font-medium italic text-muted-foreground">
                      {copy.hub.notCertified}
                    </span>
                  )}
                  <span className="pl-1 text-xs font-medium text-muted-foreground">
                    {joinedDateStr}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-2.5 pt-1">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="gap-2 rounded-lg border-orange-500 font-semibold text-orange-600 shadow-sm hover:bg-orange-50 hover:text-orange-700"
              >
                <Link href={ROUTES.greenProfileEdit(profile.id)}>
                  <Pencil className="size-4" />
                  {t.editProfile}
                </Link>
              </Button>
              <Button
                size="sm"
                className="gap-2 rounded-lg bg-emerald-600 font-semibold text-white shadow-sm hover:bg-emerald-700"
              >
                <BarChart2 className="size-4" />
                {t.viewStats}
              </Button>
            </div>
          </div>
        </CardContent>
      </ElevatedCard>

      {/* Stats */}
      <GreenProfileStatsPanel
        profile={profile}
        certifications={activeCertifications}
        locale={locale}
      />

      {/* 3-column: Photos / Video / Rating */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <GreenProfilePhotosPanel profile={profile} locale={locale} />
        <GreenProfileVideoPanel profile={profile} locale={locale} />
        <GreenProfileRatingPanel profile={profile} locale={locale} />
      </div>

      {/* Transaction table */}
      <GreenProfileTransactionPanel profile={profile} locale={locale} />
    </div>
  );
}
