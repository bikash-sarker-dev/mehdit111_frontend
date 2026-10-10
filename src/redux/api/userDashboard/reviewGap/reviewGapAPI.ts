import baseApi from "../../baseApi";

export const reviewGapApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReviewGapAnalytics: builder.query({
      query: ({ businessId, period }) => ({
        url: `/analytics/dashboard/${businessId}`, // backticks, single slash
        method: "GET",
        params: { period }, // businessId is already in the path
      }),
      providesTags: ["userReviewGap"],
    }),
  }),
});

export const { useGetReviewGapAnalyticsQuery } = reviewGapApi;
