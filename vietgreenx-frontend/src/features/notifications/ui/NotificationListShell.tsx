"use client";

import { Bell, Loader2 } from "lucide-react";
import { useMemo } from "react";

import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { Button } from "@/shared/ui/button";
import { ModulePageHeader } from "@/shared/ui/module-page-header";

import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useUnreadNotificationCount,
} from "../api/notification.queries";
import { countUnread, getNotificationsCopy } from "../notifications.constants";
import { mapNotificationToItem } from "../lib/map-notification";
import { NotificationRow, NotificationsEmptyState } from "./NotificationRow";

interface NotificationListShellProps {
  locale?: AppLocale;
}

export function NotificationListShell({ locale = getClientLocale() }: NotificationListShellProps) {
  const copy = getNotificationsCopy(locale);
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNotifications();
  const { data: unreadData } = useUnreadNotificationCount();
  const markAllRead = useMarkAllNotificationsRead();
  const markRead = useMarkNotificationRead();

  const items = useMemo(
    () => data?.pages.flatMap((page) => page.data.map(mapNotificationToItem)) ?? [],
    [data],
  );
  const unreadCount = unreadData ?? countUnread(items);

  const handleMarkAllRead = () => {
    if (markAllRead.isPending || unreadCount === 0) return;
    markAllRead.mutate();
  };

  const handleOpen = (id: string) => {
    const item = items.find((entry) => entry.id === id);
    if (!item || item.read || markRead.isPending) return;
    markRead.mutate(id);
  };

  return (
    <div className="w-full space-y-4">
      <ModulePageHeader
        title={copy.title}
        description={unreadCount > 0 ? copy.unreadCount(unreadCount) : undefined}
        icon={Bell}
        actions={
          <Button
            variant="outline"
            size="sm"
            disabled={unreadCount === 0 || markAllRead.isPending}
            onClick={handleMarkAllRead}
          >
            {copy.markAllRead}
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-14 text-sm text-muted-foreground">
          <Loader2 className="size-5 animate-spin" aria-hidden />
          {copy.loading}
        </div>
      ) : isError ? (
        <p className="py-12 text-center text-sm text-muted-foreground">{copy.loadError}</p>
      ) : items.length === 0 ? (
        <NotificationsEmptyState title={copy.emptyTitle} description={copy.emptyDescription} />
      ) : (
        <>
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id}>
                <NotificationRow item={item} locale={locale} onOpen={handleOpen} />
              </li>
            ))}
          </ul>
          {hasNextPage ? (
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                size="sm"
                disabled={isFetchingNextPage}
                onClick={() => void fetchNextPage()}
              >
                {isFetchingNextPage ? (
                  <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
                ) : null}
                {copy.loadMore}
              </Button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
