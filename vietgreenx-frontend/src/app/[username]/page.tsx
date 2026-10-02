// TASK 8: Public Profile — /[username]
// TASK 23: Public Green Profile Page (SEO)
// Sprint 2/3 — SSR, no auth, SEO optimized. URL: vietgreenx.vn/nguyenvana
//
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd, buildMetadata } from "@/shared/seo";

interface PageProps {
  params: { username: string };
}

const RESERVED = new Set([
  "feed",
  "profile",
  "settings",
  "search",
  "notifications",
  "pricing",
  "post",
  "green-profile",
  "products",
  "batches",
  "qr",
  "marketplace",
  "chat",
  "org",
  "trace",
  "legal",
  "login",
  "register",
  "otp",
  "forgot-password",
  "reset-password",
  "onboarding",
  "403",
  "api",
]);

async function getPublicProfile(username: string) {
  if (RESERVED.has(username)) return null;
  // TODO: const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles/${username}`, {
  //   next: { revalidate: 3600 },
  // });
  // if (!res.ok) return null;
  // return res.json();
  void username;
  return null as null | {
    username: string;
    fullName: string;
    bio: string;
    avatarUrl?: string;
    followerCount: number;
    postCount: number;
    verificationTier: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const profile = await getPublicProfile(params.username);
  if (!profile) {
    return buildMetadata({
      title: "Không tìm thấy người dùng",
      path: `/${params.username}`,
      noIndex: true,
    });
  }
  return buildMetadata({
    title: `${profile.fullName} (@${profile.username}) | VietGreenX`,
    description: profile.bio || `Xem hồ sơ của ${profile.fullName} trên VietGreenX`,
    path: `/${profile.username}`,
    image: profile.avatarUrl,
    type: "profile",
  });
}

export default async function PublicProfilePage({ params }: PageProps) {
  const profile = await getPublicProfile(params.username);
  if (!profile) notFound();

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: profile.fullName,
          url: `https://vietgreenx.vn/${profile.username}`,
          image: profile.avatarUrl,
        }}
      />
      {/* TODO: <PublicProfileView profile={profile} /> — TASK 8, 23 */}
      {/* Bao gồm: avatar / bio / follower-following-posts count /
          verificationBadge / green profile summary / recent posts (10) /
          Buttons: Follow / Contact / View all products */}
    </main>
  );
}
