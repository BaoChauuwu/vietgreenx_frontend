"use client";

import { Plus, User } from "lucide-react";

import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { cn } from "@/shared/lib/cn";
import { toastService } from "@/shared/lib/toast";

import { resolveMediaUrl } from "@/shared/lib/resolve-media-url";
import { getPostsCopy } from "../posts.constants";

const STORY_GRADIENTS = [
  "from-primary to-primary/80",
  "from-emerald-500 to-emerald-400",
  "from-amber-500 to-amber-400",
  "from-sky-500 to-sky-400",
  "from-teal-500 to-teal-400",
] as const;

interface FeedStoriesRowProps {
  locale?: AppLocale;
  avatarUrl?: string | null;
}

export function FeedStoriesRow({ locale = getClientLocale(), avatarUrl }: FeedStoriesRowProps) {
  const copy = getPostsCopy(locale).stories;

  const showComingSoon = () => toastService.info(copy.comingSoon);

  return (
    <section aria-label={copy.ariaLabel} className="w-full">
      <div className="flex gap-2.5 overflow-x-auto py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* Create Story Card */}
        <button
          type="button"
          onClick={showComingSoon}
          className="group relative flex h-44 w-28 shrink-0 flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-transform hover:scale-[1.02] active:scale-95"
        >
          {/* Top half: Cover Image (or solid/gradient color) */}
          <div className="relative h-[65%] w-full overflow-hidden bg-muted">
            {avatarUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={resolveMediaUrl(avatarUrl) ?? avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center bg-primary/5">
                <User className="size-8 text-primary/40" />
              </div>
            )}
            {/* Dark overlay just to make the bottom transition smooth if needed */}
            <div className="absolute inset-0 bg-black/5" />
          </div>

          {/* Bottom half: Text */}
          <div className="relative flex h-[35%] flex-col items-center justify-end pb-3">
            <span className="text-[11px] font-semibold text-foreground">{copy.create}</span>
          </div>

          {/* Plus Icon overlapping the border */}
          <div className="absolute left-1/2 top-[65%] flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-card bg-primary text-primary-foreground transition-colors group-hover:bg-primary/90">
            <Plus className="size-5" strokeWidth={3} />
          </div>
        </button>

        {/* Other Stories */}
        {copy.placeholders.map((label, index) => (
          <button
            key={label}
            type="button"
            onClick={showComingSoon}
            className="group relative flex h-44 w-28 shrink-0 flex-col overflow-hidden rounded-2xl border border-border/60 shadow-sm transition-transform hover:scale-[1.02] active:scale-95"
          >
            {/* Background Gradient */}
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br",
                STORY_GRADIENTS[index % STORY_GRADIENTS.length],
              )}
            />

            {/* Bottom shadow overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-80" />

            {/* Avatar overlay at top left */}
            <div className="absolute left-2.5 top-2.5 flex size-9 items-center justify-center rounded-full border-2 border-primary bg-background shadow-sm">
              <User className="size-4 text-muted-foreground" />
            </div>

            {/* Title at bottom */}
            <div className="absolute bottom-3 left-2 right-2 text-left">
              <span className="line-clamp-2 text-[11px] font-medium leading-tight text-white drop-shadow-md">
                {label}
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
