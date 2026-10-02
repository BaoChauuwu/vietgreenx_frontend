"use client";

import { Loader2, SearchX } from "lucide-react";
import { Fragment, useMemo, type ComponentType } from "react";

import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { CardContent } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";

import { useFeedSearch } from "../api/post.queries";
import { getPostsCopy } from "../posts.constants";
import { useInfiniteScrollSentinel } from "../lib/use-infinite-scroll-sentinel";
import { FeedPostSkeleton } from "./FeedPostSkeleton";
import { PostCard, type FeedPostCardProps, type PostBlockAuthorInput } from "./PostCard";

interface FeedSearchListProps {
  query: string;
  locale?: AppLocale;
  PostCardComponent?: ComponentType<FeedPostCardProps>;
  onBlockAuthor?: (author: PostBlockAuthorInput) => void;
}

export function FeedSearchList({
  query,
  locale = getClientLocale(),
  PostCardComponent = PostCard,
  onBlockAuthor,
}: FeedSearchListProps) {
  const copy = getPostsCopy(locale).feed;
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFeedSearch(query);

  const canLoadMore = Boolean(hasNextPage) && !isFetchingNextPage;
  const sentinelRef = useInfiniteScrollSentinel({
    enabled: canLoadMore,
    onLoadMore: () => void fetchNextPage(),
  });

  const posts = useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data]);

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
          {copy.searchError}
        </CardContent>
      </ElevatedCard>
    );
  }

  if (posts.length === 0) {
    return (
      <ElevatedCard>
        <CardContent className="flex min-h-[min(240px,40vh)] flex-col items-center justify-center px-6 py-12 text-center">
          <SearchX className="size-10 text-muted-foreground/60" aria-hidden />
          <p className="mt-4 text-sm text-muted-foreground">{copy.searchEmpty}</p>
        </CardContent>
      </ElevatedCard>
    );
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <Fragment key={post.id}>
          <PostCardComponent post={post} locale={locale} onBlockAuthor={onBlockAuthor} />
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
