"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Loader2, Pencil } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";

import { useProvinces } from "@/entities/location/api/location.queries";
import { Combobox } from "@/shared/ui/combobox";

import {
  organizationTypeSchema,
  type Organization,
  type OrganizationType,
} from "@/entities/organization";
import {
  createCreateOrganizationInputSchema,
  type CreateOrganizationInput,
} from "../model/organization-input.schema";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { useGuardedSubmit } from "@/shared/lib/use-guarded-submit";
import { ROUTES } from "@/shared/routing";
import { Button } from "@/shared/ui/button";
import { CardContent } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import { GuardedForm } from "@/shared/ui/guarded-form";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { ModulePageHeader } from "@/shared/ui/module-page-header";
import { Select } from "@/shared/ui/select";
import { SubmitButton } from "@/shared/ui/submit-button";
import { Textarea } from "@/shared/ui/textarea";

import {
  useActiveOrganizationId,
  useOrganization,
  useUpdateOrganization,
} from "../api/organization.queries";
import { getOrganizationCopy } from "../organization.constants";
import { OrgDeleteDialog } from "./OrgDeleteDialog";
import { OrgSubNav } from "./OrgSubNav";

const ORG_TYPE_OPTIONS = organizationTypeSchema.options;

type OrgEditFormInput = CreateOrganizationInput;

function organizationToFormValues(
  org: Organization,
  provinces?: Array<{ code: number; name: string }>,
): OrgEditFormInput {
  let pCode = org.provinceCode ?? undefined;
  if (pCode == null && org.province && provinces) {
    const matched = provinces.find((p) => p.name === org.province);
    if (matched) {
      pCode = matched.code;
    }
  }

  return {
    name: org.name,
    orgType: org.orgType,
    taxCode: org.taxCode ?? undefined,
    province: org.province ?? undefined,
    provinceCode: pCode,
    address: org.address ?? undefined,
    description: org.description ?? undefined,
  };
}

interface OrgEditFormProps {
  locale?: AppLocale;
}

export function OrgEditForm({ locale = getClientLocale() }: OrgEditFormProps) {
  const allCopy = getOrganizationCopy(locale);
  const copy = allCopy.edit;
  const deleteCopy = allCopy.delete;
  const orgTypes = allCopy.create.orgTypes;
  const orgId = useActiveOrganizationId();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { data: org, isLoading, isError } = useOrganization(orgId);
  const { mutateAsync, isPending } = useUpdateOrganization(orgId);
  const schema = useMemo(() => createCreateOrganizationInputSchema(locale), [locale]);

  const { data: provinces, isLoading: isLoadingProvinces } = useProvinces();
  const provinceOptions = useMemo(() => {
    return (provinces || []).map((p) => ({ value: String(p.code), label: p.name }));
  }, [provinces]);

  const form = useForm<OrgEditFormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      orgType: "cooperative",
    },
  });

  const isDirty = form.formState.isDirty;
  const { guardFormEvent, release, isSubmitting, isDisabled } = useGuardedSubmit({
    isPending,
    enabled: isDirty,
  });

  useEffect(() => {
    if (!org) return;
    form.reset(organizationToFormValues(org, provinces));
  }, [org, provinces, form]);

  const onSubmit = guardFormEvent(
    form.handleSubmit(
      async (data) => {
        try {
          const updated = await mutateAsync(data);
          form.reset(organizationToFormValues(updated, provinces));
        } finally {
          release();
        }
      },
      () => release(),
    ),
  );

  if (!orgId) {
    return (
      <ElevatedCard>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          {allCopy.dashboard.emptyDescription}
        </CardContent>
      </ElevatedCard>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" aria-label={copy.loading} />
      </div>
    );
  }

  if (isError || !org) {
    return (
      <ElevatedCard>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          {copy.loadError}
        </CardContent>
      </ElevatedCard>
    );
  }

  return (
    <div className="w-full">
      <ElevatedCard className="overflow-hidden border border-border/60 shadow-sm">
        {/* Header strip */}
        <div className="flex items-center gap-4 border-b border-border/50 px-5 pb-4 pt-5">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/30">
            <Pencil className="size-5" aria-hidden />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold leading-tight tracking-tight text-foreground">
              {copy.title}
            </h1>
            <p className="mt-0.5 text-xs text-muted-foreground">{copy.subtitle}</p>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="px-5 pt-1">
          <OrgSubNav locale={locale} active="edit" />
        </div>

        <CardContent className="space-y-6 p-5">
          <GuardedForm
            noValidate
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Name (Full Width) */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="edit-name">{copy.fields.name}</Label>
                <Input id="edit-name" autoComplete="organization" {...form.register("name")} />
                {form.formState.errors.name && (
                  <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>

              {/* Type */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-type">{copy.fields.orgType}</Label>
                <Select id="edit-type" className="text-foreground" {...form.register("orgType")}>
                  {ORG_TYPE_OPTIONS.map((type) => (
                    <option key={type} value={type}>
                      {orgTypes[type as OrganizationType]}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Tax ID */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-tax">{copy.fields.taxId}</Label>
                <Input id="edit-tax" {...form.register("taxCode")} />
              </div>

              {/* Province */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-province">{copy.fields.province}</Label>
                <Controller
                  control={form.control}
                  name="provinceCode"
                  render={({ field }) => (
                    <Combobox
                      id="edit-province"
                      options={provinceOptions}
                      value={field.value ? String(field.value) : ""}
                      loading={isLoadingProvinces}
                      onValueChange={(val) => {
                        field.onChange(val);
                        const selectedName = provinceOptions.find((o) => o.value === val)?.label;
                        if (selectedName) {
                          form.setValue("province", selectedName, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        } else {
                          form.setValue("province", "", {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }
                      }}
                      placeholder={copy.placeholders.province}
                      searchPlaceholder={copy.placeholders.search}
                      emptyText={copy.placeholders.empty}
                    />
                  )}
                />
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-address">{copy.fields.address}</Label>
                <Input id="edit-address" {...form.register("address")} />
              </div>

              {/* Description (Full Width) */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="edit-description">{copy.fields.description}</Label>
                <Textarea
                  id="edit-description"
                  rows={4}
                  className="min-h-[96px] resize-none"
                  {...form.register("description")}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap justify-end gap-2 border-t border-border/60 pt-4">
              <Button type="button" variant="ghost" size="sm" asChild>
                <Link href={ROUTES.org}>{copy.cancel}</Link>
              </Button>
              <SubmitButton isSubmitting={isSubmitting} disabled={isDisabled} size="sm">
                {copy.save}
              </SubmitButton>
            </div>
          </GuardedForm>

          {/* Integrated Danger Zone */}
          <div className="mt-6 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-semibold text-destructive">{deleteCopy.title}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{deleteCopy.description}</p>
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="w-fit shrink-0"
                onClick={() => setDeleteOpen(true)}
              >
                {deleteCopy.action}
              </Button>
            </div>
          </div>
        </CardContent>
      </ElevatedCard>

      <OrgDeleteDialog
        orgId={orgId}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        locale={locale}
      />
    </div>
  );
}
