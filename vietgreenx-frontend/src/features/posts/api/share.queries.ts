"use client";

import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { useSingleFlightMutation } from "@/shared/lib/use-single-flight-mutation";
import { toastService } from "@/shared/lib/toast";

import { getPostsCopy } from "../posts.constants";
import { shareService } from "./share.service";
import type { CreateShareInput } from "../model/share.schema";

export function useSharePost() {
  const copy = getPostsCopy(getClientLocale());

  return useSingleFlightMutation({
    mutationFn: (input: CreateShareInput) => shareService.create(input),
    onError: () => toastService.error(copy.toast.shareFailed),
  });
}
