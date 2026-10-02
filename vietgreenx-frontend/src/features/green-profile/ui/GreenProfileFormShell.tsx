"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import type { GreenProfile } from "@/entities/green-profile";
import { useUser } from "@/shared/auth";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { useGuardedSubmit } from "@/shared/lib/use-guarded-submit";
import { useSingleFlightMutation } from "@/shared/lib/use-single-flight-mutation";
import { ROUTES } from "@/shared/routing";
import { Button } from "@/shared/ui/button";
import { CardContent, CardHeader } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import { GuardedForm } from "@/shared/ui/guarded-form";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Combobox } from "@/shared/ui/combobox";
import { LocationMapPicker } from "@/shared/ui/map-picker";
import { SubmitButton } from "@/shared/ui/submit-button";
import { Textarea } from "@/shared/ui/textarea";
import { ModulePageHeader } from "@/shared/ui/module-page-header";
import { Info, MapPin, Sprout, Leaf, Camera, Loader2 } from "lucide-react";

import {
  useProvinces,
  useWardsByProvince,
  useDistrictsByProvince,
} from "@/entities/location/api/location.queries";
import { geocodeService } from "@/entities/location/api/geocode.service";

import { useIsOrgAdmin } from "../lib/use-is-org-admin";

import { useCreateGreenProfile, useUpdateMyGreenProfile } from "../api/green-profile.queries";
import { getGreenProfileCopy } from "../green-profile.constants";
import {
  greenProfileMediaFromProfile,
  splitGreenProfileMediaItems,
  type GreenProfileMediaItem,
} from "../lib/green-profile-media";
import { uploadMedia } from "@/entities/media";
import { resolveMediaUrl } from "@/shared/lib/resolve-media-url";
import { toastService } from "@/shared/lib/toast";
import {
  GREEN_PROFILE_PHOTO_ACCEPT,
  GREEN_PROFILE_PHOTO_MAX_BYTES,
} from "../green-profile.constants";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import {
  createGreenProfileFormSchema,
  greenProfileFormToCreateInput,
  greenProfileFormToUpdateInput,
  type GreenProfileFormInput,
} from "../model/green-profile-input.schema";
import { GreenProfileMediaFields } from "./GreenProfileMediaFields";

interface GreenProfileFormShellProps {
  mode: "create" | "edit";
  profile?: GreenProfile;
  locale?: AppLocale;
  children?: React.ReactNode;
}

function profileToFormValues(profile: GreenProfile): GreenProfileFormInput {
  return {
    profileName: profile.profileName,
    metaDescription: profile.metaDescription ?? "",
    province: profile.province ?? "",
    ward: profile.ward ?? "",
    provinceCode: profile.provinceCode != null ? String(profile.provinceCode) : "",
    wardCode: profile.wardCode != null ? String(profile.wardCode) : "",
    addressDetail: profile.addressDetail ?? "",
    growingZoneCode: profile.growingZoneCode ?? "",
    farmAreaHa: profile.farmAreaHa != null ? String(profile.farmAreaHa) : "",
    annualYieldTonnes: profile.annualYieldTonnes != null ? String(profile.annualYieldTonnes) : "",
    latitude: profile.latitude != null ? String(profile.latitude) : "",
    longitude: profile.longitude != null ? String(profile.longitude) : "",
    photoMediaIds: profile.photoMediaIds,
    videoMediaIds: profile.videoMediaIds,
    avatarMediaId: null, // Only set if a new avatar is uploaded
  };
}

