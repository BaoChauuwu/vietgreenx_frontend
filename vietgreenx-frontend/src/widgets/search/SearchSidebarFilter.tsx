"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Globe, Package, Users, FileText, Search, Sparkles, X } from "lucide-react";
import { getSearchCopy, type SearchType } from "@/features/search";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { cn } from "@/shared/lib/cn";

interface SearchSidebarFilterProps {
  query: string;
  activeType?: SearchType;
  locale?: AppLocale;
}

export function SearchSidebarFilter({
  query,
  activeType,
  locale = getClientLocale(),
}: SearchSidebarFilterProps) {
  const router = useRouter();
  const copy = getSearchCopy(locale);
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchInput.trim();
    const encodedQ = encodeURIComponent(q);
    if (activeType) {
      router.push(`/search?q=${encodedQ}&type=${activeType}`);
    } else {
      router.push(`/search?q=${encodedQ}`);
    }
  };

  const filterOptions = [
    {
      type: undefined,
      label: copy.tabs.all,
      icon: Globe,
      badgeBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      activeBadgeBg: "bg-white/20 text-white",
    },
    {
      type: "posts" as SearchType,
      label: copy.tabs.posts,
      icon: FileText,
      badgeBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      activeBadgeBg: "bg-white/20 text-white",
    },
    {
      type: "users" as SearchType,
      label: copy.tabs.users,
      icon: Users,
      badgeBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      activeBadgeBg: "bg-white/20 text-white",
    },
    {
      type: "products" as SearchType,
      label: copy.tabs.products,
      icon: Package,
      badgeBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
      activeBadgeBg: "bg-white/20 text-white",
    },
  ];

  const handleSelectType = (type?: SearchType) => {
    const encodedQ = encodeURIComponent(searchInput.trim());
    if (type) {
      router.push(`/search?q=${encodedQ}&type=${type}`);
    } else {
      router.push(`/search?q=${encodedQ}`);
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border/50 bg-card p-4 shadow-sm backdrop-blur-md">
      {/* Mobile Search Input Form */}
      <form
        onSubmit={handleSearchSubmit}
        className="mb-4 flex items-center gap-2 rounded-xl border border-primary/20 bg-muted/30 px-3 py-2 text-sm focus-within:border-primary focus-within:bg-background focus-within:ring-2 focus-within:ring-primary/20 sm:hidden"
      >
        <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        <input
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder={copy.emptyQuery || "Nhập từ khóa tìm kiếm..."}
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        {searchInput && (
          <button
            type="button"
            onClick={() => {
              setSearchInput("");
              router.push("/search");
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </form>
      {/* Sidebar Header */}
      <div className="mb-4 border-b border-border/40 pb-4">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Search className="size-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">{copy.title}</h2>
            <p className="text-xs text-muted-foreground">{copy.subtitle}</p>
          </div>
        </div>

        {query && (
          <div className="mt-3 flex items-center gap-1.5 rounded-xl border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs text-foreground">
            <Sparkles className="size-3.5 shrink-0 text-primary" />
            <span className="truncate text-muted-foreground">{copy.keywordPrefix}</span>
            <span className="truncate font-bold text-primary">&quot;{query}&quot;</span>
          </div>
        )}
      </div>

      {/* Filter Items */}
      <div className="space-y-1">
        <p className="px-2 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          {copy.categoryHeader}
        </p>

        {filterOptions.map((opt) => {
          const isActive = activeType === opt.type;
          const Icon = opt.icon;

          return (
            <button
              key={opt.label}
              type="button"
              onClick={() => handleSelectType(opt.type)}
              className={cn(
                "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-[0.99]",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105",
                  isActive ? opt.activeBadgeBg : opt.badgeBg,
                )}
              >
                <Icon className="size-4.5" />
              </span>

              <span className="flex-1 truncate text-left">{opt.label}</span>

              {isActive && <span className="size-2 animate-pulse rounded-full bg-white" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
