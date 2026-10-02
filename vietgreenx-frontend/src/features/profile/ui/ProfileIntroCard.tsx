"use client";

import Link from "next/link";
import { ChevronRight, Globe, Leaf, MapPin, ShoppingBag, User } from "lucide-react";

import type { ProfileResponse } from "@/entities/user";
import { useUser } from "@/shared/auth";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { cn } from "@/shared/lib/cn";
import { ROUTES } from "@/shared/routing";
import { CardContent } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";

import { getProfileCopy } from "../profile.constants";

interface ProfileIntroCardProps {
  profile: ProfileResponse;
  locale?: AppLocale;
}

const SHORTCUT_ICON_CLASS: Record<string, string> = {
  marketplace: "text-secondary-700",
  greenProfile: "text-primary",
};

export function ProfileIntroCard({ profile, locale = getClientLocale() }: ProfileIntroCardProps) {
  const { screen: copy, view: viewCopy } = getProfileCopy(locale);
  const { can } = useUser();

  const bio = profile.bio?.trim() || viewCopy.noBio;
  const locationSegments = [profile.ward, profile.district, profile.province].filter(
    Boolean,
  ) as string[];
  const location = locationSegments.join(", ");
  const website = profile.website?.trim();

  const shortcuts = [
    {
      key: "marketplace",
      href: ROUTES.marketplace,
      label: copy.shortcutMarketplace,
      icon: ShoppingBag,
    },
    ...(can("log_create")
      ? [
          {
            key: "greenProfile",
            href: ROUTES.greenProfile,
            label: copy.shortcutGreenProfile,
            icon: Leaf,
          },
        ]
      : []),
  ];

  return (
    <ElevatedCard className="text-sm" aria-label={copy.introTitle}>
      <CardContent className="space-y-5 p-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">{copy.introTitle}</h2>
          <ul className="mt-3 space-y-2.5">
            <IntroRow icon={User} label={bio} muted={!profile.bio?.trim()} />
            <IntroRow icon={MapPin} label={location || viewCopy.noLocation} muted={!location} />
            {website ? (
              <IntroRow
                icon={Globe}
                label={
                  <a
                    href={website.startsWith("http") ? website : `https://${website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all font-medium text-primary hover:underline"
                  >
                    {website}
                  </a>
                }
              />
            ) : null}
          </ul>
        </div>

        {shortcuts.length > 0 && (
          <>
            <div className="border-t border-border/60" />
            <div>
              <h2 className="text-sm font-semibold text-foreground">{copy.vgxTitle}</h2>
              <ul className="mt-2 space-y-0.5">
                {shortcuts.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-2 rounded-lg py-2 text-foreground/90 transition-colors hover:bg-muted/60 hover:text-primary"
                      >
                        <Icon
                          className={cn(
                            "size-4 shrink-0",
                            SHORTCUT_ICON_CLASS[item.key] ?? "text-muted-foreground",
                          )}
                          aria-hidden
                        />
                        <span className="min-w-0 flex-1 font-medium">{item.label}</span>
                        <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/60" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </ElevatedCard>
  );
}

interface IntroRowProps {
  icon: typeof MapPin;
  label: React.ReactNode;
  muted?: boolean;
}

function IntroRow({ icon: Icon, label, muted }: IntroRowProps) {
  return (
    <li
      className={cn(
        "flex gap-2.5 leading-relaxed",
        muted ? "text-muted-foreground" : "text-foreground/90",
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0 text-primary/70" aria-hidden />
      <span className="min-w-0">{label}</span>
    </li>
  );
}
