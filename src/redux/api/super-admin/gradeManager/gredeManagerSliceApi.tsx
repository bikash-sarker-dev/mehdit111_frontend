import baseApi from "../../baseApi";

export const gradeManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // need to add types
    getAllGrade: builder.query({
      query: () => "/grades",
      providesTags: ["GradeManager"],
    }),

    createGrade: builder.mutation({
      query: (payload) => ({
        url: "/grades/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["GradeManager"],
    }),

    updateGrade: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/grades/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["GradeManager"],
    }),

    deleteGrade: builder.mutation({
      query: (id) => ({
        url: `/grades/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["GradeManager"],
    }),
  }),
});

export const {
  useCreateGradeMutation,
  useDeleteGradeMutation,
  useGetAllGradeQuery,
  useUpdateGradeMutation,
} = gradeManagementApi;
