import baseApi from "../../baseApi";

export const competitorsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Now supports: status, channel, searchTerm (undefined values are dropped)
    getCompetitorsAll: builder.query({
      query: ({
        page = 1,
        limit = 10,

        searchTerm,
      }) => ({
        url: "/campaign",
        method: "GET",
        params: { page, limit, searchTerm },
      }),
      providesTags: ["userCompetitor"],
    }),

    getCompetitorStats: builder.query({
      query: (businessId) => ({
        url: `/competitor/benchmark/${businessId}`,
        method: "GET",
      }),
      providesTags: ["userCustomer"],
    }),
  }),
});

export const { useGetCompetitorStatsQuery, useGetCompetitorsAllQuery } =
  competitorsApi;
