"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import type { ReactionType } from "@/entities/reaction";
import { REACTION_TYPES } from "@/entities/reaction";
import { getInitials } from "@/entities/user";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { resolveMediaUrl } from "@/shared/lib/resolve-media-url";
import { cn } from "@/shared/lib/cn";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/dialog";

import { useReactionList } from "../api/reaction.queries";
import { REACTION_META, getReactionCopy } from "../reaction.constants";

interface ReactionListDialogProps {
  targetId: string;
  targetType?: "post" | "comment";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  breakdown?: Partial<Record<ReactionType, number>>;
  totalCount: number;
  locale?: AppLocale;
}

export function ReactionListDialog({
  targetId,
  targetType = "post",
  open,
  onOpenChange,
  breakdown,
  totalCount,
  locale = getClientLocale(),
}: ReactionListDialogProps) {
  const [activeTab, setActiveTab] = useState<ReactionType | "all">("all");
  const copy = getReactionCopy(locale);

  const reactionFilter = activeTab === "all" ? undefined : activeTab;
  const { data, isLoading } = useReactionList(targetId, targetType, reactionFilter, open);

  const tabsWithCount: { key: ReactionType | "all"; emoji?: string; label: string; count: number }[] =
    [{ key: "all", label: copy.tabAll, count: totalCount }];

  for (const type of REACTION_TYPES) {
    const count = breakdown?.[type] ?? 0;
    if (count > 0) {
      const m = REACTION_META[type];
      tabsWithCount.push({ key: type, emoji: m.emoji, label: locale === "en" ? m.labelEn : m.labelVi, count });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[480px] max-h-[80dvh] w-[calc(100vw-2rem)] flex-col gap-0 overflow-hidden rounded-xl border-0 p-0 sm:max-w-md">
        <DialogTitle className="border-b px-4 py-3 text-[15px] font-semibold">
          {copy.dialogTitle}
        </DialogTitle>

        {/* Tabs */}
        <div className="flex gap-0 overflow-x-auto border-b scrollbar-none">
          {tabsWithCount.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                activeTab === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.emoji && <span className="text-base leading-none">{tab.emoji}</span>}
              <span>{tab.label}</span>
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* User list */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : !data?.data.length ? (
            <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
              {copy.empty}
            </div>
          ) : (
            <ul className="divide-y">
              {data.data.map((item) => {
                const m = REACTION_META[item.reaction];
                return (
                  <li key={item.userId} className="flex items-center gap-3 px-4 py-3">
                    <div className="relative shrink-0">
                      <Avatar className="size-10">
                        {item.avatarUrl && (
                          <AvatarImage
                            src={resolveMediaUrl(item.avatarUrl) ?? ""}
                            alt={item.displayName}
                          />
                        )}
                        <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
                          {getInitials(item.displayName)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute -bottom-0.5 -right-0.5 flex size-[18px] items-center justify-center rounded-full bg-background text-[11px] leading-none shadow-sm ring-1 ring-border">
                        {m.emoji}
                      </span>
                    </div>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">
                      {item.displayName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {locale === "en" ? m.labelEn : m.labelVi}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
