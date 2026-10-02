import { z } from "zod";

export const notifTypeSchema = z.enum([
  "new_follower",
  "post_reaction",
  "post_comment",
  "comment_reply",
  "mention",
  "new_quotation",
  "quotation_accepted",
  "quotation_rejected",
  "order_confirmed",
  "order_completed",
  "order_disputed",
  "new_message",
  "verification_approved",
  "verification_rejected",
  "subscription_expiring",
  "qr_quota_warning",
  "certification_expiring",
  "system_announcement",
  "charity_donation_received",
  "review_received",
]);

export const notificationActorSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  displayName: z.string(),
  avatarUrl: z.string().nullable(),
});

export const notificationSchema = z.object({
  id: z.string().uuid(),
  recipientId: z.string().uuid(),
  actor: notificationActorSchema.nullable(),
  notifType: notifTypeSchema,
  entityType: z.string().nullable(),
  entityId: z.string().nullable(),
  title: z.string(),
  body: z.string().nullable(),
  deepLink: z.string().nullable(),
  isRead: z.boolean(),
  readAt: z.string().nullable(),
  createdAt: z.string(),
});

export type Notification = z.infer<typeof notificationSchema>;
export type NotifType = z.infer<typeof notifTypeSchema>;

export const notificationListSchema = z.object({
  items: z.array(notificationSchema),
  nextCursor: z.string().nullable(),
  hasNext: z.boolean(),
  limit: z.number().int().positive(),
});

export type NotificationList = z.infer<typeof notificationListSchema>;

export const unreadNotificationCountSchema = z.object({
  count: z.number().int().nonnegative(),
});

export type UnreadNotificationCount = z.infer<typeof unreadNotificationCountSchema>;
