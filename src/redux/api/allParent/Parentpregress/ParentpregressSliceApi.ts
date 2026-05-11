import baseApi from "../../baseApi";

export const parentProgressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // need to add types
    getParentChildren: builder.query({
      query: () => "/parents/child/all-children-for-feedback",
      providesTags: ["ParentProgress"],
    }),

    getSingleChildren: builder.query({
      query: (id) => ({
        url: `/parents/child/progress-reports/${id}`,
        method: "GET",
      }),
      providesTags: ["ParentProgress"],
    }),
  }),
});

export const { useGetParentChildrenQuery, useGetSingleChildrenQuery } =
  parentProgressApi;
