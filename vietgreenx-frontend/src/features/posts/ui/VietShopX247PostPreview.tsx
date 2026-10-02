"use client";

import { ExternalLink, Store } from "lucide-react";

import type { VietShopPreview } from "@/entities/post";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";

import { getPostsCopy } from "../posts.constants";

interface VietShopX247PostPreviewProps {
  preview: VietShopPreview;
  locale?: AppLocale;
}

export function VietShopX247PostPreview({
  preview,
  locale = getClientLocale(),
}: VietShopX247PostPreviewProps) {
  const copy = getPostsCopy(locale).vietShop;

  return (
    <a
      href={preview.shopUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-lg border border-secondary-200 bg-secondary-50/60 px-3 py-2.5 transition-colors hover:bg-secondary-50"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-card text-secondary-700 shadow-sm">
        <Store className="size-4" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold uppercase tracking-wide text-secondary-700">
          {copy.badge}
        </span>
        <span className="block truncate text-sm font-medium text-foreground">{preview.productName}</span>
        <span className="block text-xs text-muted-foreground">{copy.cta}</span>
      </span>
      <ExternalLink className="size-4 shrink-0 text-muted-foreground" aria-hidden />
    </a>
  );
}
