"use client";

import { Loader2 } from "lucide-react";

import { GreenProfileFormShell, getGreenProfileCopy, useGreenProfileCreateGuard } from "@/features/green-profile";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { CardContent } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import { ModulePageShell } from "@/shared/ui/module-page-shell";
import { GreenProfileCreateRail } from "./GreenProfileRails";

interface GreenProfileCreateScreenProps {
  locale?: AppLocale;
}

export function GreenProfileCreateScreen({ locale = getClientLocale() }: GreenProfileCreateScreenProps) {
  const copy = getGreenProfileCopy(locale).hub;
  const { isPending, isError, canCreate } = useGreenProfileCreateGuard();

  return (
    <ModulePageShell
      width="hub"
      rightRail={
        <GreenProfileCreateRail locale={locale} />
      }
    >
      {isError ? (
        <ElevatedCard className="border border-dashed border-border">
          <CardContent className="py-12 text-center text-sm text-muted-foreground">{copy.loadError}</CardContent>
        </ElevatedCard>
      ) : isPending ? (
        <ElevatedCard>
          <CardContent className="flex items-center justify-center gap-2 py-14 text-sm text-muted-foreground">
            <Loader2 className="size-5 animate-spin" aria-hidden />
            {copy.loading}
          </CardContent>
        </ElevatedCard>
      ) : canCreate ? (
        <GreenProfileFormShell mode="create" locale={locale} />
      ) : null}
    </ModulePageShell>
  );
}
