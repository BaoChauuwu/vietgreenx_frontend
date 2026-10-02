"use client";

import type { ComponentType } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Search, X } from "lucide-react";

import {
  CreatePostComposer,
  FeedList,
  FeedSearchList,
  getPostsCopy,
  FeedStoriesRow,
} from "@/features/posts";
import type { FeedCategory, FeedMode, FeedPostCardProps } from "@/features/posts";
import { ProfileCompletionBanner, getProfileCopy, useMyProfile } from "@/features/profile";
import { usePostBlockAuthor } from "@/features/block";
import { ModulePageShell } from "@/shared/ui/module-page-shell";
import { cn } from "@/shared/lib/cn";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import { CardContent } from "@/shared/ui/card";

import { FeedAside } from "./FeedAside";

interface FeedTab {
  id: string;
  label: string;
  mode: FeedMode;
  category?: FeedCategory;
}

interface FeedScreenProps {
  locale?: AppLocale;
  PostCardComponent: ComponentType<FeedPostCardProps>;
}

export function FeedScreen({ locale = getClientLocale(), PostCardComponent }: FeedScreenProps) {
  const { data: profile, isLoading } = useMyProfile();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { onBlockAuthor, blockDialog } = usePostBlockAuthor(locale);
  const profileViewCopy = getProfileCopy(locale).view;

  const handleSearchChange = useCallback((value: string) => {
    setInputValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearchQuery(value.trim()), 400);
  }, []);

  const clearSearch = useCallback(() => {
    setInputValue("");
    setSearchQuery("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    [],
  );

  const postsCopy = getPostsCopy(locale);
  const tabsCopy = postsCopy.feedTabs;
  const feedCopy = postsCopy.feed;
  const FEED_TABS: FeedTab[] = [
    { id: "all", label: tabsCopy.all, mode: "discovery" },
    { id: "following", label: tabsCopy.following, mode: "following" },
  ];

  const {
    id: activeTabId,
    mode,
    category,
  } = FEED_TABS.find((t) => t.id === activeTab) ?? FEED_TABS[0]!;

  const rightRail = (
    <>
      <ProfileCompletionBanner locale={locale} />
      <FeedAside locale={locale} />
    </>
  );

  return (
    <ModulePageShell width="feed" rightRail={rightRail} mobileBelowCenter={rightRail}>
      {isLoading ? (
        <ElevatedCard>
          <CardContent className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
            <Loader2 className="size-5 animate-spin" aria-hidden />
            {profileViewCopy.loading}
          </CardContent>
        </ElevatedCard>
      ) : profile ? (
        <CreatePostComposer
          locale={locale}
          displayName={profile.displayName}
          avatarUrl={profile.avatarUrl}
        />
      ) : null}

      {/* Stories Row */}
      <FeedStoriesRow locale={locale} avatarUrl={profile?.avatarUrl} />

      {/* Search bar */}
      <div className="relative flex items-center">
        <Search className="absolute left-3 size-4 text-muted-foreground" aria-hidden />
        <input
          type="search"
          value={inputValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder={feedCopy.searchPlaceholder}
          className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-9 text-sm outline-none ring-offset-background transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        {inputValue && (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Xóa tìm kiếm"
            className="absolute right-3 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {searchQuery ? (
        <FeedSearchList
          key={searchQuery}
          query={searchQuery}
          locale={locale}
          PostCardComponent={PostCardComponent}
          onBlockAuthor={onBlockAuthor}
        />
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-primary/[0.12] bg-card p-3 shadow-[0_2px_8px_0_hsl(var(--primary)/0.04)]">
            <div className="flex">
              {FEED_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "shrink-0 px-5 text-sm font-medium transition-colors",
                    activeTab === tab.id
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "border-b-2",
                      activeTab === tab.id ? "border-primary" : "border-transparent",
                    )}
                  >
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <FeedList
            key={activeTabId}
            locale={locale}
            mode={mode}
            category={category}
            PostCardComponent={PostCardComponent}
            onBlockAuthor={onBlockAuthor}
          />
        </>
      )}

      {blockDialog}
    </ModulePageShell>
  );
}
