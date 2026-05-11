import baseApi from "../../baseApi";

export const superAdminDashboardOverviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getsuperAdminDashboardOverview: builder.query({
      query: () => ({
        url: `/admin/platform-overview`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetsuperAdminDashboardOverviewQuery } =
  superAdminDashboardOverviewApi;
