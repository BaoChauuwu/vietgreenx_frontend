"use client";

/* eslint-disable @next/next/no-img-element */
import { ElevatedCard } from "@/shared/ui/elevated-card";
import { CardContent, CardHeader } from "@/shared/ui/card";
import { resolveMediaUrl } from "@/shared/lib/resolve-media-url";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { getTraceCopy } from "@/features/traceability";

interface Props {
  photos: string[];
  locale?: AppLocale;
}

export function TracePhotosPanel({ photos, locale = getClientLocale() }: Props) {
  const copy = getTraceCopy(locale).preview.photos;
  if (!photos || photos.length === 0) return null;

  const displayPhotos = photos.map((url) => {
    if (!url)
      return "https://images.unsplash.com/photo-1573246123716-6b1782bfc492?q=80&w=400&auto=format&fit=crop";
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")) return url;
    return (
      resolveMediaUrl(url) ||
      "https://images.unsplash.com/photo-1573246123716-6b1782bfc492?q=80&w=400&auto=format&fit=crop"
    );
  });

  return (
    <ElevatedCard className="mt-6 overflow-hidden rounded-2xl border-none bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between px-5 pb-3 pt-5">
        <h3 className="text-base font-bold text-slate-800">{copy.title}</h3>
        <button className="text-[13px] font-semibold text-emerald-600 hover:text-emerald-700">
          {copy.viewAll}
        </button>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="flex snap-x gap-3 overflow-x-auto pb-2">
          {displayPhotos.slice(0, 5).map((url, i) => (
            <div
              key={i}
              className="relative h-28 w-40 shrink-0 snap-start overflow-hidden rounded-xl bg-slate-100"
            >
              <img
                src={url}
                alt={copy.imgAlt(i + 1)}
                className="absolute inset-0 h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1573246123716-6b1782bfc492?q=80&w=400&auto=format&fit=crop";
                }}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </ElevatedCard>
  );
}
