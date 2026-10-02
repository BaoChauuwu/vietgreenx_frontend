"use client";

import { cn } from "@/shared/lib/cn";

const HASHTAG_IN_TEXT = /#([\p{L}\p{N}_]{2,50})/gu;

interface PostBodyContentProps {
  body: string;
  hashtags?: readonly string[];
  className?: string;
  onHashtagClick?: (tag: string) => void;
}

function normalizeTag(tag: string): string {
  return tag.toLocaleLowerCase("vi-VN");
}

export function PostBodyContent({
  body,
  hashtags = [],
  className,
  onHashtagClick,
}: PostBodyContentProps) {
  const known = new Set(hashtags.map(normalizeTag));
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;

  for (const match of body.matchAll(HASHTAG_IN_TEXT)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      nodes.push(body.slice(lastIndex, index));
    }

    const display = match[0];
    const token = match[1] ?? "";

    if (token && known.has(normalizeTag(token))) {
      nodes.push(
        onHashtagClick ? (
          <button
            key={`${index}-${token}`}
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onHashtagClick(normalizeTag(token));
            }}
            className="font-medium text-primary hover:underline"
          >
            {display}
          </button>
        ) : (
          <span key={`${index}-${token}`} className="font-medium text-primary">
            {display}
          </span>
        ),
      );
    } else {
      nodes.push(display);
    }

    lastIndex = index + display.length;
  }

  if (lastIndex < body.length) {
    nodes.push(body.slice(lastIndex));
  }

  return <p className={cn("whitespace-pre-wrap", className)}>{nodes}</p>;
}
