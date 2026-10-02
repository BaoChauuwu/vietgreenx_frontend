"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { CardContent, CardHeader } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";

import type { GreenProfile } from "@/entities/green-profile";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import type { AppLocale } from "@/shared/i18n/locale";
import { getGreenProfileCopy } from "@/features/green-profile";
import { Image as ImageIcon } from "lucide-react";

export function GreenProfilePhotosPanel({
  profile,
  locale = getClientLocale(),
}: {
  profile?: GreenProfile;
  locale?: AppLocale;
}) {
  const copy = getGreenProfileCopy(locale).hub.view.photos;
  const photos = profile?.photoMedias ?? [];

  if (photos.length === 0) {
    return (
      <ElevatedCard className="flex flex-col rounded-2xl border-none shadow-sm">
        <CardHeader className="flex-row items-center justify-between px-5 pb-3 pt-5">
          <h3 className="text-base font-bold text-foreground">{copy.title}</h3>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col items-center justify-center px-5 py-10 pb-5 text-muted-foreground">
          <ImageIcon className="mb-2 size-10 opacity-20" />
          <p className="text-sm">{copy.empty}</p>
        </CardContent>
      </ElevatedCard>
    );
  }

  // Display up to 5 photos for the grid layout
  const displayPhotos = photos.slice(0, 5);

  return (
    <ElevatedCard className="flex flex-col rounded-2xl border-none shadow-sm">
      <CardHeader className="flex-row items-center justify-between px-5 pb-3 pt-5">
        <h3 className="text-base font-bold text-foreground">{copy.title}</h3>
        {photos.length > 5 && (
          <Link
            href="#"
            className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:underline"
          >
            {copy.viewAll}
            <ChevronRight className="size-3.5" />
          </Link>
        )}
      </CardHeader>
      <CardContent className="flex-1 px-5 pb-5">
        <div className="grid grid-cols-6 gap-2">
          {displayPhotos.map((photo, i) => (
            <div
              key={photo.id}
              className={cn(
                "rounded-lg bg-cover bg-center",
                // First 3 photos take 2 columns each (3 per row), next 2 take 3 columns each (2 per row)
                i < 3 ? "col-span-2 aspect-[4/3]" : "col-span-3 aspect-[4/3]",
              )}
              style={{ backgroundImage: `url(${photo.cdnUrl})` }}
            />
          ))}
        </div>
      </CardContent>
    </ElevatedCard>
  );
}
