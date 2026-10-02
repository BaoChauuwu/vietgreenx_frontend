"use client";

import Link from "next/link";
import { X, Minus, Maximize2 } from "lucide-react";

import { useChatOverlay } from "@/shared/lib/chat-overlay.store";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { ROUTES } from "@/shared/routing";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/cn";
import { getAppShellCopy } from "./app-shell.constants";

export function ChatOverlay() {
  const copy = getAppShellCopy(getClientLocale()).chatOverlay;
  const { windows, closeChat, toggleMinimize } = useChatOverlay();

  if (!windows.length) return null;

  return (
    <div className="fixed bottom-0 right-4 z-50 hidden items-end gap-2 md:flex">
      {windows.map((win) => (
        <div
          key={win.conversationId}
          className={cn(
            "flex w-72 flex-col overflow-hidden rounded-t-xl border border-border bg-background shadow-lg transition-all",
            win.minimized ? "h-12" : "h-[420px]",
          )}
        >
          {/* Header */}
          <div className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3">
            <Avatar className="size-7">
              <AvatarFallback className="bg-primary/10 text-xs text-primary">
                {win.participantName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="flex-1 truncate text-sm font-medium">{win.participantName}</span>

            <Button variant="ghost" size="icon" className="size-7" asChild>
              <Link href={ROUTES.chatDetail(win.conversationId)} title={copy.expand}>
                <Maximize2 className="size-3.5" />
              </Link>
            </Button>

            {/* Minimize */}
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={() => toggleMinimize(win.conversationId)}
              title={win.minimized ? copy.expand : copy.minimize}
            >
              <Minus className="size-3.5" />
            </Button>

            {/* Close */}
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={() => closeChat(win.conversationId)}
              title={copy.close}
            >
              <X className="size-3.5" />
            </Button>
          </div>

          {/* Chat body */}
          {!win.minimized && (
            <div className="flex flex-1 flex-col">
              {/* Message list */}
              <div className="flex-1 space-y-2 overflow-y-auto p-3">
                {/* TODO: <ChatMessageList conversationId={win.conversationId} /> */}
                <p className="text-center text-xs text-muted-foreground">{copy.loadingMessages}</p>
              </div>

              {/* Input */}
              <div className="border-t border-border p-2">
                {/* TODO: <ChatInput conversationId={win.conversationId} /> */}
                <div className="flex h-8 items-center rounded-full border border-border bg-muted px-3 text-xs text-muted-foreground">
                  {copy.messagePlaceholder}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
