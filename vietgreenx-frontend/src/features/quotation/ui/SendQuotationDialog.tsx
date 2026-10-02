"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { DollarSign, Loader2, Send } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { GuardedForm } from "@/shared/ui/guarded-form";
import { useGuardedSubmit } from "@/shared/lib/use-guarded-submit";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { getUnitOptions } from "@/shared/i18n/units";
import { createQuotationInputSchema, type CreateQuotationInput } from "@/entities/quotation";
import { useCreateQuotation } from "../api/quotation.queries";
import { QUOTATION_COPY } from "../quotation.constants";

interface SendQuotationDialogProps {
  receiverUserId: string;
  tradePostId?: string;
  productId?: string;
  locale?: AppLocale;
  trigger?: React.ReactNode;
}

interface FormValues {
  offeredPrice: number | string;
  offeredQuantity: number | string;
  unit: string;
  deliveryDate?: string;
  notes?: string;
}

export function SendQuotationDialog({
  receiverUserId,
  tradePostId,
  productId,
  locale = getClientLocale(),
  trigger,
}: SendQuotationDialogProps) {
  const t = QUOTATION_COPY[locale];
  const createQuotation = useCreateQuotation(locale);
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      offeredPrice: "",
      offeredQuantity: "",
      unit: "kg",
      deliveryDate: "",
      notes: "",
    },
  });

  const { guardFormEvent, release, isSubmitting } = useGuardedSubmit({
    isPending: createQuotation.isPending,
  });

  const onSubmit = guardFormEvent(
    form.handleSubmit(
      async (values) => {
        try {
          const priceNum = Number(values.offeredPrice);
          const qtyNum = Number(values.offeredQuantity);
          const selectedUnit = values.unit.trim() || "kg";
          const deliveryDateVal = values.deliveryDate?.trim();
          const notesVal = values.notes?.trim();

          const payload: CreateQuotationInput = {
            receiverUserId,
            tradePostId: tradePostId || undefined,
            productId: productId || undefined,
            offeredPrice: priceNum,
            priceUnit: `${locale === "en" ? "VND" : "VNĐ"}/${selectedUnit}`,
            quantity: qtyNum,
            quantityUnit: selectedUnit,
            notes: notesVal || undefined,
            deliveryTerms: deliveryDateVal
              ? locale === "en"
                ? `Delivery on ${deliveryDateVal}`
                : `Giao ngày ${deliveryDateVal}`
              : undefined,
          };

          const validation = createQuotationInputSchema.safeParse(payload);
          if (!validation.success) {
            return;
          }

          await createQuotation.mutateAsync(validation.data);
          setOpen(false);
          form.reset();
        } finally {
          release();
        }
      },
      () => release(),
    ),
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" className="gap-1.5 font-semibold">
            <DollarSign className="size-4" />
            {t.actions.send}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t.modal.sendTitle}</DialogTitle>
        </DialogHeader>

        <GuardedForm
          onSubmit={onSubmit}
          isSubmitting={isSubmitting || createQuotation.isPending}
          className="space-y-4 pt-2"
        >
          <p className="text-xs text-muted-foreground">{t.modal.sendDescription}</p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-foreground">
                {t.labels.offeredPrice} ({locale === "en" ? "VND" : "VNĐ"})*
              </label>
              <Input
                type="number"
                min={1}
                required
                placeholder={t.modal.offeredPricePlaceholder}
                {...form.register("offeredPrice")}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-foreground">
                {t.labels.offeredQuantity}*
              </label>
              <div className="flex gap-1.5">
                <Input
                  type="number"
                  min={1}
                  required
                  placeholder={t.modal.offeredQuantityPlaceholder}
                  {...form.register("offeredQuantity")}
                  className="flex-1"
                />
                <select
                  {...form.register("unit")}
                  className="h-10 cursor-pointer rounded-md border border-input bg-background px-2.5 py-1 text-xs font-semibold text-foreground outline-none ring-offset-background transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {getUnitOptions(locale).map((u) => (
                    <option key={u.value} value={u.value}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-foreground">
              {t.labels.deliveryDate}
            </label>
            <Input type="date" {...form.register("deliveryDate")} />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-foreground">
              {t.labels.notes}
            </label>
            <Textarea
              placeholder={t.modal.notesPlaceholder}
              rows={3}
              className="resize-none"
              {...form.register("notes")}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
              {t.actions.cancel}
            </Button>
            <Button
              type="submit"
              size="sm"
              className="gap-1.5 font-semibold"
              disabled={isSubmitting || createQuotation.isPending}
            >
              {isSubmitting || createQuotation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              {t.actions.submit}
            </Button>
          </div>
        </GuardedForm>
      </DialogContent>
    </Dialog>
  );
}
