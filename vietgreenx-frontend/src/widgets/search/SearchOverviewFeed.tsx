"use client";

import Link from "next/link";
import type { ComponentType } from "react";
import { ArrowRight, FileText, Package, SearchX, UserCheck, Users } from "lucide-react";
import { getSearchCopy, useGlobalSearchOverview, type SearchType } from "@/features/search";
import { PostCard, type FeedPostCardProps } from "@/features/posts";
import { SearchProductCard } from "./SearchProductCard";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { resolveMediaUrl } from "@/shared/lib/resolve-media-url";
import { getInitials } from "@/entities/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";

interface SearchOverviewFeedProps {
  query: string;
  locale?: AppLocale;
  PostCardComponent?: ComponentType<FeedPostCardProps>;
}

export function SearchOverviewFeed({
  query,
  locale = getClientLocale(),
  PostCardComponent = PostCard,
}: SearchOverviewFeedProps) {
  const copy = getSearchCopy(locale);
  const { data: overview, isLoading, isError } = useGlobalSearchOverview(query);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-44 rounded-2xl bg-muted/60" />
        <div className="h-60 rounded-2xl bg-muted/60" />
        <div className="h-60 rounded-2xl bg-muted/60" />
      </div>
    );
  }

  if (isError || !overview) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-card p-12 text-center shadow-sm">
        <div className="flex flex-col items-center justify-center gap-3">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <SearchX className="size-7" />
          </span>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">{copy.empty.errorTitle}</h3>
            <p className="text-xs text-muted-foreground">{copy.empty.errorDescription}</p>
          </div>
        </div>
      </div>
    );
  }

  const users = overview.users?.items ?? [];
  const posts = overview.posts?.items ?? [];
  const products = overview.products?.items ?? [];

  const hasAnyResult = users.length > 0 || posts.length > 0 || products.length > 0;

  if (!hasAnyResult) {
    return (
      <div className="rounded-2xl border border-border/50 bg-card p-12 text-center shadow-sm">
        <div className="flex flex-col items-center justify-center gap-3">
          <span className="flex size-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <SearchX className="size-8" />
          </span>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground">{copy.empty.noResultsTitle}</h3>
            <p className="text-xs text-muted-foreground">{copy.empty.noResultsQuery(query)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Users / Sellers Section */}
      {users.length > 0 && (
        <section className="overflow-hidden rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b border-border/40 pb-3.5">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 font-bold text-amber-600 dark:text-amber-400">
                <Users className="size-4.5" />
              </span>
              <div>
                <h3 className="text-base font-bold tracking-tight text-foreground">
                  {copy.sections.usersTitle}
                </h3>
                <p className="text-[11px] text-muted-foreground">{copy.sections.usersSubtitle}</p>
              </div>
            </div>

            {overview.users.hasNext && (
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-8 gap-1 rounded-lg px-3 text-xs font-bold text-primary hover:bg-primary/10 hover:text-primary"
              >
                <Link href={`/search?q=${encodeURIComponent(query)}&type=users`}>
                  {copy.actions.seeAll} <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {users.slice(0, 4).map((user) => {
              const avatarSrc = resolveMediaUrl(user.avatarUrl) ?? undefined;
              const name = user.displayName || user.username;
              const href = `/${user.username}`;

              return (
                <div
                  key={user.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border/40 bg-muted/20 p-3 transition-all hover:border-primary/30 hover:bg-muted/50"
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
        </section>
      )}

      {/* Posts Section */}
      {posts.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 font-bold text-blue-600 dark:text-blue-400">
                <FileText className="size-4.5" />
              </span>
              <div>
                <h3 className="text-base font-bold tracking-tight text-foreground">
                  {copy.sections.postsTitle}
                </h3>
                <p className="text-[11px] text-muted-foreground">{copy.sections.postsSubtitle}</p>
              </div>
            </div>

            {overview.posts.hasNext && (
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-8 gap-1 rounded-lg px-3 text-xs font-bold text-primary hover:bg-primary/10 hover:text-primary"
              >
                <Link href={`/search?q=${encodeURIComponent(query)}&type=posts`}>
                  {copy.actions.seeMorePosts} <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {posts.slice(0, 5).map((post) => (
              <PostCardComponent key={post.id} post={post} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {/* Products Section */}
      {products.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-purple-500/10 font-bold text-purple-600 dark:text-purple-400">
                <Package className="size-4.5" />
              </span>
              <div>
                <h3 className="text-base font-bold tracking-tight text-foreground">
                  {copy.sections.productsTitle}
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  {copy.sections.productsSubtitle}
                </p>
              </div>
            </div>

            {overview.products.hasNext && (
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-8 gap-1 rounded-lg px-3 text-xs font-bold text-primary hover:bg-primary/10 hover:text-primary"
              >
                <Link href={`/search?q=${encodeURIComponent(query)}&type=products`}>
                  {copy.actions.seeMoreProducts} <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            )}
          </div>

          <div className="space-y-3.5">
            {products.slice(0, 6).map((product) => (
              <SearchProductCard key={product.id} product={product} locale={locale} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
