import type { QueryClient, InfiniteData } from "@tanstack/react-query";
import type { CursorPaginatedResult } from "@/shared/api";

/** Shared React Query keys for post caches (used across features without feature↔feature imports). */
export const postKeys = {
  all: ["posts"] as const,
  detail: (id: string) => [...postKeys.all, "detail", id] as const,
};

type FeedCache = InfiniteData<CursorPaginatedResult<{ author: { userId: string } }>>;

const FEED_KEY = ["posts", "feed"] as const;
const MINE_KEY = ["posts", "mine"] as const;

export function removePostsByAuthorFromAllFeedCaches(qc: QueryClient, authorId: string) {
  const apply = (old: FeedCache | undefined): FeedCache | undefined => {
    if (!old) return old;
    return {
      ...old,
      pages: old.pages.map((page) => ({
        ...page,
        data: page.data.filter((p) => p.author.userId !== authorId),
      })),
    };
  };
  qc.setQueriesData<FeedCache>({ queryKey: FEED_KEY }, apply);
  qc.setQueriesData<FeedCache>({ queryKey: MINE_KEY }, apply);
}
