"use client";

import Link from "next/link";
import Image from "next/image";
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  FileText,
  Heart,
  MessageCircle,
  Package,
  QrCode,
  ShoppingBag,
  Sparkles,
  Star,
  UserPlus,
} from "lucide-react";

import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { cn } from "@/shared/lib/cn";
import { resolveMediaUrl } from "@/shared/lib/resolve-media-url";
import { formatRelativeTime } from "@/shared/lib/format-relative-time";
import { CardContent } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import { VGX_ELEVATED_SURFACE } from "@/shared/ui/page-layout";

import type { NotificationItem, NotificationKind } from "../notifications.types";

const KIND_ICON: Record<string, React.ReactNode> = {
  new_follower: <UserPlus className="size-4" />,
  post_reaction: <Heart className="size-4" />,
  comment_reaction: <Heart className="size-4" />,
  post_comment: <MessageCircle className="size-4" />,
  comment_reply: <MessageCircle className="size-4" />,
  mention: <MessageCircle className="size-4" />,
  new_quotation: <ShoppingBag className="size-4" />,
  quotation_accepted: <CheckCircle className="size-4" />,
  quotation_rejected: <AlertTriangle className="size-4" />,
  order_confirmed: <ShoppingBag className="size-4" />,
  order_completed: <Package className="size-4" />,
  order_disputed: <AlertTriangle className="size-4" />,
  new_message: <MessageCircle className="size-4" />,
  verification_approved: <CheckCircle className="size-4" />,
  verification_rejected: <AlertTriangle className="size-4" />,
  subscription_expiring: <Bell className="size-4" />,
  qr_quota_warning: <QrCode className="size-4" />,
  certification_expiring: <FileText className="size-4" />,
  system_announcement: <Sparkles className="size-4" />,
  charity_donation_received: <Heart className="size-4" />,
  review_received: <Star className="size-4" />,
};

const KIND_CLASS: Record<string, string> = {
  new_follower: "bg-secondary-50 text-secondary-700",
  post_reaction: "bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300",
  comment_reaction: "bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300",
  post_comment: "bg-primary/10 text-primary",
  comment_reply: "bg-primary/10 text-primary",
  mention: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  new_quotation: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  quotation_accepted: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  quotation_rejected: "bg-destructive/10 text-destructive",
  order_confirmed: "bg-primary/10 text-primary",
  order_completed: "bg-primary/10 text-primary",
  order_disputed: "bg-destructive/10 text-destructive",
  new_message: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  verification_approved:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  verification_rejected: "bg-destructive/10 text-destructive",
  subscription_expiring: "bg-muted text-muted-foreground",
  qr_quota_warning: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  certification_expiring: "bg-muted text-muted-foreground",
  system_announcement: "bg-primary/10 text-primary",
  charity_donation_received: "bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300",
  review_received: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
};

interface NotificationRowProps {
  item: NotificationItem;
  locale?: AppLocale;
  onOpen?: (id: string) => void;
}

export function NotificationRow({
  item,
  locale = getClientLocale(),
  onOpen,
}: NotificationRowProps) {
  const icon = KIND_ICON[item.kind] ?? <Bell className="size-4" />;
  const badgeClass = KIND_CLASS[item.kind] ?? "bg-primary/10 text-primary";
  const avatarSrc = item.actor?.avatarUrl ? resolveMediaUrl(item.actor.avatarUrl) : null;
  const timeLabel = formatRelativeTime(item.createdAt, locale);

  return (
    <Link
      href={item.href ?? "#"}
      onClick={() => onOpen?.(item.id)}
      className={cn(
        VGX_ELEVATED_SURFACE,
        "group relative flex items-start gap-3 p-3.5 transition-all hover:bg-accent/40",
        !item.read && "border-l-4 border-l-primary bg-primary/5 dark:bg-primary/10",
      )}
    >
      <div className="relative shrink-0">
        {avatarSrc ? (
          <div className="relative size-10">
            <Image
              src={avatarSrc}
              alt={item.actor?.displayName || item.actor?.username || "Avatar"}
              width={40}
              height={40}
              className="size-10 rounded-full object-cover shadow-sm"
            />
            <span
              className={cn(
                "shadow-xs absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full border-2 border-background",
                badgeClass,
              )}
            >
              <span className="scale-75">{icon}</span>
            </span>
          </div>
        ) : (
          <span
            className={cn(
              "shadow-xs flex size-10 shrink-0 items-center justify-center rounded-full",
              badgeClass,
            )}
            aria-hidden
          >
            {icon}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-semibold leading-snug text-foreground sm:text-sm">
            {item.title}
          </p>
          {!item.read && (
            <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />
          )}
        </div>
        {item.body ? (
          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{item.body}</p>
        ) : null}
        <p className="mt-1 text-[11px] font-medium text-muted-foreground/80">{timeLabel}</p>
      </div>
    </Link>
  );
}

interface NotificationsEmptyStateProps {
  title: string;
  description: string;
}

export function NotificationsEmptyState({ title, description }: NotificationsEmptyStateProps) {
  return (
    <ElevatedCard className="border border-dashed border-border">
      <CardContent className="flex flex-col items-center gap-3 px-6 py-14 text-center">
        <Bell className="size-10 text-muted-foreground/40" />
        <div className="max-w-sm space-y-1">
          <p className="font-semibold text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </ElevatedCard>
  );
}
