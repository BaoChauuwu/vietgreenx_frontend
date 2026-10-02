"use client";

import Link from "next/link";
import type { ComponentType } from "react";
import { AlertCircle, CheckCircle2, Loader2, SearchX, UserCheck } from "lucide-react";
import {
  getSearchCopy,
  useSearchPostsInfinite,
  useSearchProductsInfinite,
  useSearchUsersInfinite,
  type SearchType,
} from "@/features/search";
import { PostCard, type FeedPostCardProps } from "@/features/posts";
import { SearchProductCard } from "./SearchProductCard";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { resolveMediaUrl } from "@/shared/lib/resolve-media-url";
import { getInitials } from "@/entities/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";

interface SearchFilteredFeedProps {
  query: string;
  type: SearchType;
  locale?: AppLocale;
  PostCardComponent?: ComponentType<FeedPostCardProps>;
}

export function SearchFilteredFeed({
  query,
  type,
  locale = getClientLocale(),
  PostCardComponent = PostCard,
}: SearchFilteredFeedProps) {
  if (type === "posts") {
    return <SearchPostsList query={query} locale={locale} PostCardComponent={PostCardComponent} />;
  }
  if (type === "users") {
    return <SearchUsersList query={query} locale={locale} />;
  }
  return <SearchProductsList query={query} locale={locale} />;
}

function SearchPostsList({
  query,
  locale = getClientLocale(),
  PostCardComponent = PostCard,
}: {
  query: string;
  locale?: AppLocale;
  PostCardComponent?: ComponentType<FeedPostCardProps>;
}) {
  const copy = getSearchCopy(locale);
  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useSearchPostsInfinite(query);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-44 rounded-2xl bg-muted/60" />
        <div className="h-44 rounded-2xl bg-muted/60" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-card p-12 text-center shadow-sm">
        <div className="flex flex-col items-center justify-center gap-3">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertCircle className="size-7" />
          </span>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">{copy.empty.errorTitle}</h3>
            <p className="text-xs text-muted-foreground">{copy.empty.errorDescription}</p>
          </div>
        </div>
      </div>
    );
  }

  const items = data?.pages.flatMap((page) => page.items) ?? [];

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-border/50 bg-card p-12 text-center shadow-sm">
        <div className="flex flex-col items-center justify-center gap-3">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <SearchX className="size-7" />
          </span>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">{copy.empty.noResultsTitle}</h3>
            <p className="text-xs text-muted-foreground">{copy.empty.noPosts(query)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((post) => (
        <PostCardComponent key={post.id} post={post} locale={locale} />
      ))}

      {hasNextPage && (
        <div className="pt-2 text-center">
          <Button
            variant="outline"
            onClick={() => void fetchNextPage()}
            disabled={isFetchingNextPage}
            className="shadow-xs gap-2 rounded-xl border-border/60"
          >
            {isFetchingNextPage && <Loader2 className="size-4 animate-spin text-primary" />}
            {copy.actions.loadMorePosts}
          </Button>
        </div>
      )}
    </div>
  );
}

function SearchUsersList({
  query,
  locale = getClientLocale(),
}: {
  query: string;
  locale?: AppLocale;
}) {
  const copy = getSearchCopy(locale);
  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useSearchUsersInfinite(query);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-20 rounded-2xl bg-muted/60" />
        <div className="h-20 rounded-2xl bg-muted/60" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-card p-12 text-center shadow-sm">
        <div className="flex flex-col items-center justify-center gap-3">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertCircle className="size-7" />
          </span>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">{copy.empty.errorTitle}</h3>
            <p className="text-xs text-muted-foreground">{copy.empty.errorDescription}</p>
          </div>
        </div>
      </div>
    );
  }

  const items = data?.pages.flatMap((page) => page.items) ?? [];

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-border/50 bg-card p-12 text-center shadow-sm">
        <div className="flex flex-col items-center justify-center gap-3">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <SearchX className="size-7" />
          </span>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">{copy.empty.noResultsTitle}</h3>
            <p className="text-xs text-muted-foreground">{copy.empty.noUsers(query)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((user) => {
          const avatarSrc = resolveMediaUrl(user.avatarUrl) ?? undefined;
          const name = user.displayName || user.username;
          const href = `/${user.username}`;

          return (
            <div
              key={user.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-border/40 bg-muted/20 p-3.5 transition-all hover:border-primary/30 hover:bg-muted/50"
            >
              <Link href={href} className="group flex min-w-0 flex-1 items-center gap-3">
                <Avatar className="size-11 shrink-0 border border-border/50">
                  <AvatarImage src={avatarSrc} alt={name} className="object-cover" />
                  <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                    {getInitials(name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="truncate text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                      {name}
                    </p>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">@{user.username}</p>
                </div>
              </Link>

              <Button
                asChild
                size="sm"
                variant="outline"
                className="h-8 shrink-0 gap-1 rounded-lg border-border/60 text-xs font-semibold transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Link href={href}>
                  <UserCheck className="size-3.5" /> {copy.actions.viewProfile}
                </Link>
              </Button>
            </div>
          );
        })}
      </div>

      {hasNextPage && (
        <div className="border-t border-border/40 pt-2 text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => void fetchNextPage()}
            disabled={isFetchingNextPage}
            className="gap-2 rounded-xl"
          >
            {isFetchingNextPage && <Loader2 className="size-4 animate-spin text-primary" />}
            {copy.actions.loadMoreUsers}
          </Button>
        </div>
      )}
    </div>
  );
}

function SearchProductsList({
  query,
  locale = getClientLocale(),
}: {
  query: string;
  locale?: AppLocale;
}) {
  const copy = getSearchCopy(locale);
  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useSearchProductsInfinite(query);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3.5">
        <div className="h-32 rounded-2xl bg-muted/60" />
        <div className="h-32 rounded-2xl bg-muted/60" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-card p-12 text-center shadow-sm">
        <div className="flex flex-col items-center justify-center gap-3">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertCircle className="size-7" />
          </span>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">{copy.empty.errorTitle}</h3>
            <p className="text-xs text-muted-foreground">{copy.empty.errorDescription}</p>
          </div>
        </div>
      </div>
    );
  }

  const items = data?.pages.flatMap((page) => page.items) ?? [];

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-border/50 bg-card p-12 text-center shadow-sm">
        <div className="flex flex-col items-center justify-center gap-3">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <SearchX className="size-7" />
          </span>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">{copy.empty.noResultsTitle}</h3>
            <p className="text-xs text-muted-foreground">{copy.empty.noProducts(query)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3.5">
        {items.map((product) => (
          <SearchProductCard key={product.id} product={product} locale={locale} />
        ))}
      </div>

      {hasNextPage && (
        <div className="pt-2 text-center">
          <Button
            variant="outline"
            onClick={() => void fetchNextPage()}
            disabled={isFetchingNextPage}
            className="shadow-xs gap-2 rounded-xl"
          >
            {isFetchingNextPage && <Loader2 className="size-4 animate-spin text-primary" />}
            {copy.actions.loadMoreProducts}
          </Button>
        </div>
      )}
    </div>
  );
}
