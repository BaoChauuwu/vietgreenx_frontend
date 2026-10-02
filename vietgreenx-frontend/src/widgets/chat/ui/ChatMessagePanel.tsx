"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Phone,
  Video,
  Search,
  MoreHorizontal,
  Smile,
  Image as ImageIcon,
  Paperclip,
  Send,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import type { Conversation, Message } from "@/entities/chat";
import { getInitials } from "@/entities/user";
import { useUser } from "@/shared/auth";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import type { AppLocale } from "@/shared/i18n/locale";
import { cn } from "@/shared/lib/cn";
import { resolveMediaUrl } from "@/shared/lib/resolve-media-url";
import { Button } from "@/shared/ui/button";
import { CardContent } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import { Input } from "@/shared/ui/input";
import { GuardedForm } from "@/shared/ui/guarded-form";
import { useGuardedSubmit } from "@/shared/lib/use-guarded-submit";
import { getChatCopy } from "../chat.constants";

interface ChatMessagePanelProps {
  conversation?: Conversation | null;
  messages: Message[];
  onSendMessage: (
    body: string,
    messageType?: string,
    metadata?: Record<string, unknown>,
  ) => Promise<void> | void;
  isSending?: boolean;
  isLoading?: boolean;
  locale?: AppLocale;
}

