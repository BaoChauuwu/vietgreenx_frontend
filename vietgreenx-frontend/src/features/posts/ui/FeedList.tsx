"use client";

import { Loader2, Sprout } from "lucide-react";
import { Fragment, useState, useEffect, useMemo, type ComponentType } from "react";

import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { Button } from "@/shared/ui/button";
import { CardContent } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";

import { usePostsFeed, useMyPosts } from "../api/post.queries";
import type { FeedCategory, FeedMode } from "../api/feed.service";
import type { FeedSource } from "../api/post.queries";
import { getPostsCopy } from "../posts.constants";
import { useInfiniteScrollSentinel } from "../lib/use-infinite-scroll-sentinel";
import { FeedPostSkeleton } from "./FeedPostSkeleton";
import { PostCard, type FeedPostCardProps, type PostBlockAuthorInput } from "./PostCard";
import { FeedSuggestionsRow } from "./FeedSuggestionsRow";

interface FeedListProps {
  locale?: AppLocale;
  source?: FeedSource;
  mode?: FeedMode;
  category?: FeedCategory;
  showSuggestions?: boolean;
  PostCardComponent?: ComponentType<FeedPostCardProps>;
  onBlockAuthor?: (author: PostBlockAuthorInput) => void;
}

function openComposer() {
  document.getElementById("feed-composer")?.scrollIntoView({ behavior: "smooth", block: "center" });
  window.dispatchEvent(new CustomEvent("feed:open-composer"));
}

export function FeedList({
  locale = getClientLocale(),
  source = "discovery",
  mode = "discovery",
  category,
  showSuggestions,
  PostCardComponent = PostCard,
  onBlockAuthor,
}: FeedListProps) {
  const copy = getPostsCopy(locale).feed;
  const feedQuery = usePostsFeed(mode, category);
  const mineQuery = useMyPosts();
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    source === "mine" ? mineQuery : feedQuery;

  const [suggestionAnchorId, setSuggestionAnchorId] = useState<string | null>(null);
  const shouldShowSuggestions = showSuggestions ?? source !== "mine";

  const canLoadMore = Boolean(hasNextPage) && !isFetchingNextPage;
  const sentinelRef = useInfiniteScrollSentinel({
    enabled: canLoadMore,
    onLoadMore: () => void fetchNextPage(),
  });

  const posts = useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data]);

  useEffect(() => {
    if (posts.length > 0 && !suggestionAnchorId) {
      setSuggestionAnchorId(posts[0]?.id ?? null);
    }
  }, [posts, suggestionAnchorId]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <FeedPostSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <ElevatedCard>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          {copy.loadError}
        </CardContent>
      </ElevatedCard>
    );
  }

  if (posts.length === 0) {
    return (
      <ElevatedCard>
        <CardContent className="flex min-h-[min(320px,50vh)] flex-col items-center justify-center px-6 py-12 text-center">
          <Sprout className="size-12 text-primary/70" aria-hidden />
          <p className="mt-4 text-base font-semibold tracking-tight">{copy.emptyTitle}</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            {copy.emptyDescription}
          </p>
          <Button type="button" className="mt-6 px-6" onClick={openComposer}>
            {copy.emptyAction}
          </Button>
        </CardContent>
      </ElevatedCard>
    );
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <Fragment key={post.id}>
          <PostCardComponent post={post} locale={locale} onBlockAuthor={onBlockAuthor} />
          {shouldShowSuggestions && post.id === suggestionAnchorId && (
            <FeedSuggestionsRow locale={locale} />
          )}
        </Fragment>
      ))}

      <div ref={sentinelRef} className="h-1" aria-hidden />

      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
