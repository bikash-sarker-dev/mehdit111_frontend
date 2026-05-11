import baseApi from "../../baseApi";

export const childrenMangeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // need to add types
    getParentChildrenOverview: builder.query({
      query: () => "/parents/child/overview",
      providesTags: ["ChildrenMange"],
    }),

    getAllClidren: builder.query({
      query: (id) => ({
        url: `/parents/children`,
        method: "GET",
      }),
      providesTags: ["ChildrenMange"],
    }),

    CreateNewChildren: builder.mutation({
      query: (payload) => ({
        url: "/parents/child/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["ChildrenMange"],
    }),
    upateChildren: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/parents/child/update/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["ChildrenMange"],
    }),

    deleteChildren: builder.mutation({
      query: (id) => ({
        url: `/parents/child/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ChildrenMange"],
    }),
  }),
});

export const {
  useGetParentChildrenOverviewQuery,
  useCreateNewChildrenMutation,
  useUpateChildrenMutation,
  useDeleteChildrenMutation,
  useGetAllClidrenQuery,
} = childrenMangeApi;
