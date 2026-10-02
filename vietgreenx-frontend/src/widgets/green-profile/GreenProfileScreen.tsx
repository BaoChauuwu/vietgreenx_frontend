"use client";

import { Loader2 } from "lucide-react";

import {
  GreenProfileList,
  getGreenProfileCopy,
  useActiveGreenProfile,
} from "@/features/green-profile";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { CardContent } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import { ModulePageShell } from "@/shared/ui/module-page-shell";

import { GreenProfileHubView } from "./GreenProfileHubView";

interface GreenProfileScreenProps {
  locale?: AppLocale;
}

export function GreenProfileScreen({ locale = getClientLocale() }: GreenProfileScreenProps) {
  const allCopy = getGreenProfileCopy(locale);
  const copy = allCopy.hub;
  const { data: profile, isLoading, isError, error } = useActiveGreenProfile();
  if (isError && error) {
    console.error("[GreenProfileScreen load error]:", error);
  }

  return (
    <ModulePageShell width="hub">
      {isLoading ? (
        <ElevatedCard>
          <CardContent className="flex items-center justify-center gap-2 py-14 text-sm text-muted-foreground">
            <Loader2 className="size-5 animate-spin" aria-hidden />
            {copy.loading}
          </CardContent>
        </ElevatedCard>
      ) : isError ? (
        <ElevatedCard className="border border-dashed border-border">
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            {copy.loadError}
          </CardContent>
        </ElevatedCard>
      ) : profile ? (
        <GreenProfileHubView profile={profile!} />
      ) : (
        <GreenProfileList locale={locale} />
      )}
    </ModulePageShell>
  );
}
