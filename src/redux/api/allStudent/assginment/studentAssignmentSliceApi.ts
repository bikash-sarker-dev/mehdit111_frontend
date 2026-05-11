import baseApi from "../../baseApi";

export const studentAssignmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // need to add types
    geAssignmentOverviewPage: builder.query({
      query: () => "/students/assignment-overview",
      providesTags: ["StudentAssignment"],
    }),
    geAssignmentPending: builder.query({
      query: () => "/students/assignments",
      providesTags: ["StudentAssignment"],
    }),
    getAssignmentPendingSingle: builder.query({
      query: (id) => ({
        url: `/students/assignments/${id}`,
      }),
      providesTags: ["StudentAssignment"],
    }),

    getAssignmentSubmitted: builder.query({
      query: (status) => ({
        url: `/students/submitted-assignments?status=${status}`,
      }),
      providesTags: ["StudentAssignment"],
    }),

    getAssignmentSubmittedSingle: builder.query({
      query: (id) => ({
        url: `/students/submitted-assignments/${id}`,
      }),
      providesTags: ["StudentAssignment"],
    }),

    postAssignment: builder.mutation({
      query: (payload) => ({
        url: "submissions",
        method: "POSt",
        body: payload,
      }),
      invalidatesTags: ["StudentAssignment"],
    }),
  }),
});

export const {
  useGeAssignmentPendingQuery,
  usePostAssignmentMutation,
  useGetAssignmentPendingSingleQuery,
  useGetAssignmentSubmittedQuery,
  useGetAssignmentSubmittedSingleQuery,
  useGeAssignmentOverviewPageQuery,
} = studentAssignmentApi;
