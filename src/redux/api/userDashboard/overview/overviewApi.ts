import baseApi from "../../baseApi";

export const UserOverviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCharts: builder.query({
      query: ({ businessId, period }) => ({
        url: `/analytics/dashboard/${businessId}?period=${period}`,
        method: "get",
      }),
      providesTags: ["userOverview"],
    }),

    getReviewMetrics: builder.query({
      query: (businessId) => ({
        url: `/review/business/${businessId}/metrics`,
        method: "get",
      }),
      providesTags: ["userOverview"],
    }),

    getMyBusinessProfile: builder.query({
      query: (businessId) => ({
        url: `/business/${businessId}`,
        method: "get",
      }),
      providesTags: ["userOverview"],
    }),
    GetCampaignStats: builder.query({
      query: (businessId) => ({
        url: `/campaign/business/${businessId}/stats`,
        method: "get",
      }),
      providesTags: ["userOverview"],
    }),
  }),
});

export const {
  useGetCampaignStatsQuery,
  useGetChartsQuery,
  useGetMyBusinessProfileQuery,
  useGetReviewMetricsQuery,
} = UserOverviewApi;
