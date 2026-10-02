import type { NotificationApiItem } from "./notification.schema";
import type { NotificationItem } from "../notifications.types";

export function mapNotification(api: NotificationApiItem): NotificationItem {
  return {
    id: api.id,
    kind: api.notifType,
    title: api.title,
    body: api.body ?? null,
    href: api.deepLink ?? undefined,
    createdAt: api.createdAt,
    read: api.isRead,
  };
}
