import { POST_HASHTAG_MAX_PER_POST } from "../model/hashtag.schema";

const HASHTAG_PATTERN = /#([\p{L}\p{N}_]{2,50})/gu;

function normalizeHashtagToken(token: string): string {
  return token.trim().toLocaleLowerCase("vi-VN");
}

/** Mirrors BE parse — for client-side validation before submit. */
export function parseHashtagsFromBody(body: string | null | undefined): string[] {
  if (!body?.trim()) return [];

  const seen = new Set<string>();
  const tags: string[] = [];

  for (const match of body.matchAll(HASHTAG_PATTERN)) {
    const raw = match[1];
    if (!raw) continue;

    const normalized = normalizeHashtagToken(raw);
    if (!normalized || seen.has(normalized)) continue;

    seen.add(normalized);
    tags.push(normalized);
    if (tags.length >= POST_HASHTAG_MAX_PER_POST) break;
  }

  return tags;
}

export function countHashtagsInBody(body: string | null | undefined): number {
  return parseHashtagsFromBody(body).length;
}

export function exceedsHashtagLimit(body: string | null | undefined): boolean {
  if (!body?.trim()) return false;

  let count = 0;
  const seen = new Set<string>();

  for (const match of body.matchAll(HASHTAG_PATTERN)) {
    const raw = match[1];
    if (!raw) continue;

    const normalized = normalizeHashtagToken(raw);
    if (!normalized || seen.has(normalized)) continue;

    seen.add(normalized);
    count += 1;
    if (count > POST_HASHTAG_MAX_PER_POST) return true;
  }

  return false;
}
