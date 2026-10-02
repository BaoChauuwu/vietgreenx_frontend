"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Star } from "lucide-react";

import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { useGuardedSubmit } from "@/shared/lib/use-guarded-submit";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { GuardedForm } from "@/shared/ui/guarded-form";
import {
  createSupplierReviewInputSchema,
  type CreateSupplierReviewInput,
} from "@/entities/supplier";

import { useCreateSupplierReview } from "../api/supplier.queries";
import { SUPPLIER_COPY } from "../supplier.constants";

interface SupplierReviewDialogProps {
  supplierId: string;
  supplierName?: string;
  locale?: AppLocale;
  trigger?: React.ReactNode;
}

export function SupplierReviewDialog({
  supplierId,
  supplierName,
  locale = getClientLocale(),
  trigger,
}: SupplierReviewDialogProps) {
  const t = SUPPLIER_COPY[locale];
  const [open, setOpen] = useState(false);
  const createReview = useCreateSupplierReview(supplierId, locale);

  const form = useForm<CreateSupplierReviewInput>({
    resolver: zodResolver(createSupplierReviewInputSchema),
    defaultValues: {
      rating: 5,
      reviewBody: "",
      orderId: undefined,
    },
  });

  const ratingValue = form.watch("rating") || 5;

  const { guardFormEvent, release, isSubmitting } = useGuardedSubmit({
    isPending: createReview.isPending,
  });

  const onSubmit = guardFormEvent(
    form.handleSubmit(
      async (data) => {
        try {
          const payload: CreateSupplierReviewInput = {
            rating: data.rating,
            reviewBody: data.reviewBody?.trim() || undefined,
            orderId: data.orderId?.trim() || undefined,
          };
          await createReview.mutateAsync(payload);
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
          <Button size="sm" variant="outline" className="gap-1.5 font-semibold">
            <Star className="size-4 fill-amber-500 text-amber-500" />
            {t.actions.writeReview}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {t.actions.writeReview} {supplierName ? `— ${supplierName}` : ""}
          </DialogTitle>
        </DialogHeader>

        <GuardedForm
          onSubmit={onSubmit}
          isSubmitting={isSubmitting || createReview.isPending}
          className="space-y-4 pt-2"
        >
          {/* Star Selection */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-foreground">
              {t.ratingLabel}
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => form.setValue("rating", star)}
                  className="p-1 text-amber-500 transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`size-6 ${
                      star <= ratingValue
                        ? "fill-amber-500 text-amber-500"
                        : "text-muted-foreground/40"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm font-semibold text-foreground">{ratingValue} / 5</span>
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-foreground">
              {t.reviewsTitle}
            </label>
            <Textarea
              placeholder={t.reviewBodyPlaceholder}
              rows={4}
              className="resize-none"
              {...form.register("reviewBody")}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
              {t.actions.cancel}
            </Button>
            <Button
              type="submit"
              size="sm"
              className="gap-1.5 font-semibold"
              disabled={isSubmitting || createReview.isPending}
            >
              {isSubmitting || createReview.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : null}
              {t.actions.submit}
            </Button>
          </div>
        </GuardedForm>
      </DialogContent>
    </Dialog>
  );
}
