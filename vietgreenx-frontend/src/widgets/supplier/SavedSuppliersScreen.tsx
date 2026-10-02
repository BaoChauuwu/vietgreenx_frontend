"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  MessageSquare,
  Search,
  Sparkles,
  Store,
  User,
  UserCheck,
  X,
} from "lucide-react";

import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { resolveMediaUrl } from "@/shared/lib/resolve-media-url";
import { ROUTES } from "@/shared/routing";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { CardContent } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import { Input } from "@/shared/ui/input";
import { ModulePageHeader } from "@/shared/ui/module-page-header";
import { ModulePageShell } from "@/shared/ui/module-page-shell";
import { Pagination } from "@/shared/ui/pagination";
import { getSupplierCopy, useSavedSuppliers, SupplierSaveButton } from "@/features/supplier";

interface SavedSuppliersScreenProps {
  locale?: AppLocale;
}

function getInitials(name?: string | null): string {
  if (!name || !name.trim()) return "VG";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "VG";
  const first = parts[0];
  if (!first) return "VG";
  if (parts.length === 1) return first.substring(0, 2).toUpperCase();
  const last = parts[parts.length - 1];
  const firstChar = first[0] ?? "";
  const lastChar = last?.[0] ?? "";
  return (firstChar + lastChar).toUpperCase() || "VG";
}

