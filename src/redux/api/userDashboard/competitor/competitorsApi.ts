import baseApi from "../../baseApi";

export const competitorsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Postman: "Get Tracked Competitors List"
    // GET /competitor?businessId=&page=1&limit=10&sortBy=rating&sortOrder=desc
    // sortBy: rating | userRatingsTotal | name      sortOrder: asc | desc
    getCompetitorsAll: builder.query({
      query: ({
        businessId,
        page = 1,
        limit = 10,
        sortBy = "rating",
        sortOrder = "desc",
      }) => ({
        url: "/competitor",
        method: "GET",
        params: { businessId, page, limit, sortBy, sortOrder },
      }),
      providesTags: ["userCompetitor"],
    }),

    // Benchmark stats. Takes the businessId string directly.
    getCompetitorStats: builder.query({
      query: (businessId: string) => ({
        url: `/competitor/benchmark/${businessId}`,
        method: "GET",
      }),
      // was "userCustomer" -> now refreshes when competitors are added/removed
      providesTags: ["userCompetitor"],
    }),

    // Postman: "Search Local Competitors on Google"
    // GET /competitor/search?query=Coffee Shop Amsterdam
    searchLocalCompetitors: builder.query({
      query: (query: string) => ({
        url: "/competitor/search",
        method: "GET",
        params: { query }, // encoded automatically
      }),
      keepUnusedDataFor: 60,
    }),
  }),
});

export const {
  useGetCompetitorStatsQuery,
  useGetCompetitorsAllQuery,
  useSearchLocalCompetitorsQuery,
} = competitorsApi;
