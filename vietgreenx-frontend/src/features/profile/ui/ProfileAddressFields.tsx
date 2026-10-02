"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { type Control, Controller, type UseFormSetValue, useWatch } from "react-hook-form";

import { findUnitByName, toLocationOptions } from "@/entities/location";
import type { AppLocale } from "@/shared/i18n/locale";
import { Combobox } from "@/shared/ui/combobox";
import { Label } from "@/shared/ui/label";

import {
  useProvinces,
  useWardsByProvince,
  useDistrictsByProvince,
} from "@/entities/location/api/location.queries";

import type { ProfileEditFormInput } from "../model/profile-edit.schema";
import { getProfileCopy } from "../profile.constants";

interface ProfileAddressFieldsProps {
  locale: AppLocale;
  control: Control<ProfileEditFormInput>;
  setValue: UseFormSetValue<ProfileEditFormInput>;
}

export function ProfileAddressFields({ locale, control, setValue }: ProfileAddressFieldsProps) {
  const copy = getProfileCopy(locale).edit.address;
  const provinceCodeStr = useWatch({ control, name: "provinceCode" });
  const wardCodeStr = useWatch({ control, name: "wardCode" });

  const provinceCodeNum = provinceCodeStr ? Number(provinceCodeStr) : undefined;

  const { data: provinces, isLoading: provincesLoading, isError: provincesError } = useProvinces();
  const { data: districts } = useDistrictsByProvince(provinceCodeNum);
  const { data: wards, isLoading: wardsLoading } = useWardsByProvince(provinceCodeNum);

  const provinceOptions = useMemo(() => toLocationOptions(provinces ?? []), [provinces]);
  const wardOptions = useMemo(() => {
    if (!wards) return [];
    const districtMap = new Map(districts?.map((d) => [d.code, d.name]) ?? []);
    return wards.map((w) => {
      const districtName = districtMap.get(w.district_code ?? -1);
      const label = districtName ? `${w.name} - ${districtName}` : w.name;
      return { value: String(w.code), label };
    });
  }, [wards, districts]);

  const wardLegacy = Boolean(
    wardCodeStr && wards?.length && !wardOptions.find((o) => o.value === String(wardCodeStr)),
  );

  if (provincesError) {
    return <p className="text-sm text-destructive">{copy.loadError}</p>;
  }

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium">{copy.locationTitle}</legend>
      <p className="text-xs leading-relaxed text-muted-foreground">{copy.mergerNotice}</p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="province">{copy.province}</Label>
          <Controller
            control={control}
            name="provinceCode"
            render={({ field, fieldState }) => (
              <>
                <Combobox
                  id="province"
                  options={provinceOptions}
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(next) => {
                    field.onChange(next);
                    setValue("wardCode", undefined);
                    setValue("ward", "");
                    const selectedName = provinceOptions.find((o) => o.value === next)?.label;
                    if (selectedName) {
                      setValue("province", selectedName, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    } else {
                      setValue("province", "", { shouldValidate: true, shouldDirty: true });
                    }
                  }}
                  placeholder={copy.provincePlaceholder}
                  searchPlaceholder={copy.searchPlaceholder}
                  emptyText={copy.emptyText}
                  loading={provincesLoading}
                  legacyHint={copy.legacyHint}
                />
                {fieldState.error?.message ? (
                  <p className="text-sm text-destructive">{fieldState.error.message}</p>
                ) : null}
              </>
            )}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="ward">{copy.ward}</Label>
          <Controller
            control={control}
            name="wardCode"
            render={({ field, fieldState }) => (
              <>
                <Combobox
                  id="ward"
                  options={wardOptions}
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(next) => {
                    field.onChange(next);
                    const selectedName = wardOptions.find((o) => o.value === next)?.label;
                    if (selectedName) {
                      setValue("ward", selectedName, { shouldValidate: true, shouldDirty: true });
                    } else {
                      setValue("ward", "", { shouldValidate: true, shouldDirty: true });
                    }
                  }}
                  placeholder={copy.wardPlaceholder}
                  searchPlaceholder={copy.searchPlaceholder}
                  emptyText={copy.emptyText}
                  disabled={!provinceCodeNum}
                  loading={Boolean(provinceCodeNum) && wardsLoading}
                  legacyHint={wardLegacy ? copy.legacyHint : undefined}
                />
                {fieldState.error?.message ? (
                  <p className="text-sm text-destructive">{fieldState.error.message}</p>
                ) : null}
              </>
            )}
          />
        </div>
      </div>

      {provincesLoading ? (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="size-3 animate-spin" />
          {copy.loading}
        </p>
      ) : null}
    </fieldset>
  );
}