export function SavedSuppliersScreen({ locale = getClientLocale() }: SavedSuppliersScreenProps) {
  const t = getSupplierCopy(locale);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useSavedSuppliers(page, 20);
  const savedItems = data?.data || [];
  const totalItems = data?.pagination?.total || savedItems.length;
  const totalPages = data?.pagination?.totalPages || 1;

  // Filter saved suppliers by search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return savedItems;
    const q = searchQuery.toLowerCase().trim();
    return savedItems.filter((item) => {
      const name = item.supplier?.displayName || "";
      const username = item.supplier?.username || "";
      return name.toLowerCase().includes(q) || username.toLowerCase().includes(q);
    });
  }, [savedItems, searchQuery]);

  return (
    <ModulePageShell width="work">
      {/* Header with Search Toolbar & Actions */}
      <ModulePageHeader
        title={t.savedTitle}
        description={t.savedSubtitle}
        icon={Bookmark}
        iconTileClassName="bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
        actions={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              <Sparkles className="size-3.5" />
              {totalItems} {t.totalSavedLabel}
            </span>
          </div>
        }
        toolbar={
          savedItems.length > 0 ? (
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative max-w-md flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-8 text-sm focus-visible:ring-emerald-500/30"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <X className="size-3.5" />
                    <span className="sr-only">Clear search</span>
                  </button>
                )}
              </div>

              {/* Quick links banner */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild className="gap-1.5 font-medium">
                  <Link href={ROUTES.marketplace}>
                    <Store className="size-4 text-emerald-600" />
                    {t.backToMarketplace}
                  </Link>
                </Button>
              </div>
            </div>
          ) : null
        }
      />

      {/* Main Content Area */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <ElevatedCard key={idx} className="animate-pulse">
              <CardContent className="p-5">
                <div className="flex items-center gap-3.5">
                  <div className="size-12 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-muted" />
                    <div className="h-3 w-1/2 rounded bg-muted/70" />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3">
                  <div className="h-8 w-24 rounded bg-muted/60" />
                  <div className="h-8 w-20 rounded bg-muted/60" />
                </div>
              </CardContent>
            </ElevatedCard>
          ))}
        </div>
      ) : savedItems.length === 0 ? (
        /* Empty Saved State */
        <ElevatedCard className="border-dashed">
          <CardContent className="flex flex-col items-center gap-5 px-6 py-16 text-center">
            <div className="relative flex size-20 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 shadow-inner dark:bg-emerald-950/60 dark:text-emerald-400">
              <Bookmark className="size-10" />
              <Sparkles className="absolute -right-1 -top-1 size-5 animate-bounce text-amber-500" />
            </div>

            <div className="max-w-md space-y-2">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                {t.emptySavedTitle}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{t.emptySavedDesc}</p>
            </div>

            <Button asChild size="lg" className="mt-2 gap-2 font-semibold shadow-md">
              <Link href={ROUTES.marketplace}>
                <Store className="size-4" />
                {t.backToMarketplace}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </ElevatedCard>
      ) : filteredItems.length === 0 ? (
        /* Search Empty State */
        <ElevatedCard>
          <CardContent className="flex flex-col items-center gap-4 px-6 py-12 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
              <Search className="size-7" />
            </div>
            <div className="max-w-md space-y-1">
              <p className="text-base font-semibold text-foreground">{t.noSearchResultsTitle}</p>
              <p className="text-sm text-muted-foreground">
                {t.noSearchResultsDesc.replace("{query}", searchQuery)}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setSearchQuery("")} className="mt-1">
              {t.clearSearch}
            </Button>
          </CardContent>
        </ElevatedCard>
      ) : (
        /* Saved Suppliers Grid Layout */
        <div className="space-y-6">
          <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => {
              const supplier = item.supplier;
              const displayName =
                supplier?.displayName || supplier?.username || t.fallbackSupplierName;
              const username = supplier?.username;
              const avatarSrc = resolveMediaUrl(supplier?.avatarUrl);
              const initials = getInitials(displayName);
              const profileUrl = username ? ROUTES.userProfile(username) : ROUTES.marketplace;

              return (
                <li key={item.id}>
                  <ElevatedCard className="group flex h-full flex-col overflow-hidden transition-all duration-200 hover:border-emerald-500/40 hover:shadow-lg">
                    {/* Top Decorative Header Accent */}
                    <div className="relative h-14 bg-gradient-to-r from-emerald-600/15 via-teal-500/10 to-emerald-700/15 px-4 pt-3 dark:from-emerald-950/40 dark:to-teal-900/30">
                      <div className="flex items-center justify-between">
                        <span className="backdrop-blur-xs shadow-2xs inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-background/90 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-emerald-700 dark:text-emerald-300">
                          <UserCheck className="size-3 text-emerald-600" />
                          {t.verifiedSupplier}
                        </span>

                        <SupplierSaveButton
                          supplierId={supplier?.id || item.id}
                          isSaved={true}
                          locale={locale}
                          size="sm"
                          className="shadow-2xs h-7 px-2.5 text-xs"
                        />
                      </div>
                    </div>

                    <CardContent className="p-4.5 -mt-7 flex flex-1 flex-col pt-0">
                      {/* Avatar & Main Details */}
                      <div className="flex flex-col items-center text-center">
                        <Avatar className="mb-2.5 size-16 shadow-md ring-4 ring-background">
                          <AvatarImage src={avatarSrc} alt={displayName} />
                          <AvatarFallback className="bg-gradient-to-br from-emerald-600 to-teal-700 text-lg font-bold text-white">
                            {initials}
                          </AvatarFallback>
                        </Avatar>

                        <Link
                          href={profileUrl}
                          className="line-clamp-1 text-base font-bold text-foreground underline-offset-2 transition-colors hover:text-emerald-600 group-hover:underline"
                        >
                          {displayName}
                        </Link>

                        {username ? (
                          <p className="mt-0.5 text-xs text-muted-foreground">@{username}</p>
                        ) : (
                          <p className="mt-0.5 text-xs text-muted-foreground/60">
                            {t.defaultSupplierRole}
                          </p>
                        )}
                      </div>

                      {/* Action buttons at bottom */}
                      <div className="mt-auto flex items-center gap-2 border-t border-border/50 pt-4">
                        {username ? (
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="flex-1 gap-1.5 text-xs font-semibold hover:border-emerald-500/40 hover:text-emerald-600"
                          >
                            <Link href={profileUrl}>
                              <User className="size-3.5" />
                              <span>{t.actions.viewProfile}</span>
                            </Link>
                          </Button>
                        ) : null}

                        <Button
                          variant="secondary"
                          size="sm"
                          asChild
                          className="flex-1 gap-1.5 bg-emerald-50 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/60"
                        >
                          <Link href={ROUTES.chat}>
                            <MessageSquare className="size-3.5" />
                            <span>{t.actions.sendMessage}</span>
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </ElevatedCard>
                </li>
              );
            })}
          </ul>

          {/* Pagination control */}
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              className="pt-4"
            />
          )}
        </div>
      )}
    </ModulePageShell>
  );
}
