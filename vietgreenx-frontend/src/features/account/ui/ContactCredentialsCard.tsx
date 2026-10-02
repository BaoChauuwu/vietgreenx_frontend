"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";

import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { Button } from "@/shared/ui/button";
import { CardContent } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";

import { useAccountCredentials } from "../api/account.queries";
import { getAccountCopy } from "../account.constants";
import { ChangeEmailDialog } from "./ChangeEmailDialog";
import { ChangePasswordDialog } from "./ChangePasswordDialog";
import { ChangePhoneDialog } from "./ChangePhoneDialog";

interface ContactCredentialsCardProps {
  locale?: AppLocale;
}

export function ContactCredentialsCard({ locale = getClientLocale() }: ContactCredentialsCardProps) {
  const copy = getAccountCopy(locale).contact;
  const { data: credentials, isLoading, isError } = useAccountCredentials();
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [phoneOpen, setPhoneOpen] = useState(false);

  const emailMode = credentials?.email.present ? "change" : "add";
  const phoneMode = credentials?.phone.present ? "change" : "add";

  return (
    <>
      <ElevatedCard>
        <CardContent className="space-y-4 p-4 md:p-5">
          <div>
            <h2 className="text-base font-semibold text-foreground">{copy.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{copy.description}</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="size-5 animate-spin text-muted-foreground" aria-label={copy.loading} />
            </div>
          ) : isError || !credentials ? (
            <p className="text-sm text-muted-foreground">{copy.loadError}</p>
          ) : (
            <dl className="divide-y divide-border rounded-lg border border-border text-sm">
              <ContactRow
                label={copy.emailLabel}
                value={credentials.email.present ? credentials.email.masked : copy.notLinked}
                hint={credentials.email.present && !credentials.email.verified ? copy.unverified : undefined}
                actionLabel={emailMode === "add" ? copy.addEmail : copy.changeEmail}
                onAction={() => setEmailOpen(true)}
              />
              <ContactRow
                label={copy.phoneLabel}
                value={credentials.phone.present ? credentials.phone.masked : copy.notLinked}
                hint={credentials.phone.present && !credentials.phone.verified ? copy.unverified : undefined}
                actionLabel={phoneMode === "add" ? copy.addPhone : copy.changePhone}
                onAction={() => setPhoneOpen(true)}
              />
              <ContactRow
                label={copy.passwordLabel}
                value={copy.passwordMasked}
                actionLabel={copy.changePassword}
                onAction={() => setPasswordOpen(true)}
              />
            </dl>
          )}
        </CardContent>
      </ElevatedCard>

      {credentials ? (
        <>
          <ChangePasswordDialog
            open={passwordOpen}
            onOpenChange={setPasswordOpen}
            credentials={credentials}
            locale={locale}
          />
          <ChangeEmailDialog
            open={emailOpen}
            onOpenChange={setEmailOpen}
            mode={emailMode}
            locale={locale}
          />
          <ChangePhoneDialog
            open={phoneOpen}
            onOpenChange={setPhoneOpen}
            mode={phoneMode}
            locale={locale}
          />
        </>
      ) : null}
    </>
  );
}

interface ContactRowProps {
  label: string;
  value: string | null;
  hint?: string;
  actionLabel: string;
  onAction: () => void;
}

function ContactRow({ label, value, hint, actionLabel, onAction }: ContactRowProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-3">
      <div className="min-w-0">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="font-medium text-foreground">{value ?? "—"}</dd>
        {hint ? <p className="text-xs text-amber-600 dark:text-amber-500">{hint}</p> : null}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={onAction}>
        {actionLabel}
      </Button>
    </div>
  );
}
