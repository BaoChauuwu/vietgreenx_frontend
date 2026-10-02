"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";

import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { Button } from "@/shared/ui/button";
import { CardContent } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";

import { useBlockedUsers, useUnblockUser } from "../api/block.queries";
import { getBlockCopy } from "../block.constants";
import { BlockUserSearchDialog } from "./BlockUserSearchDialog";

interface BlockedUsersCardProps {
  locale?: AppLocale;
}

export function BlockedUsersCard({ locale = getClientLocale() }: BlockedUsersCardProps) {
  const copy = getBlockCopy(locale);
  const { data, isLoading } = useBlockedUsers();
  const unblock = useUnblockUser();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <ElevatedCard>
        <CardContent className="space-y-4 p-4 md:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-foreground">{copy.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{copy.description}</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => setSearchOpen(true)}>
              {copy.blockAction}
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : !data || data.items.length === 0 ? (
            <p className="text-sm text-muted-foreground">{copy.empty}</p>
          ) : (
            <ul className="divide-y divide-border rounded-lg border border-border">
              {data.items.map((block) => (
                <li
                  key={block.id}
                  className="flex items-center justify-between gap-3 px-3 py-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">
                      {block.blockedUser.displayName ?? block.blockedUser.username}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      @{block.blockedUser.username}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={unblock.isPending}
                    onClick={() => unblock.mutate(block.blockedUserId)}
                  >
                    {copy.unblock}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </ElevatedCard>

      <BlockUserSearchDialog open={searchOpen} onOpenChange={setSearchOpen} locale={locale} />
    </>
  );
}
