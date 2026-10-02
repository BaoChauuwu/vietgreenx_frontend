import type { Post, VietShopPreview } from "@/entities/post";
import { VIETSHOPX247_BASE_URL } from "@/shared/constants/external-links";

const VIETSHOP_TAG = "vietshop";

function hasVietShopHashtag(post: Post): boolean {
  if (post.hashtags?.some((tag) => tag.toLocaleLowerCase("vi-VN") === VIETSHOP_TAG)) {
    return true;
  }

  return post.body?.toLocaleLowerCase("vi-VN").includes(`#${VIETSHOP_TAG}`) ?? false;
}

export function resolveVietShopPreview(post: Post): VietShopPreview | null {
  if (post.vietShopPreview) {
    return post.vietShopPreview;
  }

  if (hasVietShopHashtag(post)) {
    return {
      productName: "Sản phẩm trên VietShopX247",
      shopUrl: VIETSHOPX247_BASE_URL,
    };
  }

  return null;
}
