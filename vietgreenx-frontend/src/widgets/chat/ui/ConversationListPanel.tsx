"use client";

import { useMemo, useState } from "react";
import { Search, Plus, MessageSquare, Loader2 } from "lucide-react";

import type { Conversation } from "@/entities/chat";
import { getInitials } from "@/entities/user";
import { useUser } from "@/shared/auth";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import type { AppLocale } from "@/shared/i18n/locale";
import { cn } from "@/shared/lib/cn";
import { toIntlLocale } from "@/shared/lib/format-relative-time";
import { resolveMediaUrl } from "@/shared/lib/resolve-media-url";
import { Button } from "@/shared/ui/button";
import { CardContent } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import { Input } from "@/shared/ui/input";
import { type ChatFilterTab, getChatCopy } from "../chat.constants";

interface ConversationListPanelProps {
  conversations: Conversation[];
  activeId?: string | null;
  onSelectConversation?: (id: string) => void;
  onOpenNewChat?: () => void;
  isLoading?: boolean;
  locale?: AppLocale;
}

export function ConversationListPanel({
  conversations,
  activeId,
  onSelectConversation,
  onOpenNewChat,
  isLoading = false,
  locale = getClientLocale(),
}: ConversationListPanelProps) {
  const copy = getChatCopy(locale);
  const { user } = useUser();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<ChatFilterTab>("all");

  const filterTabs: { id: ChatFilterTab; label: string }[] = [
    { id: "all", label: copy.inbox.tabs.all },
    { id: "unread", label: copy.inbox.tabs.unread },
    { id: "important", label: copy.inbox.tabs.important },
  ];

  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) => {
      const partnerName = conv.partner?.displayName || conv.name || "User";
      const matchesSearch = partnerName.toLowerCase().includes(searchQuery.trim().toLowerCase());
      if (!matchesSearch) return false;

      if (activeTab === "unread") {
        return (conv.unreadCount ?? 0) > 0;
      }
      if (activeTab === "important") {
        return Boolean(conv.partner?.onlineStatus) || (conv.unreadCount ?? 0) > 0;
      }
      return true;
    });
  }, [conversations, searchQuery, activeTab]);

  function formatTime(dateStr?: string | null): string {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

      if (isToday) {
        return date.toLocaleTimeString(toIntlLocale(locale), {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
      const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) return copy.conversation.yesterday;
      return `${date.getDate()}/${date.getMonth() + 1}`;
    } catch {
      return "";
    }
  }

  return (
    <div className="flex h-full flex-col bg-card">
      {/* Top header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">{copy.inbox.title}</h2>
        {onOpenNewChat && (
          <Button
            size="icon"
            variant="ghost"
            onClick={onOpenNewChat}
            className="h-9 w-9 rounded-full text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/40"
            title={copy.inbox.newChat}
          >
            <Plus className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Search Bar */}
      <div className="p-3 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={copy.inbox.searchPlaceholder}
            className="h-9 rounded-full bg-muted/60 pl-9 pr-4 text-sm focus-visible:ring-emerald-500"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto border-b border-border/60 px-3 py-2">
        {filterTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "whitespace-nowrap rounded-full px-3.5 py-1 text-xs font-medium transition-colors",
                isActive
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Conversation List */}
      <div className="flex-1 divide-y divide-border/40 overflow-y-auto">
        {isLoading ? (
          <div className="p-4">
            <ElevatedCard>
              <CardContent className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
                <Loader2 className="size-5 animate-spin" aria-hidden />
                {copy.inbox.loading}
              </CardContent>
            </ElevatedCard>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-4">
            <ElevatedCard className="border border-dashed border-border">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <MessageSquare className="mb-2 h-10 w-10 text-emerald-600 opacity-40" />
                <p className="text-sm font-medium">
                  {searchQuery ? copy.inbox.noFilterMatch : copy.inbox.noConversations}
                </p>
              </CardContent>
            </ElevatedCard>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const partner = conv.partner;
            const displayName = partner?.displayName || conv.name || copy.inbox.defaultUser;
            const initials = getInitials(displayName);
            const isSelected = conv.id === activeId;
            const unreadCount = conv.unreadCount ?? 0;

            const lastMsg = conv.lastMessage;
            const messageTime = lastMsg?.createdAt || conv.lastMessageAt || conv.createdAt;
            const lastTime = formatTime(messageTime);

            let previewText = conv.lastMessageText || "";
            if (lastMsg) {
              const isMe = lastMsg.senderId === user?.id;
              const previewCopy = copy.conversation.preview;
              const prefix = isMe ? previewCopy.youPrefix : "";
              let bodyContent = lastMsg.body || "";

              if (lastMsg.messageType === "image") {
                bodyContent = previewCopy.sentImage;
              } else if (lastMsg.messageType === "product_card") {
                bodyContent = previewCopy.sentProduct;
              }

              previewText = `${prefix}${bodyContent}`;
            }

            if (!previewText) {
              previewText = copy.conversation.preview.noMessages;
            }

            const content = (
              <div
                key={conv.id}
                onClick={() => onSelectConversation?.(conv.id)}
                className={cn(
                  "group relative mx-2 my-1 flex cursor-pointer items-center gap-3 rounded-xl p-3 transition-all duration-200",
                  isSelected
                    ? "bg-emerald-500/12 shadow-xs text-foreground ring-1 ring-emerald-500/30 dark:bg-emerald-950/50"
                    : "hover:bg-muted/60",
                )}
              >
                {/* Avatar with online dot */}
                <div className="relative shrink-0">
                  <div
                    className={cn(
                      "shadow-xs flex h-12 w-12 items-center justify-center rounded-full font-semibold ring-2 ring-emerald-500/20 transition-transform duration-200 group-hover:scale-105",
                      isSelected
                        ? "bg-emerald-600 text-white"
                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300",
                    )}
                  >
                    {partner?.avatarUrl ? (
                      <img
                        src={resolveMediaUrl(partner.avatarUrl) ?? partner.avatarUrl}
                        alt={displayName}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm">{initials}</span>
                    )}
                  </div>
                  {/* Online indicator */}
                  {partner?.onlineStatus && (
                    <span className="shadow-xs absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-card bg-emerald-500 ring-1 ring-emerald-500/30" />
                  )}
                </div>

                {/* Content */}
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "truncate text-sm font-semibold text-foreground transition-colors",
                        unreadCount > 0 && "font-bold text-emerald-700 dark:text-emerald-400",
                      )}
                    >
                      {displayName}
                    </span>
                    <span className="shrink-0 text-[11px] font-medium text-muted-foreground">
                      {lastTime}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center justify-between gap-2">
                    <p
                      className={cn(
                        "truncate text-xs text-muted-foreground",
                        unreadCount > 0 && "font-semibold text-foreground",
                      )}
                    >
                      {previewText}
                    </p>
                    {unreadCount > 0 && (
                      <span className="shadow-xs flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-1.5 text-[10px] font-bold text-white">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );

            return content;
          })
        )}
      </div>
    </div>
  );
}
