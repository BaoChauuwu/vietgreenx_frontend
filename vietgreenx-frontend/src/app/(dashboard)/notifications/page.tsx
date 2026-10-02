import type { Metadata } from "next";

import { NotificationsScreen } from "@/widgets/notifications";
import { getRequestLocale } from "@/shared/i18n/get-request-locale";

export const metadata: Metadata = { title: "Thông báo | VietGreenX" };

export default function NotificationsPage() {
  return <NotificationsScreen locale={getRequestLocale()} />;
}
