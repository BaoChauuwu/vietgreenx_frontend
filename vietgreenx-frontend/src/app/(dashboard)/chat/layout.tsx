// app/(dashboard)/chat/layout.tsx — Chat two-panel layout
import type { ReactNode } from "react";

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
      {children}
      {/* children = inbox page sẽ render sidebar + empty state
          hoặc conversation page sẽ render full pane */}
    </div>
  );
}
