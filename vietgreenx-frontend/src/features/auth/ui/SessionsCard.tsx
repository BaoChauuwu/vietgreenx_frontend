"use client";

import { Loader2 } from "lucide-react";

import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { formatAbsoluteTime } from "@/shared/lib/format-relative-time";
import { Button } from "@/shared/ui/button";
import { CardContent } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";

import {
  useAuthSessions,
  useRevokeAllAuthSessions,
  useRevokeAuthSession,
} from "../api/auth.queries";
import { getAuthCopy } from "../auth.constants";

interface SessionsCardProps {
  locale?: AppLocale;
}

export function SessionsCard({ locale = getClientLocale() }: SessionsCardProps) {
  const copy = getAuthCopy(locale).sessions;
  const { data: sessions, isLoading } = useAuthSessions();
  const revoke = useRevokeAuthSession();
  const revokeAll = useRevokeAllAuthSessions();

  return (
    <ElevatedCard>
      <CardContent className="space-y-4 p-4 md:p-5">
        <div>
          <h2 className="text-base font-semibold text-foreground">{copy.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{copy.description}</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="size-5 animate-spin text-muted-foreground" aria-label={copy.loading} />
          </div>
        ) : !sessions || sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground">{copy.empty}</p>
        ) : (
          <ul className="divide-y divide-border rounded-lg border border-border">
            {sessions.map((session) => (
              <li
                key={session.id}
                className="flex flex-wrap items-center justify-between gap-3 px-3 py-3 text-sm"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {session.deviceName ?? session.platform ?? "—"}
                    {session.isCurrent ? (
                      <span className="ml-2 text-xs font-normal text-primary">({copy.current})</span>
                    ) : null}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {session.ipAddress ?? "—"}
                    {session.lastUsedAt
                      ? ` · ${formatAbsoluteTime(new Date(session.lastUsedAt), locale)}`
                      : null}
                  </p>
                </div>
                {!session.isCurrent ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={revoke.isPending}
                    onClick={() => revoke.mutate(session.id)}
                  >
                    {copy.revoke}
                  </Button>
                ) : null}
              </li>
            ))}
          </ul>
        )}

        <Button
          type="button"
          variant="outline"
          disabled={revokeAll.isPending || isLoading}
          onClick={() => revokeAll.mutate()}
        >
          {copy.revokeAll}
        </Button>
      </CardContent>
    </ElevatedCard>
  );
}
