import type { Metadata } from "next";

import { ChatConversationScreen } from "@/widgets/chat";

interface PageProps {
  params: { conversationId: string };
}

export const metadata: Metadata = { title: "Cuộc trò chuyện | VietGreenX" };

export default function ChatConversationPage({ params }: PageProps) {
  return <ChatConversationScreen conversationId={params.conversationId} />;
}
