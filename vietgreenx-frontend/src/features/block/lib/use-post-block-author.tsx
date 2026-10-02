"use client";

import { useState } from "react";

import { BlockUserConfirmDialog, type BlockUserTarget } from "../ui/BlockUserConfirmDialog";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";

export interface PostBlockAuthorInput {
  userId: string;
  displayName: string;
}

export function usePostBlockAuthor(locale: AppLocale = getClientLocale()) {
  const [target, setTarget] = useState<BlockUserTarget | null>(null);

  return {
    onBlockAuthor: (author: PostBlockAuthorInput) => {
      setTarget({ id: author.userId, displayName: author.displayName });
    },
    blockDialog: (
      <BlockUserConfirmDialog
        target={target}
        open={Boolean(target)}
        onOpenChange={(open) => {
          if (!open) setTarget(null);
        }}
        locale={locale}
      />
    ),
  };
}
