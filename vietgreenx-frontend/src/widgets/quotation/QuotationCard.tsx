"use client";

import { useState } from "react";
import { Check, X, Undo2, Calendar, Package, DollarSign, Loader2 } from "lucide-react";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import { CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { resolveMediaUrl } from "@/shared/lib/resolve-media-url";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { useUser } from "@/shared/auth";
import type { QuotationItem } from "@/entities/quotation";
import {
  QUOTATION_COPY,
  useAcceptQuotation,
  useRejectQuotation,
  useWithdrawQuotation,
} from "@/features/quotation";

interface QuotationCardProps {
  quotation: QuotationItem;
  locale?: AppLocale;
}

export function QuotationCard({ quotation, locale = getClientLocale() }: QuotationCardProps) {
  const t = QUOTATION_COPY[locale];
  const { user } = useUser();

  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionNote, setRejectionNote] = useState("");

  const acceptMutation = useAcceptQuotation(locale);
  const rejectMutation = useRejectQuotation(locale);
  const withdrawMutation = useWithdrawQuotation(locale);

  const senderId = quotation.sender?.id || quotation.senderUserId;
  const receiverId = quotation.receiver?.id || quotation.receiverUserId;

  const isSender = Boolean(user?.id && user.id === senderId);
  const isReceiver = Boolean(user?.id && user.id === receiverId);

  const party = isSender ? quotation.receiver : quotation.sender;
  const partyName = party?.displayName?.trim() || party?.username || t.labels.member;
  const partyAvatar = resolveMediaUrl(party?.avatarUrl);

  const isPending = quotation.status === "pending";
  const statusKey =
    (quotation.status as keyof typeof t.status) in t.status
      ? (quotation.status as keyof typeof t.status)
      : "pending";

  const statusBadgeMap: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400",
    accepted: "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400",
    rejected: "bg-rose-500/10 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400",
    withdrawn: "bg-slate-500/10 text-slate-700 dark:bg-slate-900/60 dark:text-slate-400",
    expired: "bg-slate-500/10 text-slate-700 dark:bg-slate-900/60 dark:text-slate-400",
  };

  const statusBadge = statusBadgeMap[statusKey] || statusBadgeMap.pending;
  const quantityVal = quotation.quantity ?? quotation.offeredQuantity ?? 0;
  const unitVal = quotation.quantityUnit || quotation.unit || "kg";
  const deliveryInfo = quotation.deliveryTerms || quotation.deliveryDate;

  const handleConfirmReject = async () => {
    try {
      await rejectMutation.mutateAsync({
        id: quotation.id,
        rejectionNote: rejectionNote.trim() || undefined,
      });
      setIsRejectDialogOpen(false);
      setRejectionNote("");
    } catch {
      // Handled in mutation
    }
  };

  return (
    <>
      <ElevatedCard className="overflow-hidden rounded-2xl border border-border/80 bg-card p-4 transition-all hover:shadow-md">
        <CardContent className="space-y-3.5 p-0">
          {/* Header: Party Info & Status Badge */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar className="size-10 shrink-0 border border-border">
                {partyAvatar && <AvatarImage src={partyAvatar} alt={partyName} />}
                <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                  {partyName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs text-muted-foreground">
                  {isSender ? t.labels.receiver : t.labels.sender}
                </p>
                <h4 className="text-sm font-bold text-foreground">{partyName}</h4>
              </div>
            </div>

            <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusBadge}`}>
              {t.status[statusKey]}
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-2.5 rounded-xl border border-border/60 bg-muted/30 p-3 text-xs">
            <div className="flex items-center gap-2">
              <DollarSign className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div>
                <span className="text-muted-foreground">{t.labels.offeredPrice}: </span>
                <span className="font-extrabold text-foreground">
                  {quotation.offeredPrice.toLocaleString(locale === "vi" ? "vi-VN" : "en-US")}{" "}
                  {t.labels.currencyUnit}/{unitVal}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Package className="size-4 shrink-0 text-primary" />
              <div>
                <span className="text-muted-foreground">{t.labels.offeredQuantity}: </span>
                <span className="font-extrabold text-foreground">
                  {quantityVal.toLocaleString(locale === "vi" ? "vi-VN" : "en-US")} {unitVal}
                </span>
              </div>
            </div>

            {deliveryInfo && (
              <div className="col-span-2 flex items-center gap-2">
                <Calendar className="size-4 shrink-0 text-muted-foreground" />
                <div>
                  <span className="text-muted-foreground">{t.labels.deliveryDate}: </span>
                  <span className="font-semibold text-foreground">{deliveryInfo}</span>
                </div>
              </div>
            )}
          </div>

          {/* Sender Notes */}
          {quotation.notes && (
            <p className="rounded-lg bg-accent/40 p-2.5 text-xs italic leading-relaxed text-foreground/90">
              &quot;{quotation.notes}&quot;
            </p>
          )}

          {/* Rejection Note if Rejected */}
          {quotation.rejectionNote && (
            <div className="rounded-lg border border-rose-200 bg-rose-50/50 p-2.5 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
              <span className="font-semibold">{t.labels.rejectionReason}</span>
              <span>{quotation.rejectionNote}</span>
            </div>
          )}

          {/* Actions Row */}
          {isPending && (
            <div className="flex justify-end gap-2 pt-1">
              {isReceiver && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1 border-rose-200 text-xs font-semibold text-rose-700 hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-400"
                    onClick={() => setIsRejectDialogOpen(true)}
                    disabled={rejectMutation.isPending}
                  >
                    {rejectMutation.isPending ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <X className="size-3.5" />
                    )}
                    {t.actions.reject}
                  </Button>

                  <Button
                    size="sm"
                    className="h-8 gap-1 bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-700 dark:bg-emerald-700"
                    onClick={() => acceptMutation.mutate(quotation.id)}
                    disabled={acceptMutation.isPending}
                  >
                    {acceptMutation.isPending ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Check className="size-3.5" />
                    )}
                    {t.actions.accept}
                  </Button>
                </>
              )}

              {isSender && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1 text-xs font-semibold"
                  onClick={() => withdrawMutation.mutate(quotation.id)}
                  disabled={withdrawMutation.isPending}
                >
                  {withdrawMutation.isPending ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Undo2 className="size-3.5" />
                  )}
                  {t.actions.withdraw}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </ElevatedCard>

      {/* Reject Reason Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.rejectModal.title}</DialogTitle>
            <DialogDescription>{t.rejectModal.description}</DialogDescription>
          </DialogHeader>

          <div className="py-2">
            <Textarea
              placeholder={t.rejectModal.placeholder}
              value={rejectionNote}
              onChange={(e) => setRejectionNote(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              variant="ghost"
              onClick={() => setIsRejectDialogOpen(false)}
              disabled={rejectMutation.isPending}
            >
              {t.rejectModal.cancel}
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmReject}
              disabled={rejectMutation.isPending}
              className="gap-2 font-semibold"
            >
              {rejectMutation.isPending && <Loader2 className="size-4 animate-spin" />}
              {t.rejectModal.confirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
