import baseApi from "../../baseApi";

export const parentHomeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // need to add types
    getMyChildren: builder.query({
      query: () => "/parents/child/all-children-for-feedback",
      providesTags: ["ParentHome"],
    }),

    getSignleClidrenOverview: builder.query({
      query: (id) => ({
        url: `/parents/child/dashboard/${id}`,
        method: "GET",
      }),
      providesTags: ["ParentHome"],
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

export const { useGetMyChildrenQuery, useGetSignleClidrenOverviewQuery } =
  parentHomeApi;
