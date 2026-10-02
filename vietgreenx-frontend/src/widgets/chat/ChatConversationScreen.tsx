"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import {
  useConversations,
  useConversationMessages,
  useCreateConversation,
  useSendMessage,
  useMarkConversationAsRead,
  useChatSocketConnection,
} from "@/features/chat";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import type { AppLocale } from "@/shared/i18n/locale";
import { ROUTES } from "@/shared/routing";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import { Button } from "@/shared/ui/button";
import { getChatCopy } from "./chat.constants";
import { ConversationListPanel } from "./ui/ConversationListPanel";
import { ChatMessagePanel } from "./ui/ChatMessagePanel";
import { ChatInfoSidebar } from "./ui/ChatInfoSidebar";
import { NewConversationModal } from "./ui/NewConversationModal";

interface ChatConversationScreenProps {
  conversationId: string;
  locale?: AppLocale;
}

export function ChatConversationScreen({
  conversationId,
  locale = getClientLocale(),
}: ChatConversationScreenProps) {
  const router = useRouter();
  const copy = getChatCopy(locale);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Real-time socket connection
  useChatSocketConnection();

  const { data: conversationList, isLoading: isLoadingConversations } = useConversations();
  const conversations = conversationList?.items ?? [];

  const activeConversation = conversations.find((c) => c.id === conversationId) || null;

  // Messages API
  const { data: messageList, isLoading: isLoadingMessages } =
    useConversationMessages(conversationId);
  const messages = messageList?.items ?? [];

  // Mutations
  const { mutateAsync: createConversation, isPending: isCreatingConv } = useCreateConversation();
  const { mutateAsync: sendMessage, isPending: isSendingMessage } = useSendMessage(conversationId);
  const { mutate: markAsRead } = useMarkConversationAsRead();

  // Auto mark conversation as read when opened
  useEffect(() => {
    if (conversationId && activeConversation?.unreadCount && activeConversation.unreadCount > 0) {
      markAsRead(conversationId);
    }
  }, [conversationId, activeConversation?.unreadCount, markAsRead]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleSelectConversation(id: string) {
    router.push(ROUTES.chatDetail(id));
  }

  async function handleCreateNewChat(targetUserId: string) {
    const newConv = await createConversation({ targetUserId });
    setIsModalOpen(false);
    router.push(ROUTES.chatDetail(newConv.id));
  }

  async function handleSendMessage(
    body: string,
    messageType = "text",
    metadata?: Record<string, unknown>,
  ) {
    await sendMessage({ body, messageType, metadata });
  }

  return (
    <div className="flex h-full w-full overflow-hidden bg-background">
      {/* Panel 1: Conversation List (Desktop only when inside route) */}
      <aside className="hidden w-80 shrink-0 flex-col border-r border-border md:flex">
        <ConversationListPanel
          conversations={conversations}
          activeId={conversationId}
          onSelectConversation={handleSelectConversation}
          onOpenNewChat={() => setIsModalOpen(true)}
          isLoading={isLoadingConversations}
          locale={locale}
        />
      </aside>

      {/* Panel 2 & 3: Main Chat & Info Sidebar */}
      <div className="relative flex h-full min-w-0 flex-1 overflow-x-hidden">
        {/* Mobile Back Button Bar */}
        <div className="absolute left-2 top-2 z-10 md:hidden">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => router.push(ROUTES.chat)}
            className="h-8 w-8 rounded-full border border-border bg-card shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Panel 2: Messages */}
        <div className="flex h-full min-w-0 flex-1 flex-col overflow-x-hidden">
          <ChatMessagePanel
            conversation={activeConversation}
            messages={messages}
            onSendMessage={handleSendMessage}
            isSending={isSendingMessage}
            isLoading={isLoadingMessages}
            locale={locale}
          />
        </div>

        {/* Panel 3: Info Sidebar (Desktop Only) */}
        <div className="hidden h-full shrink-0 lg:block">
          <ChatInfoSidebar
            conversation={activeConversation}
            onDeleteConversation={() => setDeleteOpen(true)}
            locale={locale}
          />
        </div>
      </div>

      {/* Modal New Chat */}
      <NewConversationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateNewChat}
        isCreating={isCreatingConv}
        locale={locale}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{copy.sidebar.deleteChat}</AlertDialogTitle>
            <AlertDialogDescription>{copy.sidebar.confirmDelete}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{copy.modal.cancel}</AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                setDeleteOpen(false);
                router.push(ROUTES.chat);
              }}
            >
              {copy.sidebar.deleteChat}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
