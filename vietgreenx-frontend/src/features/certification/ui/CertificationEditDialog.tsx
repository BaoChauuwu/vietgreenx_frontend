"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import type { Certification } from "@/entities/certification";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { useGuardedSubmit } from "@/shared/lib/use-guarded-submit";
import { toastService } from "@/shared/lib/toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { GuardedForm } from "@/shared/ui/guarded-form";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select } from "@/shared/ui/select";
import { SubmitButton } from "@/shared/ui/submit-button";

import { useUpdateCertification } from "../api/certification.queries";
import { CERTIFICATION_ACCEPT, CERTIFICATION_TYPES, getCertificationCopy } from "../certification.constants";
import { uploadCertDocument } from "../lib/upload-cert-document";
import {
  certificationFormToUpdateInput,
  certificationToEditFormValues,
  createUpdateCertificationFormSchema,
  type UpdateCertificationFormInput,
} from "../model/certification-input.schema";

interface CertificationEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certification: Certification | null;
  greenProfileId: string;
  locale?: AppLocale;
}

export function CertificationEditDialog({
  open,
  onOpenChange,
  certification,
  greenProfileId,
  locale = getClientLocale(),
}: CertificationEditDialogProps) {
  const copy = getCertificationCopy(locale);
  const formCopy = copy.editForm;
  const schema = useMemo(() => createUpdateCertificationFormSchema(locale), [locale]);
  const { mutate, isPending } = useUpdateCertification(greenProfileId);
  const form = useForm<UpdateCertificationFormInput>({
    resolver: zodResolver(schema),
    defaultValues: certification
      ? certificationToEditFormValues(certification)
      : {
          certType: "vietgap",
          certNumber: "",
          issuingAuthority: "",
          issueDate: "",
          expiryDate: "",
          documentFile: undefined,
        },
  });
  const isDirty = form.formState.isDirty;
  const { guardFormEvent, release, isSubmitting, isDisabled } = useGuardedSubmit({
    isPending,
    enabled: isDirty,
  });

  useEffect(() => {
    if (!open || !certification) return;
    form.reset(certificationToEditFormValues(certification));
  }, [open, certification, form]);

  const onSubmit = guardFormEvent(
    form.handleSubmit(
      async (data) => {
        if (!certification) {
          release();
          return;
        }

        try {
          const newDocumentUrl =
            data.documentFile instanceof File
              ? await uploadCertDocument(data.documentFile)
              : undefined;

          mutate(
            {
              id: certification.id,
              input: certificationFormToUpdateInput(data, newDocumentUrl),
            },
            {
              onSuccess: () => onOpenChange(false),
              onSettled: () => release(),
            },
          );
        } catch {
          toastService.error(copy.toast.uploadError);
          release();
        }
      },
      () => release(),
    ),
  );

  const documentError = form.formState.errors.documentFile?.message;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{formCopy.title}</DialogTitle>
          <DialogDescription>{formCopy.subtitle}</DialogDescription>
        </DialogHeader>

        <GuardedForm noValidate onSubmit={onSubmit} isSubmitting={isSubmitting} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="edit-cert-type">{copy.form.fields.certType}</Label>
            <Select
              id="edit-cert-type"
              className="text-foreground"
              {...form.register("certType")}
            >
              {CERTIFICATION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {copy.types[type]}
                </option>
              ))}
            </Select>
            {form.formState.errors.certType ? (
              <p className="text-sm text-destructive">{form.formState.errors.certType.message}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-cert-number">{copy.form.fields.certNumber}</Label>
            <Input id="edit-cert-number" {...form.register("certNumber")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-issuing-authority">{copy.form.fields.issuingAuthority}</Label>
            <Input id="edit-issuing-authority" {...form.register("issuingAuthority")} />
            {form.formState.errors.issuingAuthority ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.issuingAuthority.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="edit-issue-date">{copy.form.fields.issueDate}</Label>
              <Input id="edit-issue-date" type="date" {...form.register("issueDate")} />
              {form.formState.errors.issueDate ? (
                <p className="text-sm text-destructive">{form.formState.errors.issueDate.message}</p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-expiry-date">{copy.form.fields.expiryDate}</Label>
              <Input id="edit-expiry-date" type="date" {...form.register("expiryDate")} />
              {form.formState.errors.expiryDate ? (
                <p className="text-sm text-destructive">{form.formState.errors.expiryDate.message}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-cert-document">{copy.form.fields.document}</Label>
            <Input
              id="edit-cert-document"
              type="file"
              accept={CERTIFICATION_ACCEPT}
              onChange={(event) => {
                const file = event.target.files?.[0];
                form.setValue("documentFile", file, { shouldValidate: true, shouldDirty: true });
              }}
            />
            <p className="text-xs text-muted-foreground">{formCopy.documentOptionalHint}</p>
            {documentError ? <p className="text-sm text-destructive">{documentError}</p> : null}
          </div>

          <SubmitButton
            isSubmitting={isSubmitting}
            disabled={isDisabled}
            className="w-full sm:w-auto"
          >
            {formCopy.submit}
          </SubmitButton>
        </GuardedForm>
      </DialogContent>
    </Dialog>
  );
}
