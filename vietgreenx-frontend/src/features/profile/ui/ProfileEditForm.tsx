"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import type { ProfileResponse } from "@/entities/user";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { useGuardedSubmit } from "@/shared/lib/use-guarded-submit";
import { toastService } from "@/shared/lib/toast";
import { ROUTES } from "@/shared/routing";
import { Button } from "@/shared/ui/button";
import { CardContent } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import { GuardedForm } from "@/shared/ui/guarded-form";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { SubmitButton } from "@/shared/ui/submit-button";
import { Textarea } from "@/shared/ui/textarea";

import { useMyProfile, useUpdateProfile } from "../api/profile.queries";
import {
  createProfileEditFormSchema,
  type ProfileEditFormInput,
} from "../model/profile-edit.schema";
import { getProfileCopy } from "../profile.constants";
import { ProfileAddressFields } from "./ProfileAddressFields";
import { ProfileAvatarUpload } from "./ProfileAvatarUpload";

interface ProfileEditFormProps {
  locale?: AppLocale;
}

function emptyToNull(value?: string): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function profileToFormValues(profile: ProfileResponse): ProfileEditFormInput {
  return {
    displayName: profile.displayName,
    bio: profile.bio ?? "",
    website: profile.website ?? "",
    province: profile.province ?? "",
    ward: profile.ward ?? "",
    provinceCode: profile.provinceCode ?? undefined,
    wardCode: profile.wardCode ?? undefined,
  };
}

const PROFILE_SAVE_TOAST_ID = "profile-save";

export function ProfileEditForm({ locale = getClientLocale() }: ProfileEditFormProps) {
  const copy = getProfileCopy(locale).edit;
  const schema = useMemo(() => createProfileEditFormSchema(locale), [locale]);
  const { data: profile, isLoading } = useMyProfile();
  const { mutateAsync, isPending } = useUpdateProfile();

  const form = useForm<ProfileEditFormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: "",
      bio: "",
      website: "",
      province: "",
      ward: "",
      provinceCode: undefined,
      wardCode: undefined,
    },
  });

  const isDirty = form.formState.isDirty;
  const { guardFormEvent, release, isSubmitting, isDisabled } = useGuardedSubmit({
    isPending,
    enabled: isDirty,
  });

  useEffect(() => {
    if (!profile) return;
    form.reset(profileToFormValues(profile));
  }, [profile, form]);

  const onSubmit = guardFormEvent(
    form.handleSubmit(
      async (data) => {
        try {
          const updated = await mutateAsync({
            displayName: data.displayName,
            bio: emptyToNull(data.bio),
            website: emptyToNull(data.website),
            province: emptyToNull(data.province),
            provinceCode: data.provinceCode ? Number(data.provinceCode) : undefined,
            districtCode: null,
            ward: emptyToNull(data.ward),
            wardCode: data.wardCode ? Number(data.wardCode) : undefined,
          });
          form.reset(profileToFormValues(updated));
          toastService.success(copy.saved, { id: PROFILE_SAVE_TOAST_ID });
        } catch {
          toastService.error(copy.saveError);
        } finally {
          release();
        }
      },
      () => release(),
    ),
  );

  if (isLoading || !profile) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <ElevatedCard>
      <CardContent className="flex flex-col gap-6 p-6 sm:p-8">
        <div>
          <h1 className="text-xl font-semibold">{copy.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{copy.subtitle}</p>
        </div>

        <ProfileAvatarUpload
          locale={locale}
          displayName={profile.displayName}
          avatarUrl={profile.avatarUrl}
        />

        <GuardedForm
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          className="flex flex-col gap-5"
        >
          <div className="space-y-1.5">
            <Label htmlFor="displayName">{copy.displayName}</Label>
            <Input id="displayName" autoComplete="name" {...form.register("displayName")} />
            {form.formState.errors.displayName && (
              <p className="text-sm text-destructive">
                {form.formState.errors.displayName.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">{copy.bio}</Label>
            <Textarea
              id="bio"
              rows={4}
              className="min-h-[96px] resize-none leading-relaxed"
              {...form.register("bio")}
            />
            <p className="text-xs text-muted-foreground">{copy.bioHint}</p>
            {form.formState.errors.bio && (
              <p className="text-sm text-destructive">{form.formState.errors.bio.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="website">{copy.website}</Label>
            <Input
              id="website"
              type="url"
              placeholder={copy.websitePlaceholder}
              autoComplete="url"
              {...form.register("website")}
            />
            {form.formState.errors.website && (
              <p className="text-sm text-destructive">{form.formState.errors.website.message}</p>
            )}
          </div>

          <ProfileAddressFields locale={locale} control={form.control} setValue={form.setValue} />

          <div className="flex flex-col gap-2 border-t border-border pt-5 sm:flex-row sm:items-center">
            <SubmitButton
              isSubmitting={isSubmitting}
              disabled={isDisabled}
              className="sm:min-w-[8rem]"
            >
              {copy.save}
            </SubmitButton>
            <Button type="button" variant="outline" asChild>
              <Link href={ROUTES.profile}>{copy.back}</Link>
            </Button>
          </div>
        </GuardedForm>
      </CardContent>
    </ElevatedCard>
  );
}
