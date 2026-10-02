import { createService } from "@/shared/api/create-service";
import {
  fetchUserProfile,
  patchUserProfile,
  transactionHistoryListResponseSchema,
  type ProfileResponse,
  type TransactionHistoryListResponse,
  type UpdateProfileInput,
} from "@/entities/user";
import { uploadMedia } from "@/entities/media";

const http = createService("/users");

export const profileService = {
  byUserId(userId: string): Promise<ProfileResponse> {
    return fetchUserProfile(userId);
  },

  update(userId: string, input: UpdateProfileInput): Promise<ProfileResponse> {
    return patchUserProfile(userId, input);
  },

  async uploadAvatar(userId: string, file: File): Promise<ProfileResponse> {
    const { mediaId } = await uploadMedia(file, "avatar");
    return patchUserProfile(userId, { avatarMediaId: mediaId });
  },

  getTransactionHistory(
    userId: string,
    page = 1,
    limit = 20,
  ): Promise<TransactionHistoryListResponse> {
    return http.get<TransactionHistoryListResponse>(
      `/${userId}/transaction-history`,
      { params: { page, limit } },
      { schema: transactionHistoryListResponseSchema },
    );
  },
};
