import type { Metadata } from "next";

import { FeedScreen } from "@/widgets/feed";
import { EngagementPostCard, PostDetailDialogContainer } from "@/widgets/post";

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Chi tiết bài viết | VietGreenX",
    description: "Chi tiết bài viết nông sản",
  };
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params;

  return (
    <>
      <FeedScreen PostCardComponent={EngagementPostCard} />
      <PostDetailDialogContainer postId={id} />
    </>
  );
}
