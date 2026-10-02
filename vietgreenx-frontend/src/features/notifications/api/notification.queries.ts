"use client";

import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";

import { useUser } from "@/shared/auth";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { useSingleFlightMutation } from "@/shared/lib/use-single-flight-mutation";
import { toastService } from "@/shared/lib/toast";

import { getNotificationsCopy } from "../notifications.constants";
import { notificationService } from "./notification.service";

export const notificationKeys = {
  all: ["notifications"] as const,
  list: () => [...notificationKeys.all, "list"] as const,
  unreadCount: () => [...notificationKeys.all, "unread-count"] as const,
};

const NOTIFICATION_PAGE_SIZE = 20;

export function useNotifications() {
  const { user } = useUser();

  return useInfiniteQuery({
    queryKey: notificationKeys.list(),
    queryFn: ({ pageParam }) =>
      notificationService.list({
        limit: NOTIFICATION_PAGE_SIZE,
        cursor: pageParam ?? undefined,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? (lastPage.pagination.nextCursor ?? undefined) : undefined,
    enabled: Boolean(user?.id),
    staleTime: 30_000,
  });
}

export function useUnreadNotificationCount() {
  const { user } = useUser();

  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: () => notificationService.unreadCount(),
    enabled: Boolean(user?.id),
    staleTime: 60_000,
    // Poll every minute so the badge stays live without a WebSocket connection
    refetchInterval: 60_000,
    refetchIntervalInBackground: false,
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  const copy = getNotificationsCopy(getClientLocale());

  return useSingleFlightMutation({
    mutationFn: () => notificationService.markAllRead(),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: notificationKeys.all });
    },
    onError: () => {
      toastService.error(copy.toast.markAllReadError);
    },
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  const copy = getNotificationsCopy(getClientLocale());

  return useSingleFlightMutation({
    mutationFn: (id: string) => notificationService.markRead(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: notificationKeys.all });
    },
    onError: () => {
      toastService.error(copy.toast.markReadError);
    },
  });
}
