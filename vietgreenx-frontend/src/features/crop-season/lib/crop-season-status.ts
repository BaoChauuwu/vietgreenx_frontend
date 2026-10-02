import type { CropSeasonStatus } from "@/entities/crop-season";

export type CropSeasonStatusTransition = Extract<CropSeasonStatus, "active" | "harvested" | "cancelled">;

export function getNextCropSeasonStatuses(status: CropSeasonStatus): CropSeasonStatusTransition[] {
  switch (status) {
    case "planning":
      return ["active", "cancelled"];
    case "active":
      return ["harvested", "cancelled"];
    default:
      return [];
  }
}
