"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";

import { useProvinces } from "@/entities/location/api/location.queries";
import { Combobox } from "@/shared/ui/combobox";

import { organizationTypeSchema, type OrganizationType } from "@/entities/organization";
import {
  createCreateOrganizationInputSchema,
  type CreateOrganizationInput,
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
import { Textarea } from "@/shared/ui/textarea";

import { useCreateOrganization } from "../api/organization.queries";
import { getOrganizationCopy } from "../organization.constants";

const ORG_TYPE_OPTIONS = organizationTypeSchema.options;

interface OrgCreateFormProps {
  locale?: AppLocale;
}

export function OrgCreateForm({ locale = getClientLocale() }: OrgCreateFormProps) {
  const copy = getOrganizationCopy(locale).create;
  const schema = useMemo(() => createCreateOrganizationInputSchema(locale), [locale]);
  const { mutateAsync, isPending } = useCreateOrganization();
  const { guardFormEvent, release, isSubmitting } = useGuardedSubmit({ isPending });

  const form = useForm<CreateOrganizationInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      orgType: "cooperative",
      taxCode: undefined,
      province: undefined,
      provinceCode: undefined,
      address: undefined,
      description: undefined,
    },
  });

  const onSubmit = guardFormEvent(
    form.handleSubmit(
      async (data) => {
        try {
          await mutateAsync(data);
        } finally {
          release();
        }
      },
      () => release(),
    ),
  );

  const { data: provinces, isLoading: isLoadingProvinces } = useProvinces();
  const provinceOptions = useMemo(() => {
    return (provinces || []).map((p) => ({ value: String(p.code), label: p.name }));
  }, [provinces]);

  return (
    <ElevatedCard>
      <CardContent className="space-y-5 p-4 md:p-5">
        <div>
          <h2 className="text-lg font-semibold text-foreground">{copy.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{copy.subtitle}</p>
        </div>

        <GuardedForm
          noValidate
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="org-name">{copy.fields.name}</Label>
            <Input id="org-name" autoComplete="organization" {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="org-type">{copy.fields.orgType}</Label>
            <Select id="org-type" className="text-foreground" {...form.register("orgType")}>
              {ORG_TYPE_OPTIONS.map((type) => (
                <option key={type} value={type}>
                  {copy.orgTypes[type as OrganizationType]}
                </option>
              ))}
            </Select>
            {form.formState.errors.orgType && (
              <p className="text-sm text-destructive">{form.formState.errors.orgType.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="org-tax">{copy.fields.taxId}</Label>
            <Input id="org-tax" {...form.register("taxCode")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="org-province">{copy.fields.province}</Label>
            <Controller
              control={form.control}
              name="provinceCode"
              render={({ field }) => (
                <Combobox
                  id="org-province"
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
                      form.setValue("province", "", { shouldValidate: true, shouldDirty: true });
                    }
                  }}
                  placeholder={copy.placeholders.province}
                  searchPlaceholder={copy.placeholders.search}
                  emptyText={copy.placeholders.empty}
                />
              )}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="org-address">{copy.fields.address}</Label>
            <Input id="org-address" {...form.register("address")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="org-description">{copy.fields.description}</Label>
            <Textarea
              id="org-description"
              rows={3}
              className="min-h-[80px] resize-none"
              {...form.register("description")}
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