export function GreenProfileFormShell({
  mode,
  profile,
  locale = getClientLocale(),
  children,
}: GreenProfileFormShellProps) {
  const router = useRouter();
  const { user } = useUser();
  const isOrgAdmin = useIsOrgAdmin();
  const orgId = isOrgAdmin ? (user?.orgId ?? undefined) : undefined;

  const copy = getGreenProfileCopy(locale).form;
  const title = mode === "create" ? copy.createTitle : copy.editTitle;
  const subtitle = mode === "create" ? copy.createSubtitle : copy.editSubtitle;
  const cancelHref = ROUTES.greenProfile;
  const schema = useMemo(() => createGreenProfileFormSchema(locale), [locale]);
  const { mutateAsync: createProfile, isPending: isCreating } = useCreateGreenProfile();
  const { mutateAsync: updateProfile, isPending: isUpdating } = useUpdateMyGreenProfile(
    profile?.organizationId,
  );
  const isPending = mode === "create" ? isCreating : isUpdating;

  const [mediaItems, setMediaItems] = useState<GreenProfileMediaItem[]>([]);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);

  const { mutateAsync: uploadAvatar, isPending: isUploadingAvatar } = useSingleFlightMutation<
    { mediaId: string; cdnUrl: string; mimeType: string },
    Error,
    File
  >({
    mutationFn: (file: File) => uploadMedia(file, "avatar"),
  });

  const form = useForm<GreenProfileFormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      profileName: "",
      metaDescription: "",
      province: "",
      ward: "",
      provinceCode: "",
      wardCode: "",
      addressDetail: "",
      growingZoneCode: "",
      farmAreaHa: "",
      annualYieldTonnes: "",
      latitude: "",
      longitude: "",
      avatarMediaId: null,
      photoMediaIds: [],
      videoMediaIds: [],
    },
  });

  const isDirty = form.formState.isDirty;
  const { guardFormEvent, release, isSubmitting, isDisabled } = useGuardedSubmit({
    isPending,
    enabled: mode === "create" || isDirty,
  });

  const selectedProvinceCode = form.watch("provinceCode");
  const selectedWardCode = form.watch("wardCode");
  const currentLat = form.watch("latitude");
  const currentLng = form.watch("longitude");

  const { data: provinces, isLoading: isLoadingProvinces } = useProvinces();
  const provinceOptions = useMemo(() => {
    return (provinces || []).map((p) => ({ value: String(p.code), label: p.name }));
  }, [provinces]);

  const { data: districts } = useDistrictsByProvince(
    selectedProvinceCode ? Number(selectedProvinceCode) : undefined,
  );
  const { data: wards, isLoading: isLoadingWards } = useWardsByProvince(
    selectedProvinceCode ? Number(selectedProvinceCode) : undefined,
  );

  const wardOptions = useMemo(() => {
    if (!wards) return [];
    const districtMap = new Map(districts?.map((d) => [d.code, d.name]) ?? []);
    return wards.map((w) => {
      const districtName = districtMap.get(w.district_code ?? -1);
      const label = districtName ? `${w.name} - ${districtName}` : w.name;
      return { value: String(w.code), label, id: w.code };
    });
  }, [wards, districts]);

  const geocodeLocation = async (query: string) => {
    const data = await geocodeService.resolve(query);
    if (data) {
      form.setValue("latitude", String(data.lat), { shouldValidate: true, shouldDirty: true });
      form.setValue("longitude", String(data.lon), { shouldValidate: true, shouldDirty: true });
    }
  };

  useEffect(() => {
    if (mode !== "edit" || !profile) return;
    form.reset(profileToFormValues(profile));
    setMediaItems(greenProfileMediaFromProfile(profile.photoMedias, profile.videoMedias));
    if (profile.avatarUrl) {
      setAvatarPreviewUrl(resolveMediaUrl(profile.avatarUrl) ?? null);
    }
  }, [mode, profile, form]);

  const handleMediaChange = (nextItems: GreenProfileMediaItem[]) => {
    setMediaItems(nextItems);
    const { photoMediaIds, videoMediaIds } = splitGreenProfileMediaItems(nextItems);
    form.setValue("photoMediaIds", photoMediaIds, { shouldDirty: true });
    form.setValue("videoMediaIds", videoMediaIds, { shouldDirty: true });
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > GREEN_PROFILE_PHOTO_MAX_BYTES) {
      toastService.error("Ảnh đại diện không được vượt quá 5MB");
      return;
    }

    try {
      const uploaded = await uploadAvatar(file);
      if (uploaded) {
        form.setValue("avatarMediaId", uploaded.mediaId, { shouldDirty: true });
        setAvatarPreviewUrl(resolveMediaUrl(uploaded.cdnUrl) ?? null);
      }
    } catch {
      toastService.error(copy.media.uploadError);
    } finally {
      event.target.value = "";
    }
  };

  const onSubmit = guardFormEvent(
    form.handleSubmit(
      async (data) => {
        try {
          if (mode === "create") {
            const created = await createProfile(greenProfileFormToCreateInput(data, orgId));
            router.push(ROUTES.greenProfileEdit(created.id));
            return;
          }
          const updated = await updateProfile(greenProfileFormToUpdateInput(data));
          form.reset(profileToFormValues(updated));
          setMediaItems(greenProfileMediaFromProfile(updated.photoMedias, updated.videoMedias));
          if (updated.avatarUrl) {
            setAvatarPreviewUrl(resolveMediaUrl(updated.avatarUrl) ?? null);
          }
        } finally {
          release();
        }
      },
      () => release(),
    ),
  );

  return (
    <div className="w-full space-y-6 p-5 md:p-6">
      {mode === "create" && (
        <ModulePageHeader
          title={title}
          description={subtitle}
          icon={Leaf}
          iconTileClassName="bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
          elevated={false}
          className="mb-2"
        />
      )}

      {/* Section 1: Basic Information */}
      <div className="shadow-2xs overflow-hidden rounded-2xl border border-border/60 bg-card">
        <div className="flex items-center gap-3 border-b border-border/50 bg-muted/20 px-5 py-3.5 sm:px-6">
          <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <Info className="size-4" />
          </div>
          <h2 className="text-sm font-bold text-foreground">{copy.sections.basic}</h2>
        </div>
        <div className="space-y-5 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="group relative shrink-0">
              <Avatar className="shadow-xs size-20 border-2 border-emerald-500/20">
                <AvatarImage src={avatarPreviewUrl ?? undefined} className="object-cover" />
                <AvatarFallback className="bg-emerald-50">
                  <Sprout className="size-8 text-emerald-600/60" />
                </AvatarFallback>
              </Avatar>
              <label
                className={`absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity focus-within:opacity-100 hover:opacity-100 ${isUploadingAvatar ? "bg-black/50 opacity-100" : ""}`}
                title={copy.media.addPhoto}
              >
                <input
                  type="file"
                  accept={GREEN_PROFILE_PHOTO_ACCEPT}
                  className="sr-only"
                  disabled={isSubmitting || isUploadingAvatar}
                  onChange={handleAvatarChange}
                />
                {isUploadingAvatar ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <Camera className="size-5" />
                )}
              </label>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-foreground">{copy.media.avatarTitle}</p>
              <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
                {copy.media.avatarHint}
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="profileName" className="text-xs font-bold text-foreground">
              {copy.fields.profileName} <span className="text-destructive">*</span>
            </Label>
            <Input id="profileName" className="h-10" {...form.register("profileName")} />
            {form.formState.errors.profileName ? (
              <p className="text-xs font-semibold text-destructive">
                {form.formState.errors.profileName.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs font-bold text-foreground">
              {copy.fields.description}
            </Label>
            <Textarea
              id="description"
              rows={3}
              className="min-h-[80px] resize-none"
              {...form.register("metaDescription")}
            />
            {form.formState.errors.metaDescription ? (
              <p className="text-xs font-semibold text-destructive">
                {form.formState.errors.metaDescription.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="productionProcess" className="text-xs font-bold text-foreground">
              {copy.fields.productionProcess}
            </Label>
            <Textarea
              id="productionProcess"
              rows={4}
              className="min-h-[100px] resize-none"
              {...form.register("productionProcess")}
            />
            {form.formState.errors.productionProcess ? (
              <p className="text-xs font-semibold text-destructive">
                {form.formState.errors.productionProcess.message}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Section 2: Location & Map */}
      <div className="shadow-2xs overflow-hidden rounded-2xl border border-border/60 bg-card">
        <div className="flex items-center gap-3 border-b border-border/50 bg-muted/20 px-5 py-3.5 sm:px-6">
          <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <MapPin className="size-4" />
          </div>
          <h2 className="text-sm font-bold text-foreground">{copy.sections.location}</h2>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
          <div className="space-y-1.5">
            <Label htmlFor="province" className="text-xs font-bold text-foreground">
              {copy.fields.province} <span className="text-destructive">*</span>
            </Label>
            <Combobox
              id="province"
              options={provinceOptions}
              value={selectedProvinceCode}
              loading={isLoadingProvinces}
              onValueChange={(val) => {
                form.setValue("provinceCode", val, { shouldValidate: true, shouldDirty: true });
                form.setValue("wardCode", "", { shouldValidate: true, shouldDirty: true });
                form.setValue("ward", "", { shouldValidate: true, shouldDirty: true });
                const selectedName = provinceOptions.find((o) => o.value === val)?.label;
                if (selectedName) {
                  form.setValue("province", selectedName, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  geocodeLocation(`${selectedName}, Việt Nam`);
                } else {
                  form.setValue("province", "", { shouldValidate: true, shouldDirty: true });
                }
              }}
              placeholder={copy.selectPlaceholder(copy.fields.province)}
              searchPlaceholder={copy.searchPlaceholder(copy.fields.province)}
              emptyText={copy.emptyText}
            />
            {form.formState.errors.provinceCode ? (
              <p className="text-xs font-semibold text-destructive">
                {form.formState.errors.provinceCode.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ward" className="text-xs font-bold text-foreground">
              {copy.fields.ward}
            </Label>
            <Combobox
              id="ward"
              options={wardOptions}
              value={selectedWardCode}
              loading={isLoadingWards}
              disabled={!selectedProvinceCode}
              onValueChange={(val) => {
                form.setValue("wardCode", val, { shouldValidate: true, shouldDirty: true });
                const currentProvinceCode = form.getValues("provinceCode");
                const provinceName = provinceOptions.find(
                  (o) => o.value === currentProvinceCode,
                )?.label;
                const wardName = wardOptions.find((o) => o.value === val)?.label;
                if (wardName) {
                  form.setValue("ward", wardName, { shouldValidate: true, shouldDirty: true });
                } else {
                  form.setValue("ward", "", { shouldValidate: true, shouldDirty: true });
                }
                if (provinceName && wardName) {
                  geocodeLocation(`${wardName}, ${provinceName}, Việt Nam`);
                }
              }}
              placeholder={copy.selectPlaceholder(copy.fields.ward)}
              searchPlaceholder={copy.searchPlaceholder(copy.fields.ward)}
              emptyText={copy.emptyText}
            />
            {form.formState.errors.wardCode ? (
              <p className="text-xs font-semibold text-destructive">
                {form.formState.errors.wardCode.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="growingZoneCode" className="text-xs font-bold text-foreground">
              {copy.fields.growingZoneCode}
            </Label>
            <Input
              id="growingZoneCode"
              className="h-10"
              placeholder="VD: VN-DN-03-12345"
              {...form.register("growingZoneCode")}
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="addressDetail" className="text-xs font-bold text-foreground">
              {copy.fields.addressDetail}
            </Label>
            <Input
              id="addressDetail"
              className="h-10"
              placeholder="VD: Thôn Mai Đàn, Xã Hải Lâm"
              {...form.register("addressDetail")}
            />
          </div>

          <div className="space-y-3 border-t border-border/40 pt-4 sm:col-span-2">
            <p className="text-xs font-bold text-foreground">{copy.sections.coordinates}</p>

            <LocationMapPicker
              latitude={currentLat ? parseFloat(currentLat) : null}
              longitude={currentLng ? parseFloat(currentLng) : null}
              onChange={(lat, lng) => {
                form.setValue("latitude", String(lat), { shouldValidate: true, shouldDirty: true });
                form.setValue("longitude", String(lng), {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }}
            />

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="latitude" className="text-xs font-bold text-foreground">
                  {copy.fields.latitude}
                </Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  className="h-9 text-xs"
                  {...form.register("latitude")}
                />
                {form.formState.errors.latitude ? (
                  <p className="text-xs font-semibold text-destructive">
                    {form.formState.errors.latitude.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="longitude" className="text-xs font-bold text-foreground">
                  {copy.fields.longitude}
                </Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  className="h-9 text-xs"
                  {...form.register("longitude")}
                />
                {form.formState.errors.longitude ? (
                  <p className="text-xs font-semibold text-destructive">
                    {form.formState.errors.longitude.message}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Production Scale & Yield */}
      <div className="shadow-2xs overflow-hidden rounded-2xl border border-border/60 bg-card">
        <div className="flex items-center gap-3 border-b border-border/50 bg-muted/20 px-5 py-3.5 sm:px-6">
          <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <Sprout className="size-4" />
          </div>
          <h2 className="text-sm font-bold text-foreground">{copy.sections.production}</h2>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
          <div className="space-y-1.5">
            <Label htmlFor="area" className="text-xs font-bold text-foreground">
              {copy.fields.area}
            </Label>
            <Input
              id="area"
              type="number"
              step="any"
              min="0"
              className="h-10"
              placeholder="VD: 12.5"
              {...form.register("farmAreaHa")}
            />
            {form.formState.errors.farmAreaHa ? (
              <p className="text-xs font-semibold text-destructive">
                {form.formState.errors.farmAreaHa.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="annualYieldTonnes" className="text-xs font-bold text-foreground">
              {copy.fields.annualYield}
            </Label>
            <Input
              id="annualYieldTonnes"
              type="number"
              step="any"
              min="0"
              className="h-10"
              placeholder="VD: 240"
              {...form.register("annualYieldTonnes")}
            />
            {form.formState.errors.annualYieldTonnes ? (
              <p className="text-xs font-semibold text-destructive">
                {form.formState.errors.annualYieldTonnes.message}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Section 4: Photos & Videos */}
      <GreenProfileMediaFields
        locale={locale}
        items={mediaItems}
        onChange={handleMediaChange}
        disabled={isSubmitting}
      />

      {/* Section 5: Certifications Panel */}
      {children}

      {/* Sticky Save Action Bar */}
      <GuardedForm noValidate onSubmit={onSubmit} isSubmitting={isSubmitting} className="contents">
        <div className="sticky bottom-4 z-10 overflow-hidden rounded-2xl border border-border/80 bg-card/95 p-3.5 shadow-md backdrop-blur-md sm:px-6">
          <div className="flex items-center justify-end gap-3">
            <Button
              asChild
              variant="ghost"
              disabled={isSubmitting}
              className="font-semibold text-muted-foreground hover:text-foreground"
            >
              <Link href={cancelHref}>{copy.cancel}</Link>
            </Button>
            <SubmitButton
              isSubmitting={isSubmitting}
              disabled={isDisabled}
              className="gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-2 font-bold text-white shadow-sm hover:from-emerald-500 hover:to-teal-500 active:scale-95"
            >
              {copy.save}
            </SubmitButton>
          </div>
        </div>
      </GuardedForm>
    </div>
  );
}
