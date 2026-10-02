"use client";

import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";
import { useMemo, useState } from "react";

import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";

export interface PostEntityPickerOption {
  value: string;
  label: string;
}

interface PostEntityPickerPopoverProps {
  icon: LucideIcon;
  label: string;
  options: PostEntityPickerOption[];
  onSelect: (value: string, option: PostEntityPickerOption) => void;
  onDeselect?: (value: string, option: PostEntityPickerOption) => void;
  searchPlaceholder: string;
  emptyText: string;
  disabled?: boolean;
  loading?: boolean;
  selectedValues?: readonly string[];
  className?: string;
}

export function PostEntityPickerPopover({
  icon: Icon,
  label,
  options,
  onSelect,
  onDeselect,
  searchPlaceholder,
  emptyText,
  disabled = false,
  loading = false,
  selectedValues = [],
  className,
}: PostEntityPickerPopoverProps) {
  const [open, setOpen] = useState(false);
  const selectedSet = useMemo(() => new Set(selectedValues), [selectedValues]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={disabled || loading}
          className={cn(
            "h-9 gap-1.5 rounded-lg px-2.5 text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            className,
          )}
        >
          <Icon className="size-4 shrink-0" aria-hidden />
          <span className="hidden font-medium sm:inline">{label}</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-72 p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{loading ? "…" : emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedSet.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => {
                      if (isSelected && onDeselect) {
                        onDeselect(option.value, option);
                      } else {
                        onSelect(option.value, option);
                      }
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn("mr-2 size-4 shrink-0", isSelected ? "opacity-100" : "opacity-0")}
                    />
                    <span className="truncate">{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
