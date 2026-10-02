import type { Metadata } from "next";

import { getRequestLocale } from "@/shared/i18n/get-request-locale";
import { FeedScreen } from "@/widgets/feed";
import { EngagementPostCard } from "@/widgets/post";

export const metadata: Metadata = { title: "Bảng tin | VietGreenX" };

export default function FeedPage() {
  return <FeedScreen locale={getRequestLocale()} PostCardComponent={EngagementPostCard} />;
}
