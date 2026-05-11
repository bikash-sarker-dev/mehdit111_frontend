import baseApi from "../../baseApi";

export const techerHomApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // need to add types
    getTecherOverview: builder.query({
      query: () => "/analytics/teacher-dashboard",
      providesTags: ["Assignment"],
    }),

    getRecentStudentSingle: builder.mutation({
      query: (id) => ({
        url: `/analytics/teacher-dashboard/student-recent-activity/${id}`,
        method: "GET",
      }),
      invalidatesTags: ["Assignment"],
    }),
  }),
});

export const { useGetTecherOverviewQuery, useGetRecentStudentSingleMutation } =
  techerHomApi;
