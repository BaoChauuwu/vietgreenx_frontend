import axios from "axios";

const HASHTAG_LIMIT_MARKERS = [
  "too many hashtags",
  "hashtag limit",
  "POST_HASHTAG_LIMIT",
] as const;

export function isHashtagLimitError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) return false;

  const data = error.response?.data as { message?: string; error?: string } | undefined;
  const message = `${data?.message ?? ""} ${data?.error ?? ""}`.toLowerCase();

  return HASHTAG_LIMIT_MARKERS.some((marker) => message.includes(marker));
}
