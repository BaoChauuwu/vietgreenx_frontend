"use client";

import { useSearchParams } from "next/navigation";
import type { ComponentType } from "react";
import type { SearchType } from "@/features/search";
import type { FeedPostCardProps } from "@/features/posts";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { ModulePageShell } from "@/shared/ui/module-page-shell";

import { SearchSidebarFilter } from "./SearchSidebarFilter";
import { SearchOverviewFeed } from "./SearchOverviewFeed";
import { SearchFilteredFeed } from "./SearchFilteredFeed";
import { SearchExploreRail } from "./SearchRails";

interface SearchScreenProps {
  locale?: AppLocale;
  PostCardComponent?: ComponentType<FeedPostCardProps>;
}

export function SearchScreen({ locale = getClientLocale(), PostCardComponent }: SearchScreenProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const activeType = (searchParams.get("type") as SearchType) || undefined;

  return (
    <ModulePageShell rightRail={<SearchExploreRail locale={locale} />}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[280px_1fr]">
        <SearchSidebarFilter query={query} activeType={activeType} locale={locale} />
        <div className="space-y-6">
          {!activeType ? (
            <SearchOverviewFeed
              query={query}
              locale={locale}
              PostCardComponent={PostCardComponent}
            />
          ) : (
            <SearchFilteredFeed
              query={query}
              type={activeType}
              locale={locale}
              PostCardComponent={PostCardComponent}
            />
          )}
        </div>
      </div>
    </ModulePageShell>
  );
}
