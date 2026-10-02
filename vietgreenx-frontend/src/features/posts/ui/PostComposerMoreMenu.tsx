"use client";

import { Check, MoreHorizontal } from "lucide-react";

import { POST_CONTENT_CATEGORIES, type PostContentCategory } from "@/entities/post";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

import { getPostsCopy } from "../posts.constants";

interface PostComposerMoreMenuProps {
  value?: PostContentCategory;
  onValueChange: (value: PostContentCategory | undefined) => void;
  locale?: AppLocale;
  disabled?: boolean;
}

export function PostComposerMoreMenu({
  value,
  onValueChange,
  locale = getClientLocale(),
  disabled = false,
}: PostComposerMoreMenuProps) {
  const copy = getPostsCopy(locale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={disabled}
          className={cn(
            "h-9 gap-1.5 rounded-lg px-2.5 text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            value && "text-foreground",
          )}
          aria-label={copy.composer.moreOptions}
        >
          <MoreHorizontal className="size-4" />
          <span className="hidden font-medium sm:inline">{copy.composer.more}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          {copy.composer.contentCategory}
        </DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => onValueChange(undefined)}>
          <Check className={cn("mr-2 size-4", !value ? "opacity-100" : "opacity-0")} />
          {copy.composer.contentCategoryNone}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {POST_CONTENT_CATEGORIES.map((key) => (
          <DropdownMenuItem key={key} onSelect={() => onValueChange(key)}>
            <Check className={cn("mr-2 size-4", value === key ? "opacity-100" : "opacity-0")} />
            {copy.postContentCategory[key]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
