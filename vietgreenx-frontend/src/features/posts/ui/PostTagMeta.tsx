"use client";

import type { PostTag } from "@/entities/post";
import { cn } from "@/shared/lib/cn";

import { sortPostTagsForDisplay } from "../lib/post-tags";

interface PostTagMetaProps {
  tags: readonly PostTag[];
  className?: string;
}

export function PostTagMeta({ tags, className }: PostTagMetaProps) {
  const sorted = sortPostTagsForDisplay(tags);

  if (sorted.length === 0) return null;

  const line = sorted.map((tag) => tag.refLabel).join(" · ");

  return (
    <p
      className={cn("truncate text-[13px] leading-snug text-muted-foreground", className)}
      title={line}
    >
      {line}
    </p>
  );
}
