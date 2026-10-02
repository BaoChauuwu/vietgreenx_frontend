import type { Metadata } from "next";

import { getRequestLocale } from "@/shared/i18n/get-request-locale";
import { SearchScreen } from "@/widgets/search";
import { EngagementPostCard } from "@/widgets/post";

export const metadata: Metadata = { title: "Tìm kiếm | VietGreenX" };

export default function SearchPage() {
  return <SearchScreen locale={getRequestLocale()} PostCardComponent={EngagementPostCard} />;
}
