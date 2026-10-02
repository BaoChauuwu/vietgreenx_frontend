"use client";

import { Leaf, Plus } from "lucide-react";
import Link from "next/link";

import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { ROUTES } from "@/shared/routing";
import { Button } from "@/shared/ui/button";
import { CardContent } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";

import { getGreenProfileCopy } from "../green-profile.constants";

interface GreenProfileListProps {
  locale?: AppLocale;
}

export function GreenProfileList({ locale = getClientLocale() }: GreenProfileListProps) {
  const copy = getGreenProfileCopy(locale).hub;

  return (
    <ElevatedCard>
      <CardContent className="flex flex-col items-center gap-4 px-6 py-14 text-center">
        <span className="flex size-16 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Leaf className="size-8" />
        </span>
        <div className="max-w-md space-y-2">
          <p className="text-lg font-semibold tracking-tight">{copy.emptyTitle}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">{copy.emptyDescription}</p>
        </div>
        <Button asChild className="mt-2 gap-1.5">
          <Link href={ROUTES.greenProfileCreate}>
            <Plus className="size-4" />
            {copy.createCta}
          </Link>
        </Button>
      </CardContent>
    </ElevatedCard>
  );
}
