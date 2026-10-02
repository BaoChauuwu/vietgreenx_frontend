"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";

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

interface ChatInboxScreenProps {
  locale?: AppLocale;
}

export function ChatInboxScreen({ locale = getClientLocale() }: ChatInboxScreenProps) {
  const router = useRouter();
  const copy = getChatCopy(locale);
  const inboxCopy = copy.inbox;
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Real-time socket connection
  useChatSocketConnection();

  const { data: conversationList, isLoading: isLoadingConversations } = useConversations();
  const conversations = conversationList?.items ?? [];

  // Active conversation state (default to first conversation or selected)
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeId = selectedId || (conversations.length > 0 ? conversations[0]?.id || null : null);
  const activeConversation = conversations.find((c) => c.id === activeId) || null;

  // Messages API
  const { data: messageList, isLoading: isLoadingMessages } = useConversationMessages(activeId);
  const messages = messageList?.items ?? [];

  // Mutations
  const { mutateAsync: createConversation, isPending: isCreatingConv } = useCreateConversation();
  const { mutateAsync: sendMessage, isPending: isSendingMessage } = useSendMessage(activeId || "");
  const { mutate: markAsRead } = useMarkConversationAsRead();

  // Auto mark conversation as read when opened
  useEffect(() => {
    if (activeId && activeConversation?.unreadCount && activeConversation.unreadCount > 0) {
      markAsRead(activeId);
    }
  }, [activeId, activeConversation?.unreadCount, markAsRead]);

  function handleSelectConversation(id: string) {
    setSelectedId(id);
    if (window.innerWidth < 768) {
      router.push(ROUTES.chatDetail(id));
    }
  }

  async function handleCreateNewChat(targetUserId: string) {
    const newConv = await createConversation({ targetUserId });
    setIsModalOpen(false);
    setSelectedId(newConv.id);
  }

  async function handleSendMessage(
    body: string,
    messageType = "text",
    metadata?: Record<string, unknown>,
  ) {
    if (!activeId) return;
    await sendMessage({ body, messageType, metadata });
  }

  return (
    <div className="flex h-full w-full overflow-hidden bg-background">
      {/* Panel 1: Conversation List */}
      <aside className="flex w-full shrink-0 flex-col border-r border-border md:w-80">
        <ConversationListPanel
          conversations={conversations}
          activeId={activeId}
          onSelectConversation={handleSelectConversation}
          onOpenNewChat={() => setIsModalOpen(true)}
          isLoading={isLoadingConversations}
          locale={locale}
        />
      </aside>

      {/* Panel 2 & 3: Main Chat Window & Info Sidebar */}
      <div className="hidden h-full min-w-0 flex-1 overflow-x-hidden md:flex">
        {activeConversation ? (
          <>
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

            {/* Panel 3: Info Sidebar */}
            <ChatInfoSidebar
              conversation={activeConversation}
              onDeleteConversation={() => setDeleteOpen(true)}
              locale={locale}
            />
          </>
        ) : (
          /* Empty state */
          <div className="flex flex-1 flex-col items-center justify-center bg-card/30 p-8 text-center text-muted-foreground">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm dark:bg-emerald-950/60">
              <MessageSquare className="h-8 w-8" />
            </div>
            <p className="text-lg font-bold text-foreground">{inboxCopy.selectConversation}</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">{inboxCopy.startChat}</p>
          </div>
        )}
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
                setSelectedId(null);
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
