import baseApi from "../../baseApi";

export const superAdminAnalyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getsuperAdminAnalytics: builder.query({
      query: () => ({
        url: `/admin/platform-analytics`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetsuperAdminAnalyticsQuery } = superAdminAnalyticsApi;
