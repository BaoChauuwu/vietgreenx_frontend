"use client";

import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import type { CursorPaginatedResult } from "@/shared/api";
import type { Post } from "@/entities/post";

import { useUser } from "@/shared/auth";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { toastService } from "@/shared/lib/toast";
import { useSingleFlightMutation } from "@/shared/lib/use-single-flight-mutation";

import { profileQueryKeys } from "@/shared/lib/profile-query-keys";
import { isHashtagLimitError } from "../lib/is-hashtag-limit-error";
import { getPostsCopy } from "../posts.constants";
import { feedService, type FeedCategory, type FeedMode } from "./feed.service";
import { postService, type CreatePostWithImageInput } from "./post.service";
import type { PostContentCategory } from "@/entities/post";
import type { PostTagInput } from "../model/post-input.schema";

export const postKeys = {
  all: ["posts"] as const,
  feed: () => [...postKeys.all, "feed"] as const,
  feedList: (mode: FeedMode, category?: string) => [...postKeys.feed(), mode, category] as const,
  feedSearch: (q: string) => [...postKeys.feed(), "search", q] as const,
  mine: () => [...postKeys.all, "mine"] as const,
  detail: (id: string) => [...postKeys.all, "detail", id] as const,
};

const FEED_PAGE_SIZE = 20;

export function usePostsFeed(mode: FeedMode = "discovery", category?: FeedCategory) {
  return useInfiniteQuery({
    queryKey: postKeys.feedList(mode, category),
    queryFn: ({ pageParam }) =>
      feedService.list({
        mode,
        category,
        cursor: pageParam ?? undefined,
        limit: FEED_PAGE_SIZE,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? (lastPage.pagination.nextCursor ?? undefined) : undefined,
    staleTime: 30_000,
  });
}

export function useFeedSearch(query: string) {
  return useInfiniteQuery({
    queryKey: postKeys.feedSearch(query),
    queryFn: ({ pageParam }) =>
      feedService.list({
        q: query,
        cursor: pageParam ?? undefined,
        limit: FEED_PAGE_SIZE,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? (lastPage.pagination.nextCursor ?? undefined) : undefined,
    enabled: query.trim().length > 0,
    staleTime: 30_000,
  });
}

export function useMyPosts() {
  const { user } = useUser();

  return useInfiniteQuery({
    queryKey: postKeys.mine(),
    queryFn: ({ pageParam }) =>
      postService.me({ cursor: pageParam ?? undefined, limit: FEED_PAGE_SIZE }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? (lastPage.pagination.nextCursor ?? undefined) : undefined,
    enabled: Boolean(user?.id),
    staleTime: 30_000,
  });
}

export function usePostById(id: string) {
  const { status: authStatus } = useUser();

  return useQuery({
    queryKey: [...postKeys.detail(id), authStatus] as const,
    queryFn: () => postService.byId(id),
    enabled: Boolean(id) && authStatus !== "loading",
    staleTime: 30_000,
  });
}

export function useCreatePost() {
  const qc = useQueryClient();
  const copy = getPostsCopy(getClientLocale());

  return useSingleFlightMutation({
    mutationFn: (input: CreatePostWithImageInput) => postService.createWithOptionalImage(input),
    onSuccess: (newPost) => {
      toastService.success(copy.toast.created);

      const prependPost = (old: InfiniteData<CursorPaginatedResult<Post>> | undefined) => {
        if (!old || old.pages.length === 0) return old;
        const [firstPage, ...rest] = old.pages;
        return {
          ...old,
          pages: [{ ...firstPage, data: [newPost, ...(firstPage?.data ?? [])] }, ...rest],
        };
      };

      qc.setQueryData(postKeys.mine(), prependPost);
      qc.setQueryData(postKeys.feedList("discovery"), prependPost);
      void qc.invalidateQueries({ queryKey: postKeys.mine() });
      void qc.invalidateQueries({ queryKey: postKeys.feedList("discovery") });
      void qc.invalidateQueries({ queryKey: profileQueryKeys.all });
    },
    onError: (error) => {
      toastService.error(
        isHashtagLimitError(error) ? copy.toast.hashtagLimit : copy.toast.createError,
      );
    },
  });
}

type FeedInfiniteData = InfiniteData<CursorPaginatedResult<Post>>;

function patchPostInAllFeedCaches(
  qc: ReturnType<typeof useQueryClient>,
  postId: string,
  patch: (post: Post) => Post,
) {
  const apply = (old: FeedInfiniteData | undefined): FeedInfiniteData | undefined => {
    if (!old) return old;
    return {
      ...old,
      pages: old.pages.map((page) => ({
        ...page,
        data: page.data.map((p) => (p.id === postId ? patch(p) : p)),
      })),
    };
  };
  qc.setQueriesData<FeedInfiniteData>({ queryKey: postKeys.feed() }, apply);
  qc.setQueriesData<FeedInfiniteData>({ queryKey: postKeys.mine() }, apply);
}

export interface UpdatePostVariables {
  id: string;
  body: string;
  category?: PostContentCategory;
  tags?: PostTagInput[];
}

export function useUpdatePost() {
  const qc = useQueryClient();
  const copy = getPostsCopy(getClientLocale());

  return useSingleFlightMutation({
    mutationFn: ({ id, body, category, tags }: UpdatePostVariables) =>
      postService.update(id, {
        body,
        ...(category !== undefined ? { category } : {}),
        ...(tags !== undefined ? { tags } : {}),
      }),
    onSuccess: (updatedPost, { id }) => {
      toastService.success(copy.toast.updated);
      patchPostInAllFeedCaches(qc, id, () => updatedPost);
      void qc.invalidateQueries({ queryKey: postKeys.feed() });
      void qc.invalidateQueries({ queryKey: postKeys.mine() });
      void qc.invalidateQueries({ queryKey: postKeys.detail(id) });
    },
    onError: (error) => {
      toastService.error(
        isHashtagLimitError(error) ? copy.toast.hashtagLimit : copy.toast.updateError,
      );
    },
  });
}

function removePostFromCache(
  old: InfiniteData<CursorPaginatedResult<Post>> | undefined,
  id: string,
): InfiniteData<CursorPaginatedResult<Post>> | undefined {
  if (!old) return old;
  return {
    ...old,
    pages: old.pages.map((page) => ({
      ...page,
      data: page.data.filter((p) => p.id !== id),
    })),
  };
}

export function useDeletePost() {
  const qc = useQueryClient();
  const copy = getPostsCopy(getClientLocale());

  return useSingleFlightMutation({
    mutationFn: (id: string) => postService.remove(id),
    onSuccess: (_, id) => {
      toastService.success(copy.toast.deleted);

      qc.setQueriesData<InfiniteData<CursorPaginatedResult<Post>>>(
        { queryKey: postKeys.feed() },
        (old) => removePostFromCache(old, id),
      );
      qc.setQueriesData<InfiniteData<CursorPaginatedResult<Post>>>(
        { queryKey: postKeys.mine() },
        (old) => removePostFromCache(old, id),
      );

      void qc.invalidateQueries({ queryKey: postKeys.feed() });
      void qc.invalidateQueries({ queryKey: postKeys.mine() });
      void qc.removeQueries({ queryKey: postKeys.detail(id) });
      void qc.invalidateQueries({ queryKey: profileQueryKeys.all });
    },
    onError: () => {
      toastService.error(copy.toast.deleteError);
    },
  });
}

// Legacy alias kept for compatibility
export type FeedSource = "discovery" | "mine";
