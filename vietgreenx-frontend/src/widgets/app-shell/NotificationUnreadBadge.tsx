"use client";

import { useUnreadNotificationCount } from "@/features/notifications";
import { cn } from "@/shared/lib/cn";

interface NotificationUnreadBadgeProps {
  className?: string;
}

export function NotificationUnreadBadge({ className }: NotificationUnreadBadgeProps) {
  const { data } = useUnreadNotificationCount();
  const count = data ?? 0;

  if (count <= 0) return null;

  const label = count > 99 ? "99+" : String(count);

  return (
    <span
      className={cn(
        "absolute flex min-w-[1.125rem] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold leading-none text-destructive-foreground",
        className,
      )}
      aria-hidden
    >
      {label}
    </span>
  );
}

export function useNotificationUnreadCount() {
  const { data } = useUnreadNotificationCount();
  return data ?? 0;
}
