import type { ReactNode } from "react";

import { AuthGuestGuard } from "@/features/auth";
import { PublicSplitLayout } from "@/widgets/public-layout";

// Header + footer removed — auth pages use full-screen image layout (PublicPageShell kept for other uses)
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuestGuard>
      <PublicSplitLayout>{children}</PublicSplitLayout>
    </AuthGuestGuard>
  );
}
