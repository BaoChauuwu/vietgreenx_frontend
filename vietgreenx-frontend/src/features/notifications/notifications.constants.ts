import type { AppLocale } from "@/shared/i18n/locale";

import { ROUTES } from "@/shared/routing";
import type { NotificationItem } from "./notifications.types";

const NOTIFICATIONS_COPY = {
  vi: {
    title: "Thông báo",
    markAllRead: "Đánh dấu đã đọc",
    loadMore: "Xem thêm",
    loading: "Đang tải...",
    loadError: "Không thể tải thông báo.",
    emptyTitle: "Chưa có thông báo",
    emptyDescription: "Thích, bình luận, báo giá chợ và cập nhật hệ thống sẽ hiện tại đây.",
    unreadCount: (count: number) => `${count} chưa đọc`,
    rail: {
      title: "Liên quan",
      feed: "Về bảng tin",
      marketplace: "Chợ nông sản",
    },
    toast: {
      markAllReadSuccess: "Đã đánh dấu tất cả là đã đọc.",
      markReadError: "Không thể đánh dấu đã đọc. Vui lòng thử lại.",
      markAllReadError: "Không thể đánh dấu tất cả đã đọc. Vui lòng thử lại.",
    },
  },
  en: {
    title: "Notifications",
    markAllRead: "Mark all as read",
    loadMore: "Load more",
    loading: "Loading...",
    loadError: "Could not load notifications.",
    emptyTitle: "No notifications yet",
    emptyDescription: "Likes, comments, marketplace quotes and system updates will appear here.",
    unreadCount: (count: number) => `${count} unread`,
    rail: {
      title: "Related",
      feed: "Back to feed",
      marketplace: "Marketplace",
    },
    toast: {
      markAllReadSuccess: "All notifications marked as read.",
      markReadError: "Could not mark as read. Please try again.",
      markAllReadError: "Could not mark all as read. Please try again.",
    },
  },
} as const;

export const LAYOUT_PREVIEW_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n-1",
    kind: "new_quotation",
    title: "Báo giá mới cho tin đăng bán",
    body: "Công ty TNHH Thực phẩm Xanh gửi báo giá cho Lúa ST25 hữu cơ.",
    href: ROUTES.marketplaceDetail("demo-sell-1"),
    createdAt: "2026-06-05T09:00:00.000Z",
    read: false,
  },
  {
    id: "n-2",
    kind: "post_reaction",
    title: "Nguyễn Thị B thích bài viết của bạn",
    body: "Thu hoạch vụ Đông Xuân — ảnh thực tế vườn",
    href: ROUTES.post("demo-post-1"),
    createdAt: "2026-06-04T16:30:00.000Z",
    read: false,
  },
  {
    id: "n-3",
    kind: "qr_quota_warning",
    title: "Mã QR được quét 12 lần",
    body: "Lô L2026-AG-001 — khách quét truy xuất nguồn gốc.",
    href: ROUTES.qr,
    createdAt: "2026-06-03T11:15:00.000Z",
    read: true,
  },
  {
    id: "n-4",
    kind: "system_announcement",
    title: "Hoàn thiện hồ sơ xanh",
    body: "Thêm ảnh vườn và chứng nhận để tăng độ tin cậy với người mua.",
    href: ROUTES.greenProfile,
    createdAt: "2026-06-01T08:00:00.000Z",
    read: true,
  },
];

export function getNotificationsCopy(locale: AppLocale) {
  return NOTIFICATIONS_COPY[locale] ?? NOTIFICATIONS_COPY.vi;
}

export function countUnread(items: NotificationItem[]): number {
  return items.filter((item) => !item.read).length;
}
