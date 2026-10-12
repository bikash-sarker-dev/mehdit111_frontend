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
      query: ({ page, limit }) => ({
        url: `/user?page=${page}&limit=${limit}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetPlatformOverviewStatCardsQuery,
  useGetRecentRegisteredUsersQuery,
} = adminDashboardOverviewApi;
