import baseApi from "../../baseApi";

export const adminDashboardOverviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlatformOverviewStatCards: builder.query({
      query: () => ({
        url: `/analytics/admin/overview`,
        method: "GET",
      }),
    }),

    getRecentRegisteredUsers: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/user`,
        method: "GET",
        params: {
          page,
          limit,
        },
      }),
    }),

    getOverviewChart: builder.query({
      query: () => ({
        url: `/subscription/admin/overview`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetPlatformOverviewStatCardsQuery,
  useGetRecentRegisteredUsersQuery,
  useGetOverviewChartQuery,
} = adminDashboardOverviewApi;
