import baseApi from "../../baseApi";

export const progressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // need to add types
    getProgressAllData: builder.query({
      query: () => "/teachers/report-and-analytics",
      providesTags: ["Progress"],
    }),
  }),
});

export const { useGetProgressAllDataQuery } = progressApi;
