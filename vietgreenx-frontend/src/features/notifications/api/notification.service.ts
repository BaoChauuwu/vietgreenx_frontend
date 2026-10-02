import { createService } from "@/shared/api";
import type { CursorPaginatedResult } from "@/shared/api";

import {
  notificationSchema,
  unreadCountSchema,
  type NotificationApiItem,
} from "../model/notification.schema";

const http = createService("/notifications");

export const notificationService = {
  list(params?: { cursor?: string; limit?: number }): Promise<CursorPaginatedResult<NotificationApiItem>> {
    return http.getCursorPaginated("", notificationSchema, { params });
  },

  async unreadCount(): Promise<number> {
    const res = await http.get("/unread-count", undefined, { schema: unreadCountSchema });
    return res.count;
  },

  markAllRead(): Promise<void> {
    return http.patch<void>("/read-all");
  },

  markRead(id: string): Promise<void> {
    return http.patch<void>(`/${id}/read`);
  },
};
