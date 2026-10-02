"use client";

import { NotificationListShell } from "@/features/notifications";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { ModulePageShell } from "@/shared/ui/module-page-shell";
import { NotificationsLinksRail } from "./NotificationsRails";

interface NotificationsScreenProps {
  locale?: AppLocale;
}

export function NotificationsScreen({ locale = getClientLocale() }: NotificationsScreenProps) {
  return (
    <ModulePageShell width="work" rightRail={<NotificationsLinksRail locale={locale} />}>
      <NotificationListShell locale={locale} />
    </ModulePageShell>
  );
}