export function ChatMessagePanel({
  conversation,
  messages,
  onSendMessage,
  isSending = false,
  isLoading = false,
  locale = getClientLocale(),
}: ChatMessagePanelProps) {
  const copy = getChatCopy(locale).conversation;
  const { user } = useUser();

  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTo({
        top: el.scrollHeight,
        behavior,
      });
      setTimeout(() => {
        if (el) {
          el.scrollTop = el.scrollHeight;
        }
      }, 50);
      setTimeout(() => {
        if (el) {
          el.scrollTop = el.scrollHeight;
        }
      }, 150);
    });
  }, []);

  // Auto-adjust textarea height up to 140px
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const newHeight = Math.min(el.scrollHeight, 140);
    el.style.height = `${Math.max(newHeight, 40)}px`;
  }, [inputMessage]);

  const partner = conversation?.partner;
  const copyInbox = getChatCopy(locale).inbox;
  const displayName = partner?.displayName || conversation?.name || copyInbox.defaultUser;

  // Sort messages chronologically (oldest first -> newest last at bottom)
  const sortedMessages = useMemo(() => {
    return [...messages].sort(
      (a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime(),
    );
  }, [messages]);

  // Format dynamic top date header based on the earliest message
  const dateHeader = useMemo(() => {
    if (sortedMessages.length === 0) return null;
    const firstDate = sortedMessages[0]?.createdAt
      ? new Date(sortedMessages[0].createdAt)
      : new Date();

    if (isNaN(firstDate.getTime())) return copy.today;

    const now = new Date();
    const isToday =
      firstDate.getDate() === now.getDate() &&
      firstDate.getMonth() === now.getMonth() &&
      firstDate.getFullYear() === now.getFullYear();

    const timeStr = firstDate.toLocaleTimeString(locale === "en" ? "en-US" : "vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return isToday
      ? `${copy.today}, ${timeStr}`
      : `${firstDate.toLocaleDateString(locale === "en" ? "en-US" : "vi-VN")}, ${timeStr}`;
  }, [sortedMessages, locale, copy.today]);

  // Auto scroll to bottom when messages update or conversation changes
  useEffect(() => {
    if (sortedMessages.length > 0) {
      scrollToBottom("smooth");
    }
  }, [sortedMessages, scrollToBottom]);

  useEffect(() => {
    if (conversation?.id) {
      scrollToBottom("auto");
    }
  }, [conversation?.id, scrollToBottom]);

  const { guardFormEvent, release } = useGuardedSubmit({ isPending: isSending });

  const onSubmit = guardFormEvent(async () => {
    try {
      const text = inputMessage.trim();
      if (!text || isSending) return;
      await onSendMessage(text, "text");
      setInputMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "40px";
      }
      scrollToBottom("smooth");
    } finally {
      release();
    }
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputMessage.trim() && !isSending) {
        onSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
      }
    }
  };

  return (
    <div className="relative flex h-full flex-1 flex-col overflow-x-hidden bg-background/50">
      {/* 1. Header */}
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3 shadow-sm">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
              {partner?.avatarUrl ? (
                <img
                  src={resolveMediaUrl(partner.avatarUrl) ?? partner.avatarUrl}
                  alt={displayName}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <span>{getInitials(displayName)}</span>
              )}
            </div>
            {partner?.onlineStatus && (
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-emerald-500" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-bold text-foreground">{displayName}</h3>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className={cn(
                  "inline-block h-1.5 w-1.5 rounded-full",
                  partner?.onlineStatus ? "bg-emerald-500" : "bg-muted-foreground/40",
                )}
              />
              <span>{partner?.onlineStatus ? copy.activeStatus : copy.offlineStatus}</span>
            </div>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex shrink-0 items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
          >
            <Phone className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
          >
            <Video className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
          >
            <Search className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 2. Messages List (Scrollable) */}
      <div
        ref={scrollContainerRef}
        className="flex-1 space-y-1.5 overflow-y-auto overflow-x-hidden p-4"
      >
        {isLoading ? (
          <ElevatedCard className="my-auto">
            <CardContent className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
              <Loader2 className="size-5 animate-spin" aria-hidden />
              {copy.loading}
            </CardContent>
          </ElevatedCard>
        ) : sortedMessages.length === 0 ? (
          <ElevatedCard className="my-auto border border-dashed border-border">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground opacity-60">
              <p className="text-sm font-medium">{copy.noMessages}</p>
            </CardContent>
          </ElevatedCard>
        ) : (
          <>
            {/* Dynamic top timestamp pill */}
            {dateHeader && (
              <div className="my-2 flex justify-center">
                <span className="rounded-full bg-muted/80 px-3 py-1 text-[11px] font-medium text-muted-foreground">
                  {dateHeader}
                </span>
              </div>
            )}

            {sortedMessages.map((msg, index) => {
              const isMe = msg.senderId === user?.id;
              const showUnreadDivider =
                index === Math.floor(sortedMessages.length * 0.4) && sortedMessages.length > 3;

              // Product card preview inside message (if messageType === 'product_card' or metadata has product)
              const productMeta = msg.metadata?.product;
              const isProductCard = msg.messageType === "product_card" || Boolean(productMeta);

              // Sender avatar & display name resolution
              const senderAvatarRaw =
                msg.sender?.avatarUrl || (msg.senderId === partner?.id ? partner?.avatarUrl : null);
              const senderAvatarUrl = senderAvatarRaw
                ? (resolveMediaUrl(senderAvatarRaw) ?? senderAvatarRaw)
                : null;
              const senderDisplayName = msg.sender?.displayName || displayName;

              return (
                <div key={msg.id} className="space-y-1">
                  {/* Unread orange divider */}
                  {showUnreadDivider && (
                    <div className="my-4 flex items-center justify-center">
                      <span className="rounded-full border border-orange-200 bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600 shadow-sm dark:border-orange-900 dark:bg-orange-950/60 dark:text-orange-400">
                        {copy.unreadDivider}
                      </span>
                    </div>
                  )}

                  <div
                    className={cn("flex w-full items-end", isMe ? "justify-end" : "justify-start")}
                  >
                    {!isMe && (
                      <div className="shadow-xs mb-0.5 mr-2.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800 ring-1 ring-emerald-500/20 dark:bg-emerald-900/60 dark:text-emerald-300">
                        {senderAvatarUrl ? (
                          <img
                            src={senderAvatarUrl}
                            alt={senderDisplayName}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <span>{getInitials(senderDisplayName)}</span>
                        )}
                      </div>
                    )}

                    <div
                      className={cn(
                        "min-w-[72px] max-w-[78%] break-words px-3.5 py-2.5 text-sm transition-all [overflow-wrap:anywhere]",
                        isMe
                          ? "rounded-br-xs shadow-xs rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-600/10"
                          : "rounded-bl-xs shadow-xs rounded-2xl border border-border/70 bg-card text-foreground",
                      )}
                    >
                      {/* Product Attachment Preview */}
                      {isProductCard && productMeta && (
                        <div className="mb-2.5 overflow-hidden rounded-xl border border-border/80 bg-background/90 text-foreground shadow-inner">
                          {productMeta.imageUrl && (
                            <img
                              src={resolveMediaUrl(productMeta.imageUrl) ?? productMeta.imageUrl}
                              alt={productMeta.name}
                              className="h-36 w-full object-cover"
                            />
                          )}
                          <div className="p-2.5">
                            <h4 className="text-sm font-bold text-foreground">
                              {productMeta.name}
                            </h4>
                            <div className="mt-1 flex items-center justify-between">
                              <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                                {productMeta.price || copy.defaultProductPrice}
                              </span>
                              <span className="flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:bg-emerald-950/60">
                                <CheckCircle2 className="h-3 w-3" /> VietGAP
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Image message */}
                      {msg.mediaUrl && !isProductCard && (
                        <div className="mb-2 overflow-hidden rounded-lg">
                          <img
                            src={resolveMediaUrl(msg.mediaUrl) ?? msg.mediaUrl}
                            alt="Attachment"
                            className="max-h-60 w-full rounded-md object-cover"
                          />
                        </div>
                      )}

                      {/* Body & Timestamp container */}
                      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                        {msg.body && (
                          <p className="whitespace-pre-wrap break-words leading-normal [overflow-wrap:anywhere] [word-break:break-word]">
                            {msg.body}
                          </p>
                        )}

                        <div
                          className={cn(
                            "ml-auto flex shrink-0 items-center gap-1 text-[10px] opacity-85",
                            isMe ? "text-emerald-100" : "text-muted-foreground",
                          )}
                        >
                          <span>
                            {new Date(msg.createdAt || Date.now()).toLocaleTimeString(
                              locale === "en" ? "en-US" : "vi-VN",
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. Message Input Bar */}
      <GuardedForm
        onSubmit={onSubmit}
        className="flex-none shrink-0 border-t border-border/80 bg-card/90 p-3.5 shadow-sm backdrop-blur-md"
        fieldsetClassName="flex-none h-auto"
      >
        <div className="flex items-end gap-2">
          {/* Action buttons left */}
          <div className="flex shrink-0 items-center gap-0.5 pb-0.5 text-muted-foreground">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-9 w-9 rounded-full transition-transform hover:scale-105 hover:bg-accent hover:text-foreground"
              title={copy.attachments.image}
            >
              <Smile className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-9 w-9 rounded-full transition-transform hover:scale-105 hover:bg-accent hover:text-foreground"
              title={copy.attachments.image}
            >
              <ImageIcon className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-9 w-9 rounded-full transition-transform hover:scale-105 hover:bg-accent hover:text-foreground"
              title={copy.attachments.file}
            >
              <Paperclip className="h-5 w-5" />
            </Button>
          </div>

          {/* Textarea field (auto-expands up to 140px) */}
          <div className="relative flex flex-1 items-center">
            <textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={copy.inputPlaceholder}
              rows={1}
              className="max-h-[140px] min-h-[40px] w-full resize-none rounded-[20px] border border-border/60 bg-muted/50 px-4 py-2 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>

          {/* Send Button */}
          <Button
            type="submit"
            size="icon"
            disabled={!inputMessage.trim() || isSending}
            className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm shadow-emerald-600/20 transition-all hover:from-emerald-500 hover:to-teal-500 active:scale-95 disabled:opacity-40"
            title={copy.send}
          >
            <Send className="-ml-0.5 h-4 w-4" />
          </Button>
        </div>
      </GuardedForm>
    </div>
  );
}
