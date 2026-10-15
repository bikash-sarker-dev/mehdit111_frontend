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
  }),
});

export const { useGetReviewGapAnalyticsQuery, useGetNfcAnalyticsQuery } =
  reviewGapApi;
