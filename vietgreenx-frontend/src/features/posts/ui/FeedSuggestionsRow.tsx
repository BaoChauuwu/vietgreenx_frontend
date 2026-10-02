"use client";

import Link from "next/link";
import { UserPlus } from "lucide-react";

import { canAccessNavRoute, useUser } from "@/shared/auth";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { cn } from "@/shared/lib/cn";
import { VGX_ELEVATED_SURFACE } from "@/shared/ui/page-layout";
import { toastService } from "@/shared/lib/toast";

import { getPostsCopy } from "../posts.constants";

const SUGGESTION_GRADIENTS = [
  "from-emerald-500 to-emerald-400",
  "from-sky-500 to-sky-400",
  "from-amber-500 to-amber-400",
  "from-primary to-primary/80",
] as const;

interface FeedSuggestionsRowProps {
  locale?: AppLocale;
}

export function FeedSuggestionsRow({ locale = getClientLocale() }: FeedSuggestionsRowProps) {
  const copy = getPostsCopy(locale).suggestions;
  const { role } = useUser();

  const items = copy.items.filter((item) => canAccessNavRoute(role, item.href));

  if (items.length === 0) return null;

  const showComingSoon = () => toastService.info(copy.comingSoon);

  return (
    <section aria-labelledby="feed-suggestions" className={cn(VGX_ELEVATED_SURFACE, "py-3")}>
      <div className="mb-4 flex items-center justify-between px-4">
        <h2
          id="feed-suggestions"
          className="text-[17px] font-semibold tracking-tight text-foreground"
        >
          {copy.title}
        </h2>
        <Link href={copy.seeAllHref} className="text-sm font-medium text-primary hover:underline">
          {copy.seeAll}
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item, index) => (
          <article
            key={item.id}
            className="w-[11rem] shrink-0 overflow-hidden rounded-2xl border border-primary/10 bg-card shadow-sm transition-transform hover:-translate-y-0.5"
          >
            <div
              className={cn(
                "relative h-[4.5rem] w-full bg-gradient-to-br",
                SUGGESTION_GRADIENTS[index % SUGGESTION_GRADIENTS.length],
              )}
            >
              {/* Overlapping Badge for Emoji */}
              <div className="absolute -bottom-5 left-1/2 flex size-11 -translate-x-1/2 items-center justify-center rounded-full border-4 border-card bg-background shadow-sm">
                <span className="text-lg" aria-hidden>
                  {item.emoji}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2.5 px-3 pb-3 pt-6 text-center">
              <div>
                <p className="line-clamp-1 text-sm font-bold text-foreground">{item.name}</p>
                <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                  {item.subtitle}
                </p>
              </div>
              <button
                type="button"
                className="flex h-7 w-full items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
                onClick={showComingSoon}
              >
                <UserPlus className="mr-1.5 size-3.5" aria-hidden />
                {item.action}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
