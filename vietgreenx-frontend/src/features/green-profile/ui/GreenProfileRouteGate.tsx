"use client";

import { Loader2 } from "lucide-react";

import type { GreenProfile } from "@/entities/green-profile";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { CardContent } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";

import { getGreenProfileCopy } from "../green-profile.constants";
import {
  useGreenProfileRouteGuard,
  type GreenProfileRouteSegment,
} from "../lib/use-green-profile-route-guard";

interface GreenProfileRouteGateProps {
  profileId: string;
  segment: GreenProfileRouteSegment;
  locale?: AppLocale;
  children: (profile: GreenProfile) => React.ReactNode;
}

export function GreenProfileRouteGate({
  profileId,
  segment,
  locale = getClientLocale(),
  children,
}: GreenProfileRouteGateProps) {
  const copy = getGreenProfileCopy(locale).hub;
  const { profile, isPending, isError } = useGreenProfileRouteGuard(profileId, segment);

  if (isError) {
    return (
      <ElevatedCard className="border border-dashed border-border">
        <CardContent className="py-12 text-center text-sm text-muted-foreground">{copy.loadError}</CardContent>
      </ElevatedCard>
    );
  }

  if (isPending || !profile) {
    return (
      <ElevatedCard>
        <CardContent className="flex items-center justify-center gap-2 py-14 text-sm text-muted-foreground">
          <Loader2 className="size-5 animate-spin" aria-hidden />
          {copy.loading}
        </CardContent>
      </ElevatedCard>
    );
  }

  return <>{children(profile)}</>;
}
