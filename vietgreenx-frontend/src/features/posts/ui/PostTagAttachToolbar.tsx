"use client";

import { MapPin, Package, Sprout } from "lucide-react";
import { useMemo } from "react";

import type { Category } from "../model/category.schema";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { cn } from "@/shared/lib/cn";

import { useAgricultureCategories } from "../api/category.queries";
import { usePostRegionProvinces } from "../api/region.queries";
import { canAddPostTag, normalizePostTagsForRequest, postTagKey } from "../lib/post-tags";
import { usePostTagProducts } from "../lib/post-tag-products-context";
import type { PostTagInput } from "../model/post-input.schema";
import { getPostsCopy } from "../posts.constants";
import { PostEntityPickerPopover } from "./PostEntityPickerPopover";

interface PostTagAttachToolbarProps {
  tags: PostTagInput[];
  onChange: (tags: PostTagInput[]) => void;
  locale?: AppLocale;
  disabled?: boolean;
  className?: string;
}

function categoryLabel(category: Category, locale: AppLocale): string {
  return locale === "en" ? category.nameEn : category.nameVi;
}

export function PostTagAttachToolbar({
  tags,
  onChange,
  locale = getClientLocale(),
  disabled = false,
  className,
}: PostTagAttachToolbarProps) {
  const copy = getPostsCopy(locale).tags;
  const { products, loading: productsLoading } = usePostTagProducts();
  const { data: categories = [], isLoading: categoriesLoading } = useAgricultureCategories();
  const { data: provinces = [], isLoading: provincesLoading } = usePostRegionProvinces();

  const normalizedTags = useMemo(() => normalizePostTagsForRequest(tags), [tags]);
  const atLimit = !canAddPostTag(normalizedTags);
  const toolbarDisabled = disabled || atLimit;

  const regionOptions = useMemo(
    () => provinces.map((province) => ({ value: province.name, label: province.name })),
    [provinces],
  );

  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        value: category.id,
        label: categoryLabel(category, locale),
      })),
    [categories, locale],
  );

  const productOptions = useMemo(
    () => products.map((product) => ({ value: product.id, label: product.name })),
    [products],
  );

  const selectedRegionValues = useMemo(
    () => normalizedTags.filter((tag) => tag.tagType === "region").map((tag) => tag.refLabel),
    [normalizedTags],
  );

  const selectedCategoryValues = useMemo(
    () =>
      normalizedTags
        .filter((tag) => tag.tagType === "category" && tag.refId)
        .map((tag) => tag.refId!),
    [normalizedTags],
  );

  const selectedProductValues = useMemo(
    () =>
      normalizedTags
        .filter((tag) => tag.tagType === "product" && tag.refId)
        .map((tag) => tag.refId!),
    [normalizedTags],
  );

  const addTag = (tag: PostTagInput) => {
    const key = postTagKey({ ...tag, refId: tag.refId ?? null });
    if (normalizedTags.some((item) => postTagKey({ ...item, refId: item.refId ?? null }) === key)) {
      return;
    }
    onChange(normalizePostTagsForRequest([...normalizedTags, tag]));
  };

  // Replace all tags of the same type with a single new one (single-select behavior)
  const replaceTag = (tag: PostTagInput) => {
    const withoutType = normalizedTags.filter((t) => t.tagType !== tag.tagType);
    onChange(normalizePostTagsForRequest([...withoutType, tag]));
  };

  const removeTagByRefLabel = (tagType: string, refLabel: string) => {
    onChange(normalizedTags.filter((t) => !(t.tagType === tagType && t.refLabel.toLowerCase() === refLabel.toLowerCase())));
  };

  const removeTagByRefId = (tagType: string, refId: string) => {
    onChange(normalizedTags.filter((t) => !(t.tagType === tagType && t.refId === refId)));
  };

  const showProductPicker = productsLoading || productOptions.length > 0;

  return (
    <div className={cn("flex flex-wrap items-center gap-0.5", className)}>
      <PostEntityPickerPopover
        icon={MapPin}
        label={copy.region}
        options={regionOptions}
        selectedValues={selectedRegionValues}
        onSelect={(value) => replaceTag({ tagType: "region", refLabel: value })}
        onDeselect={(value) => removeTagByRefLabel("region", value)}
        searchPlaceholder={copy.regionSearch}
        emptyText={copy.regionEmpty}
        disabled={toolbarDisabled}
        loading={provincesLoading}
      />

      <PostEntityPickerPopover
        icon={Sprout}
        label={copy.catalogCategory}
        options={categoryOptions}
        selectedValues={selectedCategoryValues}
        onSelect={(value) => {
          const category = categories.find((item) => item.id === value);
          if (!category) return;
          replaceTag({
            tagType: "category",
            refId: category.id,
            refLabel: categoryLabel(category, locale),
          });
        }}
        onDeselect={(value) => removeTagByRefId("category", value)}
        searchPlaceholder={copy.categorySearch}
        emptyText={copy.categoryEmpty}
        disabled={toolbarDisabled}
        loading={categoriesLoading}
      />

      {showProductPicker ? (
        <PostEntityPickerPopover
          icon={Package}
          label={copy.product}
          options={productOptions}
          selectedValues={selectedProductValues}
          onSelect={(value) => {
            const product = products.find((item) => item.id === value);
            if (!product) return;
            addTag({
              tagType: "product",
              refId: product.id,
              refLabel: product.name,
            });
          }}
          onDeselect={(value) => removeTagByRefId("product", value)}
          searchPlaceholder={copy.productSearch}
          emptyText={copy.productEmpty}
          disabled={toolbarDisabled}
          loading={productsLoading}
        />
      ) : null}
    </div>
  );
}
