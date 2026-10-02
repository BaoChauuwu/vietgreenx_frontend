import type { PostTag, PostTagType } from "@/entities/post";

import { POST_TAG_MAX, type PostTagInput } from "../model/post-input.schema";

export function postTagKey(
  tag: Pick<PostTag, "tagType" | "refLabel"> & { refId?: string | null },
): string {
  const refId = tag.refId ?? "";
  return `${tag.tagType}:${refId}:${tag.refLabel.trim().toLowerCase()}`;
}

export function normalizePostTagsForRequest(tags: PostTagInput[]): PostTagInput[] {
  const seen = new Set<string>();
  const normalized: PostTagInput[] = [];

  for (const tag of tags) {
    const refLabel = tag.refLabel.trim();
    if (!refLabel) continue;

    const payload: PostTagInput = {
      tagType: tag.tagType,
      refLabel,
      ...(tag.refId ? { refId: tag.refId } : {}),
    };

    const key = postTagKey({ ...payload, refId: payload.refId ?? null });
    if (seen.has(key)) continue;
    seen.add(key);
    normalized.push(payload);
    if (normalized.length >= POST_TAG_MAX) break;
  }

  return normalized;
}

export function postTagsEqual(a: PostTagInput[], b: PostTagInput[]): boolean {
  if (a.length !== b.length) return false;
  const keysA = normalizePostTagsForRequest(a).map(postTagKey).sort();
  const keysB = normalizePostTagsForRequest(b).map(postTagKey).sort();
  return keysA.every((key, index) => key === keysB[index]);
}

export function postTagsFromPost(tags: PostTag[]): PostTagInput[] {
  return tags.map(({ tagType, refId, refLabel }) => ({
    tagType: tagType as PostTagType,
    refLabel,
    ...(refId ? { refId } : {}),
  }));
}

export function canAddPostTag(tags: PostTagInput[]): boolean {
  return normalizePostTagsForRequest(tags).length < POST_TAG_MAX;
}

const TAG_DISPLAY_ORDER: Record<PostTagType, number> = {
  category: 0,
  region: 1,
  product: 2,
};

/** Feed/detail read mode — category → region → product */
export function sortPostTagsForDisplay(tags: readonly PostTag[]): PostTag[] {
  return [...tags].sort(
    (a, b) => TAG_DISPLAY_ORDER[a.tagType as PostTagType] - TAG_DISPLAY_ORDER[b.tagType as PostTagType],
  );
}
