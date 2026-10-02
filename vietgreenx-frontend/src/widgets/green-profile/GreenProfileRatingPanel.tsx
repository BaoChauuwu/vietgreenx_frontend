"use client";

import { Star } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { CardContent, CardHeader } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import type { GreenProfile } from "@/entities/green-profile";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import type { AppLocale } from "@/shared/i18n/locale";
import { getGreenProfileCopy } from "@/features/green-profile";

function StarRow({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const filled = Math.round(rating);
  const sz = size === "lg" ? "size-4" : "size-3.5";
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            sz,
            i <= filled ? "fill-orange-400 text-orange-400" : "fill-muted text-muted/40",
          )}
        />
      ))}
    </div>
  );
}

export function GreenProfileRatingPanel({
  profile,
  locale = getClientLocale(),
}: {
  profile?: GreenProfile;
  locale?: AppLocale;
}) {
  const copy = getGreenProfileCopy(locale).hub.view.rating;
  const total = profile?.reviewCount ?? 0;
  const rating = profile?.rating ?? 0;
  const ratings = [
    { stars: 5, color: "bg-orange-500" },
    { stars: 4, color: "bg-orange-400" },
    { stars: 3, color: "bg-muted-foreground/30" },
    { stars: 2, color: "bg-muted-foreground/30" },
    { stars: 1, color: "bg-muted-foreground/30" },
  ];

  return (
    <ElevatedCard className="flex flex-col rounded-2xl border-none shadow-sm">
      <CardHeader className="px-5 pb-3 pt-5 text-center">
        <h3 className="text-base font-bold text-foreground">{copy.title}</h3>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col px-5 pb-5">
        <div className="flex flex-col items-center gap-1">
          <p className="text-6xl font-black tracking-tight text-foreground">{rating.toFixed(1)}</p>
          <div className="mb-0.5 mt-1">
            <StarRow rating={rating} size="lg" />
          </div>
          <p className="text-xs font-medium text-muted-foreground">{copy.count(total)}</p>

          <div className="mt-5 w-full space-y-2">
            {ratings.map((r) => (
              <div key={r.stars} className="flex items-center gap-3">
                <div className="flex w-[68px] shrink-0 items-center justify-end gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "size-3",
                        i < r.stars
                          ? "fill-orange-400 text-orange-400"
                          : "fill-muted/30 text-muted/30",
                      )}
                    />
                  ))}
                </div>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted/50">
                  <div className={cn("h-full rounded-full", r.color)} style={{ width: "0%" }} />
                </div>
                <span className="w-5 shrink-0 text-right text-xs font-medium text-muted-foreground">
                  0
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </ElevatedCard>
  );
}
