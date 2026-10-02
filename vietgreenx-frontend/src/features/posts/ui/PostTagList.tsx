"use client";

import { MapPin, Package, Sprout, X } from "lucide-react";

import type { PostTag, PostTagType } from "@/entities/post";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";

import { getPostsCopy } from "../posts.constants";

const TAG_ICON: Record<PostTagType, typeof MapPin> = {
  region: MapPin,
  category: Sprout,
  product: Package,
};

const TAG_STYLE: Record<PostTagType, string> = {
  region: "bg-secondary-50 text-secondary-800 border-secondary-200/80",
  category: "bg-primary/10 text-primary border-primary/20",
  product: "bg-tertiary/10 text-tertiary border-tertiary/25",
};

interface PostTagListProps {
  tags: readonly PostTag[];
  locale?: AppLocale;
  className?: string;
  onRemove?: (index: number) => void;
}

export function PostTagList({
  tags,
  locale = getClientLocale(),
  className,
  onRemove,
}: PostTagListProps) {
  const copy = getPostsCopy(locale).tags;

  if (tags.length === 0) return null;

  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)} aria-label={copy.listAria}>
      {tags.map((tag, index) => {
        const Icon = TAG_ICON[tag.tagType as PostTagType];
        const typeLabel = copy.types[tag.tagType as PostTagType];

        return (
          <li key={`${tag.tagType}-${tag.refId ?? "none"}-${tag.refLabel}-${index}`}>
            <span
              className={cn(
                "inline-flex max-w-full items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
                TAG_STYLE[tag.tagType as PostTagType],
              )}
              title={typeLabel}
            >
              <Icon className="size-3 shrink-0" aria-hidden />
              <span className="truncate">{tag.refLabel}</span>
              {onRemove ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-5 shrink-0 rounded-full p-0 hover:bg-black/5"
                  onClick={() => onRemove(index)}
                  aria-label={`${copy.remove}: ${tag.refLabel}`}
                >
                  <X className="size-3" />
                </Button>
              ) : null}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
