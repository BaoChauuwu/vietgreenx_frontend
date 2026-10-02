"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { io, type Socket } from "socket.io-client";

import type {
  CreateConversationInput,
  CreateMessageInput,
  ConversationList,
} from "@/entities/chat";
import { useUser } from "@/shared/auth";
import { getAccessToken } from "@/shared/auth/token-storage";
import { useSingleFlightMutation } from "@/shared/lib/use-single-flight-mutation";
import { toastService } from "@/shared/lib/toast";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { getChatCopy } from "../chat.constants";

import { chatService } from "./chat.service";

const CHAT_STALE_MS = 15_000;

export const chatKeys = {
  all: ["conversations"] as const,
  list: () => [...chatKeys.all, "list"] as const,
  messages: (conversationId: string) => [...chatKeys.all, "messages", conversationId] as const,
};

let globalSocket: Socket | null = null;

export function useChatSocketConnection() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user?.id) {
      if (globalSocket) {
        globalSocket.disconnect();
        globalSocket = null;
      }
      return;
    }

    const token = getAccessToken();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const socketUrl = apiUrl.replace(/\/api\/v1$/, "").replace(/\/api$/, "");
    const fullSocketEndpoint = socketUrl.endsWith("/") ? `${socketUrl}chat` : `${socketUrl}/chat`;

    if (!globalSocket || !globalSocket.connected) {
      globalSocket = io(fullSocketEndpoint, {
        path: "/socket.io",
        transports: ["websocket", "polling"],
        withCredentials: true,
        auth: { token },
      });
    }

    const handleNewMessage = (payload: { conversationId?: string }) => {
      void queryClient.invalidateQueries({ queryKey: chatKeys.list() });
      if (payload?.conversationId) {
        void queryClient.invalidateQueries({
          queryKey: chatKeys.messages(payload.conversationId),
        });
      }
    };

    const handleUserOnline = (payload: { userId: string }) => {
      queryClient.setQueryData(chatKeys.list(), (old: ConversationList | undefined) => {
        if (!old?.items) return old;
        return {
          ...old,
          items: old.items.map((item) =>
            item.partner?.id === payload.userId
              ? { ...item, partner: { ...item.partner, onlineStatus: true } }
              : item,
          ),
        };
      });
    };

    const handleUserOffline = (payload: { userId: string }) => {
      queryClient.setQueryData(chatKeys.list(), (old: ConversationList | undefined) => {
        if (!old?.items) return old;
        return {
          ...old,
          items: old.items.map((item) =>
            item.partner?.id === payload.userId
              ? { ...item, partner: { ...item.partner, onlineStatus: false } }
              : item,
          ),
        };
      });
    };

    globalSocket.on("new_message", handleNewMessage);
    globalSocket.on("message:new", handleNewMessage);
    globalSocket.on("user:online", handleUserOnline);
    globalSocket.on("user:offline", handleUserOffline);

    return () => {
      globalSocket?.off("new_message", handleNewMessage);
      globalSocket?.off("message:new", handleNewMessage);
      globalSocket?.off("user:online", handleUserOnline);
      globalSocket?.off("user:offline", handleUserOffline);
    };
  }, [user?.id, queryClient]);

  return globalSocket;
}

export function useConversations() {
  const { user } = useUser();

  return useQuery({
    queryKey: chatKeys.list(),
    queryFn: () => chatService.listConversations(null, 50),
    staleTime: CHAT_STALE_MS,
    refetchInterval: 10_000, // Background polling fallback
    enabled: Boolean(user?.id),
  });
}

export function useConversationMessages(conversationId?: string | null) {
  const { user } = useUser();

  return useQuery({
    queryKey: chatKeys.messages(conversationId || ""),
    queryFn: async () => {
      if (!conversationId) throw new Error("Conversation ID is required");
      return chatService.listMessages(conversationId, null, 100);
    },
    staleTime: CHAT_STALE_MS,
    refetchInterval: 5_000, // Quick polling for real-time smoothness
    enabled: Boolean(user?.id && conversationId),
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  const copy = getChatCopy(getClientLocale());

  return useSingleFlightMutation({
    mutationFn: (input: CreateConversationInput) => chatService.createConversation(input),
    onSuccess: (newConv) => {
      void queryClient.invalidateQueries({ queryKey: chatKeys.list() });
      return newConv;
    },
    onError: () => {
      toastService.error(copy.errors.createFailed);
    },
  });
}

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();
  const copy = getChatCopy(getClientLocale());

  return useSingleFlightMutation({
    mutationFn: (input: CreateMessageInput) => chatService.sendMessage(conversationId, input),
    onSuccess: (newMsg) => {
      void queryClient.invalidateQueries({ queryKey: chatKeys.messages(conversationId) });
      void queryClient.invalidateQueries({ queryKey: chatKeys.list() });
      return newMsg;
    },
    onError: () => {
      toastService.error(copy.errors.sendFailed);
    },
  });
}

export function useMarkConversationAsRead() {
  const queryClient = useQueryClient();

  return useSingleFlightMutation({
    mutationFn: (conversationId: string) => chatService.markAsRead(conversationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: chatKeys.list() });
    },
  });
}
