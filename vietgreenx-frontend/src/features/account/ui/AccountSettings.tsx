"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";

import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { Button } from "@/shared/ui/button";
import { CardContent } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import { ModulePageHeader } from "@/shared/ui/module-page-header";

import { useExportPersonalData } from "../api/account.queries";
import { getAccountCopy } from "../account.constants";
import { ContactCredentialsCard } from "./ContactCredentialsCard";
import { DeleteAccountDialog } from "./DeleteAccountDialog";

interface AccountSettingsProps {
  locale?: AppLocale;
}

export function AccountSettings({ locale = getClientLocale() }: AccountSettingsProps) {
  const copy = getAccountCopy(locale);
  const exportData = useExportPersonalData();
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div className="space-y-4">
      <ModulePageHeader title={copy.title} description={copy.subtitle} />

      <ContactCredentialsCard locale={locale} />

      <ElevatedCard>
        <CardContent className="space-y-3 p-4 md:p-5">
          <h2 className="text-base font-semibold text-foreground">{copy.export.title}</h2>
          <p className="text-sm text-muted-foreground">{copy.export.description}</p>
          <Button
            type="button"
            variant="outline"
            disabled={exportData.isPending}
            onClick={() => exportData.mutate()}
          >
            {exportData.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {copy.export.loading}
              </>
            ) : (
              copy.export.action
            )}
          </Button>
        </CardContent>
      </ElevatedCard>

      <ElevatedCard>
        <CardContent className="space-y-3 p-4 md:p-5">
          <h2 className="text-base font-semibold text-foreground">{copy.delete.title}</h2>
          <p className="text-sm text-muted-foreground">{copy.delete.description}</p>
          <Button type="button" variant="destructive" onClick={() => setDeleteOpen(true)}>
            {copy.delete.action}
          </Button>
        </CardContent>
      </ElevatedCard>

      <DeleteAccountDialog open={deleteOpen} onOpenChange={setDeleteOpen} locale={locale} />
    </div>
  );
}
