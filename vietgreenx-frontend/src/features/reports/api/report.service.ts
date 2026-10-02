import {
  reportInputSchema,
  userReportItemSchema,
  type ReportInput,
  type UserReportItem,
} from "@/entities/report";
import { createService, type PaginatedResult } from "@/shared/api";

const http = createService("/reports");

export const reportService = {
  create(input: ReportInput): Promise<void> {
    const payload = reportInputSchema.parse(input);
    return http.post("", payload);
  },

  getMyReports(page = 1, limit = 10): Promise<PaginatedResult<UserReportItem>> {
    return http.getPaginated("/me", userReportItemSchema, {
      params: { page, limit },
    });
  },
};
