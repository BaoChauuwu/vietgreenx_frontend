import type { Metadata } from "next";

import { ChatInboxScreen } from "@/widgets/chat";

export const metadata: Metadata = { title: "Tin nhắn | VietGreenX" };

export default function ChatPage() {
  return <ChatInboxScreen />;
}
