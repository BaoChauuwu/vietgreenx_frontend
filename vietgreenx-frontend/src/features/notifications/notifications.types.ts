// NotificationKind is derived from the Zod schema — single source of truth
export type { NotificationKind, NotificationActor } from "./model/notification.schema";

// UI model used by NotificationRow and NotificationListShell.
// href is the FE navigation URL — constructed from deepLink (BE) or ROUTES on the FE side.
export interface NotificationItem {
  id: string;
  kind: import("./model/notification.schema").NotificationKind;
  title: string;
  body: string | null;
  href?: string;
  createdAt: string;
  read: boolean;
  actor?: import("./model/notification.schema").NotificationActor | null;
}
