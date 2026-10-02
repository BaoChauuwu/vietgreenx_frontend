"use client";

import { ShieldCheck } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { isOrganizationVerified } from "@/entities/organization";
import {
  createSubmitVerificationInputSchema,
  type SubmitVerificationInput,
} from "../model/organization-input.schema";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { useGuardedSubmit } from "@/shared/lib/use-guarded-submit";
import { CardContent } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import { GuardedForm } from "@/shared/ui/guarded-form";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select } from "@/shared/ui/select";
import { SubmitButton } from "@/shared/ui/submit-button";

import {
  useActiveOrganizationId,
  useOrganization,
  useSubmitOrganizationVerification,
} from "../api/organization.queries";
import { getOrganizationCopy } from "../organization.constants";

const DOCUMENT_TYPES = ["business_registration", "cooperative_license"] as const;

interface OrgVerificationCardProps {
  locale?: AppLocale;
}

export function OrgVerificationCard({ locale = getClientLocale() }: OrgVerificationCardProps) {
  const copy = getOrganizationCopy(locale).verification;
  const orgId = useActiveOrganizationId();
  const { data: org } = useOrganization(orgId);
  const { mutateAsync, isPending } = useSubmitOrganizationVerification(orgId);
  const { guardFormEvent, release, isSubmitting } = useGuardedSubmit({ isPending });
  const schema = useMemo(() => createSubmitVerificationInputSchema(locale), [locale]);

  const form = useForm<SubmitVerificationInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      documentType: "business_registration",
      documentFrontUrl: "",
      documentBackUrl: "",
    },
  });

  if (!org || isOrganizationVerified(org.verificationLevel)) return null;

  const onSubmit = guardFormEvent(
    form.handleSubmit(
      async (data) => {
        try {
          await mutateAsync({
            ...data,
            documentBackUrl: data.documentBackUrl?.trim() || undefined,
          });
          form.reset();
        } finally {
          release();
        }
      },
      () => release(),
    ),
  );

  return (
    <ElevatedCard className="border border-sky-500/20 shadow-sm">
      <CardContent className="space-y-4 p-4 md:p-5">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">{copy.title}</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">{copy.description}</p>
          </div>
        </div>

        <GuardedForm
          noValidate
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="doc-type">{copy.documentType}</Label>
            <Select id="doc-type" className="text-foreground" {...form.register("documentType")}>
              {DOCUMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {copy.documentTypes[type]}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="doc-front">{copy.documentFrontUrl}</Label>
            <Input
              id="doc-front"
              type="url"
              placeholder="https://..."
              {...form.register("documentFrontUrl")}
            />
            {form.formState.errors.documentFrontUrl && (
              <p className="text-sm text-destructive">
                {form.formState.errors.documentFrontUrl.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="doc-back">{copy.documentBackUrl}</Label>
            <Input
              id="doc-back"
              type="url"
              placeholder="https://..."
              {...form.register("documentBackUrl")}
            />
          </div>

          <SubmitButton isSubmitting={isSubmitting} className="w-full sm:w-auto">
            {copy.submit}
          </SubmitButton>
        </GuardedForm>
      </CardContent>
    </ElevatedCard>
  );
}
