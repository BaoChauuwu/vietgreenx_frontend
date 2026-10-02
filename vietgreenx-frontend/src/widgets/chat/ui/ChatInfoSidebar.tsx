"use client";

import Link from "next/link";
import { Volume2, Search, Image as ImageIcon, Flag, Trash2 } from "lucide-react";

import type { Conversation } from "@/entities/chat";
import { getInitials } from "@/entities/user";
import { useUserProfile } from "@/features/profile";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import type { AppLocale } from "@/shared/i18n/locale";
import { resolveMediaUrl } from "@/shared/lib/resolve-media-url";
import { ROUTES } from "@/shared/routing";
import { Button } from "@/shared/ui/button";
import { getChatCopy } from "../chat.constants";
import { toIntlLocale } from "@/shared/lib/format-relative-time";

interface ChatInfoSidebarProps {
  conversation?: Conversation | null;
  onDeleteConversation?: () => void;
  locale?: AppLocale;
}

export function ChatInfoSidebar({
  conversation,
  onDeleteConversation,
  locale = getClientLocale(),
}: ChatInfoSidebarProps) {
  const copy = getChatCopy(locale);
  const sidebarCopy = copy.sidebar;

  const partner = conversation?.partner;
  const { data: profile } = useUserProfile(partner?.id);

  const displayName = profile?.displayName || partner?.displayName || conversation?.name || "—";
  const avatarUrl = profile?.avatarUrl || partner?.avatarUrl;
  const avatarSrc = avatarUrl ? (resolveMediaUrl(avatarUrl) ?? avatarUrl) : null;

  const address = [profile?.ward, profile?.district, profile?.province].filter(Boolean).join(", ");

  const createdAt = profile?.createdAt || conversation?.createdAt;

  return (
    <aside className="flex h-full w-80 shrink-0 flex-col space-y-6 overflow-y-auto border-l border-border bg-card p-5">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-3">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-2xl font-bold text-emerald-800 shadow-md shadow-emerald-500/10 ring-4 ring-emerald-500/15 dark:bg-emerald-900/60 dark:text-emerald-300">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={displayName}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <span>{getInitials(displayName)}</span>
            )}
          </div>
          {partner?.onlineStatus && (
            <span className="shadow-xs absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-card bg-emerald-500 ring-1 ring-emerald-500/30" />
          )}
        </div>

        <h3 className="text-base font-bold tracking-tight text-foreground">{displayName}</h3>
        <p className="mt-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          {partner?.onlineStatus ? copy.conversation.activeStatus : copy.conversation.offlineStatus}
        </p>

        {partner?.id ? (
          <div className="mt-4">
            <Link href={`${ROUTES.profile}/${partner.id}`}>
              <Button className="rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-2 text-xs font-bold text-white shadow-sm shadow-emerald-600/20 transition-all hover:from-emerald-500 hover:to-teal-500 active:scale-95">
                {sidebarCopy.viewProfile}
              </Button>
            </Link>
          </div>
        ) : null}
      </div>

      <div className="h-px w-full bg-border/60" />

      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {sidebarCopy.generalInfo}
        </h4>
        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between gap-2">
            <span className="text-muted-foreground">{sidebarCopy.joined}</span>
            <span className="font-semibold text-foreground">
              {createdAt && !isNaN(Date.parse(createdAt))
                ? new Date(createdAt).toLocaleDateString(toIntlLocale(locale), {
                    month: "2-digit",
                    year: "numeric",
                  })
                : sidebarCopy.noData}
            </span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="shrink-0 text-muted-foreground">{sidebarCopy.address}</span>
            <span className="max-w-[180px] text-right font-semibold leading-snug text-foreground">
              {address || sidebarCopy.noData}
            </span>
          </div>
          {profile?.bio && (
            <div className="flex justify-between gap-2">
              <span className="shrink-0 text-muted-foreground">{sidebarCopy.bio}</span>
              <span className="max-w-[180px] text-right font-medium text-foreground">
                {profile.bio}
              </span>
            </div>
          )}
          {profile?.website && (
            <div className="flex justify-between gap-2">
              <span className="shrink-0 text-muted-foreground">Website:</span>
              <a
                href={profile.website}
                target="_blank"
                rel="noreferrer"
                className="max-w-[180px] truncate font-medium text-emerald-600 hover:underline dark:text-emerald-400"
              >
                {profile.website}
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="h-px w-full bg-border/60" />

      <div className="space-y-1">
        <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {sidebarCopy.options}
        </h4>

        <button
          type="button"
          className="group flex w-full items-center gap-3 rounded-xl p-2.5 text-xs font-medium text-foreground transition-all hover:bg-muted/70"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted/80 text-muted-foreground transition-colors group-hover:bg-emerald-500/10 group-hover:text-emerald-600">
            <Volume2 className="h-4 w-4" />
          </div>
          <span>{sidebarCopy.notifications}</span>
        </button>

        <button
          type="button"
          className="group flex w-full items-center gap-3 rounded-xl p-2.5 text-xs font-medium text-foreground transition-all hover:bg-muted/70"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted/80 text-muted-foreground transition-colors group-hover:bg-emerald-500/10 group-hover:text-emerald-600">
            <Search className="h-4 w-4" />
          </div>
          <span>{sidebarCopy.searchMessages}</span>
        </button>

        <button
          type="button"
          className="group flex w-full items-center gap-3 rounded-xl p-2.5 text-xs font-medium text-foreground transition-all hover:bg-muted/70"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted/80 text-muted-foreground transition-colors group-hover:bg-emerald-500/10 group-hover:text-emerald-600">
            <ImageIcon className="h-4 w-4" />
          </div>
          <span>{sidebarCopy.mediaFiles}</span>
        </button>

        <button
          type="button"
          className="group flex w-full items-center gap-3 rounded-xl p-2.5 text-xs font-medium text-foreground transition-all hover:bg-muted/70"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted/80 text-muted-foreground transition-colors group-hover:bg-emerald-500/10 group-hover:text-emerald-600">
            <Flag className="h-4 w-4" />
          </div>
          <span>{sidebarCopy.report}</span>
        </button>

        <button
          type="button"
          onClick={onDeleteConversation}
          className="group flex w-full items-center gap-3 rounded-xl p-2.5 text-xs font-bold text-red-500 transition-all hover:bg-red-50 dark:hover:bg-red-950/30"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400">
            <Trash2 className="h-4 w-4" />
          </div>
          <span>{sidebarCopy.deleteChat}</span>
        </button>
      </div>

      <div className="h-px w-full bg-border/60" />

      <div className="space-y-3 pb-6">
        <h4 className="text-sm font-bold tracking-tight text-foreground">
          {sidebarCopy.exchangedProducts}
        </h4>
        <p className="text-xs text-muted-foreground">—</p>
      </div>
    </aside>
  );
}
