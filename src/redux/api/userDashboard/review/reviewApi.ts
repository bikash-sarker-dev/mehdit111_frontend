import baseApi from "../../baseApi";

export interface IReview {
  id: string;
  businessId: string;
  googleReviewId?: string | null;
  authorName: string;
  authorPhotoUrl?: string | null;
  rating: number;
  text?: string | null;
  reviewDate: string;
  isReplied: boolean;
  replyText?: string | null;
  replyDate?: string | null;
  sentiment: "POSITIVE" | "NEUTRAL" | "NEGATIVE";
  isAiGeneratedReply?: boolean;
  aiDraftReplies?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IReviewFilters {
  businessId: string;
  page?: number;
  limit?: number;
  rating?: number;
  sentiment?: "POSITIVE" | "NEUTRAL" | "NEGATIVE";
  isReplied?: boolean;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface IAiReplyOption {
  tone: "Professional" | "Friendly" | "Empathetic";
  reply: string;
}

export interface IGenerateAiRepliesResponse {
  reviewId: string;
  sentiment: "POSITIVE" | "NEUTRAL" | "NEGATIVE";
  options: IAiReplyOption[];
  quota: {
    limit: number;
    used: number;
    remaining: number;
  };
}

export interface IReviewSummary {
  total: number;
  replied: number;
  unreplied: number;
  responseRate: number;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

export interface IGetReviewsData {
  meta?: { page: number; limit: number; total: number; totalPages: number };
  summary?: IReviewSummary;
  data: IReview[];
}

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query<
      {
        statusCode: number;
        success: boolean;
        message: string;
        metaData?: { page: number; limit: number; total: number; totalPages: number };
        meta?: { page: number; limit: number; total: number; totalPages: number };
        data: IGetReviewsData | IReview[];
      },
      IReviewFilters
    >({
      query: (params) => ({
        url: "/review",
        method: "GET",
        params,
      }),
      providesTags: ["userReview"],
    }),

    generateAiReplies: builder.mutation<
      {
        statusCode: number;
        success: boolean;
        message: string;
        data: IGenerateAiRepliesResponse;
      },
      string
    >({
      query: (reviewId) => ({
        url: `/review/${reviewId}/generate-ai-replies`,
        method: "POST",
      }),
      invalidatesTags: ["userReview", "userOverview"],
    }),

    replyToReview: builder.mutation<
      {
        statusCode: number;
        success: boolean;
        message: string;
        data: IReview;
      },
      { reviewId: string; replyText: string; isAiGenerated?: boolean }
    >({
      query: ({ reviewId, replyText, isAiGenerated }) => ({
        url: `/review/${reviewId}/reply`,
        method: "PATCH",
        body: { replyText, isAiGenerated },
      }),
      invalidatesTags: ["userReview", "userOverview"],
    }),

    deleteReply: builder.mutation<
      {
        statusCode: number;
        success: boolean;
        message: string;
        data: IReview;
      },
      string
    >({
      query: (reviewId) => ({
        url: `/review/${reviewId}/reply`,
        method: "DELETE",
      }),
      invalidatesTags: ["userReview", "userOverview"],
    }),
  }),
});

export const {
  useGetReviewsQuery,
  useGenerateAiRepliesMutation,
  useReplyToReviewMutation,
  useDeleteReplyMutation,
} = reviewApi;
