"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { useGuardedSubmit } from "@/shared/lib/use-guarded-submit";
import { ROUTES } from "@/shared/routing";
import { Button } from "@/shared/ui/button";
import { CardContent } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";

import { useAcceptOrganizationInvite, useDeclineOrganizationInvite } from "../api/organization.queries";
import { getOrganizationCopy } from "../organization.constants";

interface AcceptInviteScreenProps {
  locale?: AppLocale;
}

export function AcceptInviteScreen({ locale = getClientLocale() }: AcceptInviteScreenProps) {
  const copy = getOrganizationCopy(locale).acceptInvite;
  const token = useSearchParams().get("token")?.trim() ?? "";

  const { mutate: accept, isPending: isAccepting } = useAcceptOrganizationInvite();
  const { mutate: decline, isPending: isDeclining } = useDeclineOrganizationInvite();
  const { runGuarded, release, isSubmitting } = useGuardedSubmit({
    isPending: isAccepting || isDeclining,
  });

  if (!token) {
    return (
      <ElevatedCard>
        <CardContent className="space-y-4 py-10 text-center">
          <p className="text-sm text-muted-foreground">{copy.missingToken}</p>
          <Button asChild variant="outline">
            <Link href={ROUTES.feed}>{copy.backToFeed}</Link>
          </Button>
        </CardContent>
      </ElevatedCard>
    );
  }

  const busy = isSubmitting || isAccepting || isDeclining;

  return (
    <ElevatedCard>
      <CardContent className="space-y-5 p-6 text-center sm:p-8">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{copy.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{copy.description}</p>
        </div>

        <div className="flex flex-col justify-center gap-2 sm:flex-row">
          <Button
            type="button"
            disabled={busy}
            onClick={() =>
              runGuarded(() =>
                accept(
                  { token },
                  {
                    onSettled: () => release(),
                  },
                ),
              )
            }
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : copy.accept}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() =>
              runGuarded(() =>
                decline(
                  { token },
                  {
                    onSettled: () => release(),
                  },
                ),
              )
            }
          >
            {copy.decline}
          </Button>
        </div>
      </CardContent>
    </ElevatedCard>
  );
}
