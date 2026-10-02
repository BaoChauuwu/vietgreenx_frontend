import { ROUTES } from "@/shared/routing";
import type { AppLocale } from "@/shared/i18n/locale";
import type { Permission } from "@/shared/auth";

import { getTourCopy } from "../tour.constants";
import type { TourStep } from "../tour.types";

type CanFn = (permission: Permission) => boolean;

export function buildTourSteps(locale: AppLocale, can: CanFn): TourStep[] {
  const c = getTourCopy(locale);
  const steps: TourStep[] = [
    {
      id: "welcome",
      route: ROUTES.feed,
      kind: "center",
      title: c.welcome.title,
      description: c.welcome.description,
    },
    {
      id: "composer",
      route: ROUTES.feed,
      kind: "spotlight",
      target: "tour-composer",
      title: c.composer.title,
      description: c.composer.description,
    },
  ];

  if (can("log_create")) {
    steps.push({
      id: "green-profile",
      route: ROUTES.feed,
      kind: "spotlight",
      target: "tour-nav-green-profile",
      title: c.greenProfile.title,
      description: c.greenProfile.description,
    });
  }

  if (can("qr_generate")) {
    steps.push({
      id: "qr",
      route: ROUTES.feed,
      kind: "spotlight",
      target: "tour-nav-qr",
      title: c.qr.title,
      description: c.qr.description,
    });
  }

  if (can("log_create")) {
    steps.push({
      id: "products",
      route: ROUTES.feed,
      kind: "spotlight",
      target: "tour-nav-products",
      title: c.products.title,
      description: c.products.description,
    });
  }

  if (can("batch_manage")) {
    steps.push({
      id: "batches",
      route: ROUTES.feed,
      kind: "spotlight",
      target: "tour-nav-batches",
      title: c.batches.title,
      description: c.batches.description,
    });
  }

  if (can("org_manage")) {
    steps.push({
      id: "org",
      route: ROUTES.feed,
      kind: "spotlight",
      target: "tour-nav-org",
      title: c.org.title,
      description: c.org.description,
    });
  }

  steps.push({
    id: "marketplace",
    route: ROUTES.feed,
    kind: "spotlight",
    target: "tour-nav-marketplace",
    title: c.marketplace.title,
    description: c.marketplace.description,
  });

  steps.push(
    {
      id: "profile-header",
      route: ROUTES.profile,
      kind: "spotlight",
      target: "tour-profile-header",
      title: c.profileHeader.title,
      description: c.profileHeader.description,
    },
    {
      id: "profile-banner",
      route: ROUTES.profile,
      kind: "spotlight",
      target: "tour-profile-banner",
      title: c.profileBanner.title,
      description: c.profileBanner.description,
    },
    {
      id: "top-actions",
      route: ROUTES.profile,
      kind: "spotlight",
      target: "tour-top-actions",
      title: c.topActions.title,
      description: c.topActions.description,
    },
  );

  return steps;
}
