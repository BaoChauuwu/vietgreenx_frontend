"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { CardContent, CardHeader } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import type { GreenProfile } from "@/entities/green-profile";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import type { AppLocale } from "@/shared/i18n/locale";
import { getGreenProfileCopy } from "@/features/green-profile";
import { resolveMediaUrl } from "@/shared/lib/resolve-media-url";
import { cn } from "@/shared/lib/cn";

export function GreenProfileVideoPanel({
  profile,
  locale = getClientLocale(),
}: {
  profile?: GreenProfile;
  locale?: AppLocale;
}) {
  const copy = getGreenProfileCopy(locale).hub.view.videos;
  const videos = profile?.videoMedias ?? [];
  const [activeIdx, setActiveIdx] = useState(0);

  if (videos.length === 0) {
    return (
      <ElevatedCard className="flex flex-col rounded-2xl border-none shadow-sm">
        <CardHeader className="flex-row items-center justify-between px-5 pb-3 pt-5">
          <h3 className="text-base font-bold text-foreground">{copy.title}</h3>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col items-center justify-center px-5 py-10 pb-5 text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-2 size-10 opacity-20"
          >
            <path d="m22 8-6 4 6 4V8Z" />
            <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
          </svg>
          <p className="text-sm">{copy.empty}</p>
        </CardContent>
      </ElevatedCard>
    );
  }

  const activeVideo = videos[activeIdx] ?? videos[0];
  if (!activeVideo) return null;

  return (
    <ElevatedCard className="flex flex-col rounded-2xl border-none shadow-sm">
      <CardHeader className="flex-row items-center justify-between px-5 pb-3 pt-5">
        <h3 className="text-base font-bold text-foreground">{copy.title}</h3>
        <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-semibold text-orange-600">
          {copy.count(videos.length)}
        </span>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between px-5 pb-5">
        <div className="space-y-3">
          {/* Main player */}
          <div className="relative overflow-hidden rounded-xl bg-black">
            <video
              key={activeVideo.id}
              src={resolveMediaUrl(activeVideo.cdnUrl) ?? activeVideo.cdnUrl}
              controls
              preload="metadata"
              className="aspect-video w-full object-contain"
            />
          </div>

          {/* Playlist selector if more than 1 video */}
          {videos.length > 1 && (
            <div className="scrollbar-none flex items-center gap-2 overflow-x-auto pb-1">
              {videos.map((video, index) => {
                const isActive = index === activeIdx;
                return (
                  <button
                    key={video.id}
                    type="button"
                    onClick={() => setActiveIdx(index)}
                    className={cn(
                      "flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all",
                      isActive
                        ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                        : "border-border bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Play
                      className={cn(
                        "size-3 fill-current",
                        isActive ? "text-orange-500" : "text-muted-foreground",
                      )}
                    />
                    <span>Video {index + 1}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </ElevatedCard>
  );
}
