import { ROUTES } from "@/shared/routing";

import type { NotificationApiItem } from "../model/notification.schema";
import type { NotificationItem } from "../notifications.types";

export function mapNotificationToItem(notification: NotificationApiItem): NotificationItem {
  return {
    id: notification.id,
    kind: notification.notifType,
    title: notification.title,
    body: notification.body ?? "",
    href: notification.deepLink?.startsWith("/") ? notification.deepLink : ROUTES.notifications,
    createdAt: notification.createdAt,
    read: notification.isRead,
    actor: notification.actor,
  };
}
