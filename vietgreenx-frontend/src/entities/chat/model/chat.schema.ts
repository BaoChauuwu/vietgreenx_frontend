import { z } from "zod";

export const conversationPartnerSchema = z.object({
  id: z.string(),
  displayName: z.string().default("Người dùng"),
  avatarUrl: z.string().nullable().optional().default(null),
  onlineStatus: z.boolean().optional().default(false),
});

export const lastMessageSummarySchema = z.object({
  body: z.string().nullable().optional().default(null),
  senderId: z.string().optional().default(""),
  messageType: z.string().optional().default("text"),
  createdAt: z.string().optional(),
});

export const conversationSchema = z.object({
  id: z.string(),
  conversationType: z.string().default("direct"),
  name: z.string().nullable().optional().default(null),
  lastMessageAt: z.string().nullable().optional().default(null),
  lastMessageText: z.string().optional(),
  lastMessage: lastMessageSummarySchema.nullable().optional().default(null),
  unreadCount: z.number().int().nonnegative().optional().default(0),
  partner: conversationPartnerSchema.nullable().optional().default(null),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

const conversationListResponseSchema = z.object({
  items: z.array(conversationSchema).optional(),
  data: z.array(conversationSchema).optional(),
  nextCursor: z.string().nullable().optional(),
  hasNext: z.boolean().optional().default(false),
  limit: z.number().int().positive().optional().default(20),
});

export const conversationListSchema = conversationListResponseSchema.transform((value) => ({
  items: value.items ?? value.data ?? [],
  nextCursor: value.nextCursor ?? null,
  hasNext: value.hasNext ?? false,
  limit: value.limit ?? 20,
}));

export const messageSenderSchema = z.object({
  id: z.string(),
  displayName: z.string().default("Người dùng"),
  avatarUrl: z.string().nullable().optional().default(null),
});

export const messageSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  senderId: z.string(),
  sender: messageSenderSchema
    .optional()
    .default({ id: "", displayName: "Người dùng", avatarUrl: null }),
  body: z.string().nullable().optional().default(""),
  mediaId: z.string().nullable().optional().default(null),
  mediaUrl: z.string().nullable().optional().default(null),
  messageType: z.string().default("text"),
  metadata: z.record(z.any()).optional().default({}),
  readBy: z.array(z.string()).optional().default([]),
  createdAt: z.string(),
});

const messageListResponseSchema = z.object({
  items: z.array(messageSchema).optional(),
  data: z.array(messageSchema).optional(),
  nextCursor: z.string().nullable().optional(),
  hasNext: z.boolean().optional().default(false),
  limit: z.number().int().positive().optional().default(50),
});

export const messageListSchema = messageListResponseSchema.transform((value) => ({
  items: value.items ?? value.data ?? [],
  nextCursor: value.nextCursor ?? null,
  hasNext: value.hasNext ?? false,
  limit: value.limit ?? 50,
}));

export const createConversationInputSchema = z.object({
  targetUserId: z.string().uuid(),
});

export const createMessageInputSchema = z.object({
  body: z.string().optional(),
  mediaId: z.string().uuid().optional(),
  messageType: z.string().default("text"),
  metadata: z.record(z.any()).optional(),
});

export type ConversationPartner = z.infer<typeof conversationPartnerSchema>;
export type Conversation = z.infer<typeof conversationSchema>;
export type ConversationList = z.infer<typeof conversationListSchema>;
export type MessageSender = z.infer<typeof messageSenderSchema>;
export type Message = z.infer<typeof messageSchema>;
export type MessageList = z.infer<typeof messageListSchema>;
export type CreateConversationInput = z.infer<typeof createConversationInputSchema>;
export type CreateMessageInput = z.infer<typeof createMessageInputSchema>;
