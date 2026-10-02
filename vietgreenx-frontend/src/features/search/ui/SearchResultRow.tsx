"use client";

import Link from "next/link";
import { Building2, FileText, Package, Search, User } from "lucide-react";

import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { cn } from "@/shared/lib/cn";
import { CardContent } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import { VGX_ELEVATED_SURFACE } from "@/shared/ui/page-layout";

import { getSearchCopy } from "../search.constants";
import type { SearchResultItem, SearchResultKind } from "../search.types";

const KIND_ICON: Record<SearchResultKind, React.ReactNode> = {
  user: <User className="size-4" />,
  org: <Building2 className="size-4" />,
  product: <Package className="size-4" />,
  post: <FileText className="size-4" />,
};

const KIND_CLASS: Record<SearchResultKind, string> = {
  user: "bg-primary/10 text-primary",
  org: "bg-secondary-50 text-secondary-700",
  product: "bg-tertiary-50 text-tertiary",
  post: "bg-muted text-muted-foreground",
};

interface SearchResultRowProps {
  item: SearchResultItem;
  locale?: AppLocale;
}

export function SearchResultRow({ item, locale = getClientLocale() }: SearchResultRowProps) {
  const copy = getSearchCopy(locale);

  return (
    <Link
      href={item.href}
      className={cn(
        VGX_ELEVATED_SURFACE,
        "flex items-start gap-3 p-3 transition-opacity hover:opacity-95",
      )}
    >
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-lg",
          KIND_CLASS[item.kind],
        )}
        aria-hidden
      >
        {KIND_ICON[item.kind]}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-foreground">{item.title}</p>
        {item.subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{item.subtitle}</p>}
        <p className="mt-1 text-xs font-medium text-primary/80">{copy.kind[item.kind]}</p>
      </div>
    </Link>
  );
}

interface SearchEmptyStateProps {
  title: string;
  description?: string;
}

export function SearchEmptyState({ title, description }: SearchEmptyStateProps) {
  return (
    <ElevatedCard className="border border-dashed border-border">
      <CardContent className="flex flex-col items-center gap-3 px-6 py-14 text-center">
        <Search className="size-10 text-muted-foreground/40" />
        <div className="max-w-sm space-y-1">
          <p className="font-semibold text-foreground">{title}</p>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      </CardContent>
    </ElevatedCard>
  );
}
