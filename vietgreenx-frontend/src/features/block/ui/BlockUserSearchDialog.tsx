"use client";

import { Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";

import type { UserSearchItem } from "../model/user-search.schema";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { resolveMediaUrl } from "@/shared/lib/resolve-media-url";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";

import { useUserSearch } from "../api/user-search.queries";
import { getBlockCopy } from "../block.constants";
import { BlockUserConfirmDialog, type BlockUserTarget } from "./BlockUserConfirmDialog";

interface BlockUserSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale?: AppLocale;
}

export function BlockUserSearchDialog({
  open,
  onOpenChange,
  locale = getClientLocale(),
}: BlockUserSearchDialogProps) {
  const copy = getBlockCopy(locale);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [confirmTarget, setConfirmTarget] = useState<BlockUserTarget | null>(null);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setDebouncedQuery("");
      setConfirmTarget(null);
      return;
    }
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [open, query]);

  const { data, isFetching } = useUserSearch(debouncedQuery, open);
  const items = data?.items ?? [];
  const showHint = debouncedQuery.length > 0 && debouncedQuery.length < 2;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-[440px]">
          <DialogHeader className="space-y-1.5 border-b border-border px-6 pb-4 pt-6 text-left">
            <DialogTitle className="text-base font-semibold">{copy.searchTitle}</DialogTitle>
            <DialogDescription>{copy.searchDescription}</DialogDescription>
          </DialogHeader>

          <div className="space-y-3 px-6 py-5">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={copy.searchPlaceholder}
                className="pl-9"
                autoFocus
              />
            </div>

            {showHint ? (
              <p className="text-sm text-muted-foreground">{copy.searchMinLength}</p>
            ) : isFetching ? (
              <div className="flex justify-center py-6">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : debouncedQuery.length >= 2 && items.length === 0 ? (
              <p className="text-sm text-muted-foreground">{copy.searchEmpty}</p>
            ) : (
              <ul className="max-h-[280px] divide-y divide-border overflow-y-auto rounded-lg border border-border">
                {items.map((user) => (
                  <SearchResultRow
                    key={user.id}
                    user={user}
                    onSelect={() => {
                      setConfirmTarget({
                        id: user.id,
                        displayName: user.displayName ?? user.username,
                        username: user.username,
                      });
                    }}
                  />
                ))}
              </ul>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <BlockUserConfirmDialog
        target={confirmTarget}
        open={Boolean(confirmTarget)}
        onOpenChange={(next) => {
          if (!next) setConfirmTarget(null);
        }}
        locale={locale}
      />
    </>
  );
}

function SearchResultRow({ user, onSelect }: { user: UserSearchItem; onSelect: () => void }) {
  const avatarSrc = resolveMediaUrl(user.avatarUrl);
  const label = user.displayName ?? user.username;

  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm hover:bg-muted/50"
      >
        <Avatar className="size-9">
          {avatarSrc ? <AvatarImage src={avatarSrc} alt={label} /> : null}
          <AvatarFallback className="text-xs">{label.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate font-medium text-foreground">{label}</p>
          <p className="truncate text-xs text-muted-foreground">@{user.username}</p>
        </div>
      </button>
    </li>
  );
}
