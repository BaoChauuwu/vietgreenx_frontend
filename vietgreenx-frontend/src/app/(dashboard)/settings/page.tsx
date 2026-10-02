import type { Metadata } from "next";

import { AccountSettings } from "@/features/account";
import { SessionsCard } from "@/features/auth";
import { BlockedUsersCard } from "@/features/block";
import { MyReportsCard } from "@/features/reports";
import { ModulePageShell } from "@/shared/ui/module-page-shell";

export const metadata: Metadata = { title: "Cài đặt tài khoản | VietGreenX" };

export default function SettingsPage() {
  return (
    <ModulePageShell width="form">
      <div className="space-y-4">
        <AccountSettings />
        <SessionsCard />
        <BlockedUsersCard />
        <MyReportsCard />
      </div>
    </ModulePageShell>
  );
}
