export type TourStepKind = "spotlight" | "center";

export interface TourStep {
  id: string;
  route: string;
  kind: TourStepKind;
  /** `data-tour` anchor — sidebar / in-page targets */
  target?: string;
  title: string;
  description: string;
}
