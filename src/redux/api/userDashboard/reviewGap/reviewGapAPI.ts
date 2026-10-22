import baseApi from "../../baseApi";

export const reviewGapApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReviewGapAnalytics: builder.query({
      query: (businessId) => ({
        url: `/competitor/business/${businessId}/review-gap`,
        method: "GET",
      }),
      providesTags: ["userReviewGap"],
    }),

    getNfcAnalytics: builder.query({
      query: (businessId) => ({
        url: `/nfc/business/${businessId}/stats`,
        method: "GET",
      }),
      providesTags: ["userReviewGap"],
    }),

    getNfcCards: builder.query({
      query: (businessId) => ({
        url: `/nfc?businessId=${businessId}&limit=50`,
        method: "GET",
      }),
      providesTags: ["userReviewGap"],
    }),

    createNfcCard: builder.mutation({
      query: (body) => ({
        url: `/nfc`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["userReviewGap"],
    }),

    updateNfcCard: builder.mutation({
      query: ({ id, body }) => ({
        url: `/nfc/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["userReviewGap"],
    }),

    deleteNfcCard: builder.mutation({
      query: (id) => ({
        url: `/nfc/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["userReviewGap"],
    }),
  }),
});

export const {
  useGetReviewGapAnalyticsQuery,
  useGetNfcAnalyticsQuery,
  useGetNfcCardsQuery,
  useCreateNfcCardMutation,
  useUpdateNfcCardMutation,
  useDeleteNfcCardMutation,
} = reviewGapApi;
