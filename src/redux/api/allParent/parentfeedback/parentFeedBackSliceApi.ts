import baseApi from "../../baseApi";

export const feedBackStudentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // need to add types
    getParentChildrenShow: builder.query({
      query: () => "/parents/child/all-children-for-feedback",
      providesTags: ["StudentFeedback"],
    }),
    getParentStudentAllFeedback: builder.query({
      query: (id) => ({
        url: `/parents/child/teachers-feedback/${id}`,
      }),
      providesTags: ["StudentFeedback"],
    }),
    getParentStudentFeedBackSingle: builder.query({
      query: (id) => ({
        url: `/students/feedbacks/${id}`,
      }),
      providesTags: ["StudentFeedback"],
    }),
  }),
});

export const {
  useGetParentChildrenShowQuery,
  useGetParentStudentAllFeedbackQuery,
  useGetParentStudentFeedBackSingleQuery,
} = feedBackStudentApi;
