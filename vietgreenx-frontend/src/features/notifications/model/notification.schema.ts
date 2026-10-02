import { z } from "zod";

// Matches BE NotifType enum exactly
export const knownNotificationKindSchema = z.enum([
  "new_follower",
  "post_reaction",
  "comment_reaction",
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

export const notificationKindSchema = z.union([knownNotificationKindSchema, z.string()]);

export type NotificationKind = z.infer<typeof notificationKindSchema>;

// BE NotificationActorResponseDto
export const notificationActorSchema = z.object({
  id: z.string(),
  username: z.string(),
  displayName: z.string().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
});

// BE NotificationResponseDto — field names match exactly
export const notificationSchema = z.object({
  id: z.string(),
  recipientId: z.string(),
  actor: notificationActorSchema.nullable().optional(),
  notifType: notificationKindSchema,
  entityType: z.string().nullable().optional(),
  entityId: z.string().nullable().optional(),
  title: z.string(),
  body: z.string().nullable().optional(),
  deepLink: z.string().nullable().optional(),
  isRead: z.boolean(),
  readAt: z.string().nullable().optional(),
  createdAt: z.string(),
});

// BE CountUnReadNotificationResponse — field is "count" not "unreadCount"
export const unreadCountSchema = z.object({
  count: z.number().int().nonnegative(),
});

export type NotificationActor = z.infer<typeof notificationActorSchema>;
export type NotificationApiItem = z.infer<typeof notificationSchema>;
