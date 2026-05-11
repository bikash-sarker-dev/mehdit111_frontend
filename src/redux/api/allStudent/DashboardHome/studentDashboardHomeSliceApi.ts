import baseApi from "../../baseApi";

export const studentHomeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // need to add types
    geStudentOverview: builder.query({
      query: () => "/students/dashboard",
      providesTags: ["User"],
    }),

    // profileUpdate: builder.mutation({
    //   query: (payload) => ({
    //     url: "/users/profile",
    //     method: "PUT",
    //     body: payload,
    //   }),
    //   invalidatesTags: ["User"],
    // }),
  }),
});

export const { useGeStudentOverviewQuery } = studentHomeApi;
