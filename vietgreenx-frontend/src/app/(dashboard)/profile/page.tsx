import type { Metadata } from "next";

import { getRequestLocale } from "@/shared/i18n/get-request-locale";
import { EngagementPostCard, PostTheaterDialog, PostTagProductsScope } from "@/widgets/post";
import { ProfileScreen } from "@/widgets/profile";

export const metadata: Metadata = { title: "Hồ sơ | VietGreenX" };

export default function ProfilePage() {
  return (
    <PostTagProductsScope>
      <ProfileScreen
        locale={getRequestLocale()}
        PostCardComponent={EngagementPostCard}
        PostTheaterComponent={PostTheaterDialog}
      />
    </PostTagProductsScope>
  );
}
