"use client";

import { useMemo, useState } from "react";
import { Search as SearchIcon } from "lucide-react";

import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import { ModulePageHeader } from "@/shared/ui/module-page-header";

import {
  LAYOUT_PREVIEW_SEARCH_RESULTS,
  SEARCH_TABS,
  filterSearchResults,
  getSearchCopy,
} from "../search.constants";
import type { SearchTab } from "../search.types";
import { SearchEmptyState, SearchResultRow } from "./SearchResultRow";

interface GlobalSearchShellProps {
  locale?: AppLocale;
  initialQuery?: string;
}

export function GlobalSearchShell({
  locale = getClientLocale(),
  initialQuery = "",
}: GlobalSearchShellProps) {
  const copy = getSearchCopy(locale);
  const [query, setQuery] = useState(initialQuery);
  const [tab, setTab] = useState<SearchTab>("all");
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery.trim());

  const results = useMemo(() => {
    if (!submittedQuery) return [];
    return filterSearchResults(LAYOUT_PREVIEW_SEARCH_RESULTS, tab, submittedQuery);
  }, [submittedQuery, tab]);

  // Local state only — no mutation yet. When search API is wired:
  // replace with useGuardedSubmit + GuardedForm + useSingleFlightMutation (DEV-PLAYBOOK §3).
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmittedQuery(query.trim());
  };

  return (
    <div className="w-full space-y-4">
      <ModulePageHeader
        title={copy.title}
        icon={SearchIcon}
        elevated
        toolbar={
          <>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={copy.placeholder}
                className="flex h-10 min-w-0 flex-1 rounded-md border border-border bg-muted/30 px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
              />
              <Button type="submit">{copy.submit}</Button>
            </form>
            <div className="flex flex-wrap gap-2" role="tablist">
              {SEARCH_TABS.map((key) => (
                <Button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={tab === key}
                  variant={tab === key ? "default" : "outline"}
                  size="sm"
                  className="h-8 rounded-full px-3.5"
                  onClick={() => setTab(key)}
                >
                  {copy.tabs[key]}
                </Button>
              ))}
            </div>
          </>
        }
      />

      {!submittedQuery ? (
        <SearchEmptyState title={copy.emptyQuery} />
      ) : (
        <>
          <p className="text-xs text-muted-foreground">{copy.layoutNote}</p>
          {results.length === 0 ? (
            <SearchEmptyState title={copy.emptyResults} description={copy.emptyResultsHint} />
          ) : (
            <ul className={cn("space-y-2")}>
              {results.map((item) => (
                <li key={item.id}>
                  <SearchResultRow item={item} locale={locale} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
