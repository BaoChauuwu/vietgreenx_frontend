"use client";

import { useState } from "react";
import { X, UserPlus, CheckCircle2 } from "lucide-react";

import { getClientLocale } from "@/shared/i18n/get-client-locale";
import type { AppLocale } from "@/shared/i18n/locale";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { GuardedForm } from "@/shared/ui/guarded-form";
import { useGuardedSubmit } from "@/shared/lib/use-guarded-submit";
import { getChatCopy } from "../chat.constants";

interface NewConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (targetUserId: string) => Promise<void> | void;
  isCreating?: boolean;
  locale?: AppLocale;
}

export function NewConversationModal({
  isOpen,
  onClose,
  onCreate,
  isCreating = false,
  locale = getClientLocale(),
}: NewConversationModalProps) {
  const copy = getChatCopy(locale).modal;
  const [targetUserId, setTargetUserId] = useState("");

  const { guardFormEvent, release } = useGuardedSubmit({ isPending: isCreating });

  if (!isOpen) return null;

  const onSubmit = guardFormEvent(async () => {
    try {
      if (!targetUserId.trim() || isCreating) return;
      await onCreate(targetUserId.trim());
    } finally {
      release();
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm duration-200 animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2 text-emerald-600">
            <UserPlus className="h-5 w-5" />
            <h3 className="text-lg font-bold text-foreground">{copy.title}</h3>
          </div>
          <Button size="icon" variant="ghost" onClick={onClose} className="h-8 w-8 rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <GuardedForm onSubmit={onSubmit} className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="targetUserId" className="text-xs font-semibold text-foreground">
              {copy.labelUuid}
            </Label>
            <Input
              id="targetUserId"
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              placeholder={copy.placeholderUuid}
              className="h-10 rounded-xl"
            />
          </div>

          {copy.demoPartners.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-muted-foreground">
                {copy.suggestedPartners}
              </span>
              <div className="space-y-2">
                {copy.demoPartners.map((partner: { id: string; name: string; role: string }) => (
                  <div
                    key={partner.id}
                    onClick={() => setTargetUserId(partner.id)}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-2.5 transition-all ${
                      targetUserId === partner.id
                        ? "border-emerald-600 bg-emerald-500/10 dark:bg-emerald-950/40"
                        : "border-border/70 hover:bg-muted/60"
                    }`}
                  >
                    <div>
                      <h5 className="text-xs font-bold text-foreground">{partner.name}</h5>
                      <p className="text-[11px] text-muted-foreground">{partner.role}</p>
                    </div>
                    {targetUserId === partner.id && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 border-t border-border pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl text-xs"
            >
              {copy.cancel}
            </Button>
            <Button
              type="submit"
              disabled={!targetUserId.trim() || isCreating}
              className="rounded-xl bg-emerald-600 px-5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
            >
              {isCreating ? copy.submitting : copy.submit}
            </Button>
          </div>
        </GuardedForm>
      </div>
    </div>
  );
}
