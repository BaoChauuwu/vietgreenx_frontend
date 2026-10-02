"use client";

import Link from "next/link";
import { ChevronRight, Leaf } from "lucide-react";

import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { ROUTES } from "@/shared/routing";

import { getGreenProfileCopy } from "../green-profile.constants";
import { GreenProfileSubNav } from "./GreenProfileSubNav";

interface GreenProfileContextHeaderProps {
  greenProfileId: string;
  profileName: string;
  locale?: AppLocale;
}

export function GreenProfileContextHeader({
  greenProfileId,
  profileName,
  locale = getClientLocale(),
}: GreenProfileContextHeaderProps) {
  const copy = getGreenProfileCopy(locale).nav;

  return (
    <header className="space-y-4">
      <nav className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <Link href={ROUTES.greenProfile} className="hover:text-primary">
          {copy.breadcrumb}
        </Link>
        <ChevronRight className="size-3.5 shrink-0" aria-hidden />
        <span className="flex items-center gap-1.5 font-medium text-foreground">
          <Leaf className="size-4 text-primary" aria-hidden />
          {profileName}
        </span>
      </nav>

      <GreenProfileSubNav greenProfileId={greenProfileId} locale={locale} />
    </header>
  );
}
