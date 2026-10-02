"use client";

import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { cn } from "@/shared/lib/cn";

import { canAddPostTag, normalizePostTagsForRequest } from "../lib/post-tags";
import type { PostTagInput } from "../model/post-input.schema";
import { getPostsCopy } from "../posts.constants";
import { PostTagAttachToolbar } from "./PostTagAttachToolbar";
import { PostTagList } from "./PostTagList";

interface PostTagEditorProps {
  tags: PostTagInput[];
  onChange: (tags: PostTagInput[]) => void;
  locale?: AppLocale;
  disabled?: boolean;
  className?: string;
  /** Hide attach icons — use PostTagAttachToolbar in composer footer instead. */
  hideToolbar?: boolean;
}

export function PostTagEditor({
  tags,
  onChange,
  locale = getClientLocale(),
  disabled = false,
  className,
  hideToolbar = false,
}: PostTagEditorProps) {
  const copy = getPostsCopy(locale).tags;
  const normalizedTags = normalizePostTagsForRequest(tags);
  const atLimit = !canAddPostTag(normalizedTags);

  const handleRemove = (index: number) => {
    onChange(normalizedTags.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <div className={cn("space-y-2", className)}>
      {normalizedTags.length > 0 ? (
        <PostTagList
          tags={normalizedTags.map((tag) => ({ ...tag, refId: tag.refId ?? null }))}
          locale={locale}
          onRemove={disabled ? undefined : handleRemove}
        />
      ) : null}

      {!hideToolbar ? (
        <PostTagAttachToolbar
          tags={tags}
          onChange={onChange}
          locale={locale}
          disabled={disabled}
        />
      ) : null}

      {atLimit ? <p className="text-xs text-amber-700">{copy.maxReached}</p> : null}
    </div>
  );
}
