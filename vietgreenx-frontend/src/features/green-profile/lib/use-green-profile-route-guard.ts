"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import type { GreenProfile } from "@/entities/green-profile";
import { ROUTES } from "@/shared/routing";

import { useActiveGreenProfile } from "../api/green-profile.queries";

export type GreenProfileRouteSegment = "edit" | "seasons" | "log";

function resolveGreenProfileRoute(profileId: string, segment: GreenProfileRouteSegment): string {
  switch (segment) {
    case "edit":
      return ROUTES.greenProfileEdit(profileId);
    case "seasons":
      return ROUTES.greenProfileSeasons(profileId);
    case "log":
      return ROUTES.greenProfileLog(profileId);
  }
}

/** Ensures `/me` profile exists and URL id matches — redirects to hub or canonical route. */
export function useGreenProfileRouteGuard(routeProfileId: string, segment: GreenProfileRouteSegment) {
  const router = useRouter();
  const { data: profile, isLoading, isError } = useActiveGreenProfile();

  const needsRedirect =
    !isLoading &&
    !isError &&
    (profile == null || profile.id !== routeProfileId);

  useEffect(() => {
    if (isLoading || isError) return;

    if (profile == null) {
      router.replace(ROUTES.greenProfile);
      return;
    }

    if (profile.id !== routeProfileId) {
      router.replace(resolveGreenProfileRoute(profile.id, segment));
    }
  }, [profile, routeProfileId, segment, isLoading, isError, router]);

  const isReady = !isLoading && !needsRedirect && profile != null;
  const resolvedProfile: GreenProfile | undefined = isReady ? profile : undefined;

  return {
    profile: resolvedProfile,
    isPending: isLoading || needsRedirect,
    isError,
    isReady,
  };
}

/** Redirects to hub when the user already has a green profile. */
export function useGreenProfileCreateGuard() {
  const router = useRouter();
  const { data: profile, isLoading, isError } = useActiveGreenProfile();

  const needsRedirect = !isLoading && !isError && profile != null;

  useEffect(() => {
    if (needsRedirect) {
      router.replace(ROUTES.greenProfile);
    }
  }, [needsRedirect, router]);

  return {
    isPending: isLoading || needsRedirect,
    isError,
    canCreate: !isLoading && !isError && profile == null,
  };
}
