import baseApi from "../../baseApi";

export const assignmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // need to add types
    getTecherOverview: builder.query({
      query: () => "/analytics/teacher-dashboard",
      providesTags: ["Assignment"],
    }),
    getAssignmentsId: builder.query({
      query: (id) => ({
        url: `/assignments/${id}`,
      }),
      providesTags: ["Assignment"],
    }),
    getPaddingAndGreded: builder.query({
      query: () => "/submissions/assignments-submissions",
      providesTags: ["Assignment"],
    }),
    getActiveAndDrafts: builder.query({
      query: () => "/assignments",
      providesTags: ["Assignment"],
    }),

    createAssignment: builder.mutation({
      query: (formData) => ({
        url: `/assignments`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Assignment"],
    }),

    updateAssignment: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/assignments/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Assignment"],
    }),

    submissions: builder.mutation({
      query: ({ selectedId, payload }) => ({
        url: `/submissions/${selectedId}/grade`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Assignment"],
    }),

    publishAssignment: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/assignments/${id}/publish`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Assignment"],
    }),

    deleteAssignment: builder.mutation({
      query: (id) => ({
        url: `/assignments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Assignment"],
    }),
  }),
});

export const {
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
  useGetPaddingAndGrededQuery,
  useGetActiveAndDraftsQuery,
  useSubmissionsMutation,
  usePublishAssignmentMutation,
  useDeleteAssignmentMutation,
  useGetAssignmentsIdQuery,
} = assignmentApi;
