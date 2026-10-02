const ACTIVE_HASHTAG_PATTERN = /(^|[\s])#([\p{L}\p{N}_]{0,50})$/u;

export function getActiveHashtagQuery(text: string, cursor: number): string | null {
  const before = text.slice(0, cursor);
  const match = before.match(ACTIVE_HASHTAG_PATTERN);
  if (!match) return null;
  return match[2] ?? "";
}

export function replaceActiveHashtag(
  text: string,
  cursor: number,
  tag: string,
): { text: string; cursor: number } {
  const before = text.slice(0, cursor);
  const after = text.slice(cursor);
  const match = before.match(ACTIVE_HASHTAG_PATTERN);
  if (!match) return { text, cursor };

  const prefixLength = match[1]?.length ?? 0;
  const hashStart = before.length - match[0].length + prefixLength;
  const nextText = `${text.slice(0, hashStart)}#${tag} ${after}`;
  const nextCursor = hashStart + tag.length + 2;

  return { text: nextText, cursor: nextCursor };
}
