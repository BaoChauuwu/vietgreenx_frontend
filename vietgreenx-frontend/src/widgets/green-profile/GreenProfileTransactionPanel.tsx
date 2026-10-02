"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { CardContent } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import { cn } from "@/shared/lib/cn";
import type { GreenProfile } from "@/entities/green-profile";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import type { AppLocale } from "@/shared/i18n/locale";
import { getGreenProfileCopy } from "@/features/green-profile";

export function GreenProfileTransactionPanel({
  profile: _profile,
  locale = getClientLocale(),
}: {
  profile?: GreenProfile;
  locale?: AppLocale;
}) {
  const [activeTab, setActiveTab] = useState<"transactions" | "connections">("transactions");
  const copy = getGreenProfileCopy(locale).hub.view.transactions;

  return (
    <ElevatedCard className="mt-6 overflow-hidden rounded-2xl border-none shadow-sm">
      <CardContent className="p-0">
        <div className="flex items-center justify-between border-b border-border/50 px-6 pt-5">
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setActiveTab("transactions")}
              className={cn(
                "relative flex items-center gap-2 pb-4 text-sm font-semibold transition-colors",
                activeTab === "transactions"
                  ? "font-bold text-emerald-700"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {copy.tab}
              {activeTab === "transactions" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full bg-emerald-600" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("connections")}
              className={cn(
                "relative flex items-center gap-2 pb-4 text-sm font-semibold transition-colors",
                activeTab === "connections"
                  ? "font-bold text-emerald-700"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {copy.connections}
              {activeTab === "connections" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full bg-emerald-600" />
              )}
            </button>
          </div>
          <Button
            size="sm"
            disabled
            className="mb-3 gap-2 rounded-lg bg-emerald-700 text-white shadow-sm hover:bg-emerald-800"
          >
            <Download className="size-4" />
            {copy.export}
          </Button>
        </div>

        <div className="flex items-center justify-center px-6 py-12 text-sm text-muted-foreground">
          {activeTab === "transactions" ? copy.underDevelopment : copy.connectionsUnderDevelopment}
        </div>
      </CardContent>
    </ElevatedCard>
  );
}
