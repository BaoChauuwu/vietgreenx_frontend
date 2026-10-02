import { createService } from "@/shared/api/create-service";
import {
  conversationListSchema,
  conversationSchema,
  messageListSchema,
  messageSchema,
  type Conversation,
  type ConversationList,
  type CreateConversationInput,
  type CreateMessageInput,
  type Message,
  type MessageList,
} from "@/entities/chat";

const http = createService("/conversations");

export const chatService = {
  /** GET /app/conversations — paginated conversations of current user */
  listConversations(cursor?: string | null, limit = 20): Promise<ConversationList> {
    const params: Record<string, unknown> = { limit };
    if (cursor) params.cursor = cursor;
    return http.get<ConversationList>("", { params }, { schema: conversationListSchema });
  },

  /** POST /app/conversations — create direct conversation with target user */
  createConversation(input: CreateConversationInput): Promise<Conversation> {
    return http.post<Conversation>("", input, { schema: conversationSchema });
  },

  /** GET /app/conversations/:id/messages — paginated messages inside a conversation */
  listMessages(conversationId: string, cursor?: string | null, limit = 50): Promise<MessageList> {
    const params: Record<string, unknown> = { limit };
    if (cursor) params.cursor = cursor;
    return http.get<MessageList>(
      `/${conversationId}/messages`,
      { params },
      { schema: messageListSchema },
    );
  },

  /** POST /app/conversations/:id/messages — send new message */
  sendMessage(conversationId: string, input: CreateMessageInput): Promise<Message> {
    return http.post<Message>(`/${conversationId}/messages`, input, { schema: messageSchema });
  },

  /** POST /app/conversations/:id/read — mark all messages in conversation as read */
  markAsRead(conversationId: string): Promise<void> {
    return http.post<void>(`/${conversationId}/read`);
  },
};
