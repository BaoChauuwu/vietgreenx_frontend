"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { CERTIFICATION_ACCEPT, CERTIFICATION_TYPES, getCertificationCopy } from "../certification.constants";
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

import { useCreateCertification } from "../api/certification.queries";
import { uploadCertDocument } from "../lib/upload-cert-document";
import {
  certificationFormToCreateInput,
  createCreateCertificationFormSchema,
  type CreateCertificationFormInput,
} from "../model/certification-input.schema";

interface CertificationCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  greenProfileId: string;
  locale?: AppLocale;
}

export function CertificationCreateDialog({
  open,
  onOpenChange,
  greenProfileId,
  locale = getClientLocale(),
}: CertificationCreateDialogProps) {
  const copy = getCertificationCopy(locale);
  const formCopy = copy.form;
  const schema = useMemo(() => createCreateCertificationFormSchema(locale), [locale]);
  const { mutate, isPending } = useCreateCertification(greenProfileId);
  const { guardFormEvent, release, isSubmitting } = useGuardedSubmit({ isPending });

  const form = useForm<CreateCertificationFormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      greenProfileId,
      certType: "vietgap",
      certNumber: "",
      issuingAuthority: "",
      issueDate: "",
      expiryDate: "",
      documentFile: undefined as unknown as File,
    },
  });

  useEffect(() => {
    form.setValue("greenProfileId", greenProfileId);
  }, [greenProfileId, form]);

  useEffect(() => {
    if (!open) {
      form.reset({
        greenProfileId,
        certType: "vietgap",
        certNumber: "",
        issuingAuthority: "",
        issueDate: "",
        expiryDate: "",
        documentFile: undefined as unknown as File,
      });
    }
  }, [open, greenProfileId, form]);

  const onSubmit = guardFormEvent(
    form.handleSubmit(
      async (data) => {
        try {
          const storageKey = await uploadCertDocument(data.documentFile);
          mutate(certificationFormToCreateInput(data, storageKey), {
            onSuccess: () => onOpenChange(false),
            onSettled: () => release(),
          });
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
            <Label htmlFor="cert-type">{formCopy.fields.certType}</Label>
            <Select
              id="cert-type"
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
            <Label htmlFor="cert-number">{formCopy.fields.certNumber}</Label>
            <Input id="cert-number" {...form.register("certNumber")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="issuing-authority">{formCopy.fields.issuingAuthority}</Label>
            <Input id="issuing-authority" {...form.register("issuingAuthority")} />
            {form.formState.errors.issuingAuthority ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.issuingAuthority.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="issue-date">{formCopy.fields.issueDate}</Label>
              <Input id="issue-date" type="date" {...form.register("issueDate")} />
              {form.formState.errors.issueDate ? (
                <p className="text-sm text-destructive">{form.formState.errors.issueDate.message}</p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="expiry-date">{formCopy.fields.expiryDate}</Label>
              <Input id="expiry-date" type="date" {...form.register("expiryDate")} />
              {form.formState.errors.expiryDate ? (
                <p className="text-sm text-destructive">{form.formState.errors.expiryDate.message}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cert-document">{formCopy.fields.document}</Label>
            <Input
              id="cert-document"
              type="file"
              accept={CERTIFICATION_ACCEPT}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  form.setValue("documentFile", file, { shouldValidate: true });
                }
              }}
            />
            <p className="text-xs text-muted-foreground">{formCopy.documentHint}</p>
            {documentError ? <p className="text-sm text-destructive">{documentError}</p> : null}
          </div>

          <SubmitButton isSubmitting={isSubmitting} className="w-full sm:w-auto">
            {formCopy.submit}
          </SubmitButton>
        </GuardedForm>
      </DialogContent>
    </Dialog>
  );
}
