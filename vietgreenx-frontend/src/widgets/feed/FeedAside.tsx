"use client";

import Link from "next/link";
import { BadgeCheck, Plus, TrendingUp, UserCheck } from "lucide-react";

import { getInitials } from "@/entities/user";
import { getPostsCopy } from "@/features/posts";
import { useMyProfile } from "@/features/profile";
import { useUser, getRoleLabel } from "@/shared/auth";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { resolveMediaUrl } from "@/shared/lib/resolve-media-url";
import { ROUTES } from "@/shared/routing";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";

// PLACEHOLDER — replace with API call before production
const SUGGESTED_PRODUCTS = [
  { id: "1", name: "Xoài cát Hòa Lộc", seller: "HTX Xoài Hòa Lộc" },
  { id: "2", name: "Mật ong hoa cà phê", seller: "HTX Mật Ong Đắk Lắk" },
  { id: "3", name: "Gạo ST25 hữu cơ", seller: "HTX Lúa Gạo Hữu Cơ" },
];

// PLACEHOLDER — replace with API call before production
const SUGGESTED_SELLERS = [
  { id: "1", name: "HTX Xoài Hòa Lộc", location: "Đồng Tháp" },
  { id: "2", name: "HTX Mật Ong Đắk Lắk", location: "Đắk Lắk" },
];

// PLACEHOLDER — replace with API call before production
const TRENDING_TOPICS = [
  { id: "1", name: "Nông sản sạch", count: "1.245 bài viết", rank: 1 },
  { id: "2", name: "Sản phẩm OCOP", count: "987 bài viết", rank: 2 },
  { id: "3", name: "Tiêu dùng bền vững", count: "756 bài viết", rank: 3 },
];

interface FeedAsideProps {
  locale?: AppLocale;
  sticky?: boolean;
}

export function FeedAside({ locale = getClientLocale() }: FeedAsideProps) {
  const { feedAside: copy } = getPostsCopy(locale);
  const { user } = useUser();
  const { data: profile, isLoading: profileLoading } = useMyProfile();

  const displayName = profile?.displayName ?? user?.fullName ?? "";
  const avatarSrc = resolveMediaUrl(profile?.avatarUrl);
  const roleLabel = user?.role ? getRoleLabel(user.role, locale) : undefined;

  return (
    <div className="sticky top-20 space-y-3">
      {/* Profile card */}
      <section className="rounded-xl border border-border bg-card p-4">
        <h2 className="mb-3 text-sm font-semibold text-foreground">{copy.profileSection}</h2>
        <div className="flex flex-col items-center text-center">
          <Avatar className="size-16">
            {avatarSrc && <AvatarImage src={avatarSrc} alt={displayName} />}
            <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
          <p className="mt-2 text-sm font-semibold text-foreground">{displayName}</p>
          {roleLabel && (
            <div className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/5 px-2.5 py-0.5">
              <BadgeCheck className="size-3.5 text-primary" />
              <span className="text-xs font-medium text-primary">{roleLabel}</span>
            </div>
          )}
          <div className="mt-3 flex w-full divide-x divide-border border-t border-border pt-3">
            <div className="flex-1 text-center">
              {profileLoading ? (
                <div className="mx-auto mb-1 h-4 w-8 animate-pulse rounded bg-muted" />
              ) : (
                <p className="text-sm font-bold text-foreground">{profile?.postCount ?? "—"}</p>
              )}
              <p className="text-[11px] text-muted-foreground">{copy.statPosts}</p>
            </div>
            <div className="flex-1 text-center">
              {profileLoading ? (
                <div className="mx-auto mb-1 h-4 w-8 animate-pulse rounded bg-muted" />
              ) : (
                <p className="text-sm font-bold text-foreground">{profile?.followingCount ?? "—"}</p>
              )}
              <p className="text-[11px] text-muted-foreground">{copy.statFollowing}</p>
            </div>
            <div className="flex-1 text-center">
              <p className="text-sm font-bold text-foreground">—</p>
              <p className="text-[11px] text-muted-foreground">{copy.statProducts}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Suggested products */}
      <section className="rounded-xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">{copy.productsSection}</h2>
          <Link
            href={ROUTES.marketplace}
            className="text-xs font-medium text-primary hover:underline"
          >
            {copy.seeAll}
          </Link>
        </div>
        <ul className="space-y-3">
          {SUGGESTED_PRODUCTS.map((product) => (
            <li key={product.id} className="flex items-center gap-2.5">
              <div className="size-10 shrink-0 rounded-lg bg-muted/60" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{product.name}</p>
                <p className="truncate text-xs text-muted-foreground">{product.seller}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-7 shrink-0 rounded-full border-primary text-primary hover:bg-primary/5"
              >
                <Plus className="size-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      </section>

      {/* Suggested sellers */}
      <section className="rounded-xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">{copy.sellersSection}</h2>
          <Link
            href={ROUTES.marketplace}
            className="text-xs font-medium text-primary hover:underline"
          >
            {copy.seeAll}
          </Link>
        </div>
        <ul className="space-y-3">
          {SUGGESTED_SELLERS.map((seller) => (
            <li key={seller.id} className="flex items-center gap-2.5">
              <Avatar className="size-9 shrink-0">
                <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                  {getInitials(seller.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{seller.name}</p>
                <p className="truncate text-xs text-muted-foreground">{seller.location}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 shrink-0 border-primary px-2.5 text-xs font-medium text-primary hover:bg-primary/5"
              >
                <UserCheck className="mr-1 size-3" />
                {copy.follow}
              </Button>
            </li>
          ))}
        </ul>
      </section>

      {/* Trending */}
      <section className="rounded-xl border border-border bg-card p-4">
        <h2 className="mb-3 text-sm font-semibold text-foreground">{copy.trendingSection}</h2>
        <ul className="space-y-3">
          {TRENDING_TOPICS.map((topic) => (
            <li key={topic.id} className="flex items-center gap-2.5">
              <TrendingUp className="size-4 shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{topic.name}</p>
                <p className="text-xs text-muted-foreground">{topic.count}</p>
              </div>
              <span className="shrink-0 text-xs font-bold text-secondary">#{topic.rank}</span>
            </li>
          ))}
        </ul>
        <Link
          href="#"
          className="mt-3 block text-center text-xs font-medium text-primary hover:underline"
        >
          {copy.seeMoreTrends}
        </Link>
      </section>
    </div>
  );
}
