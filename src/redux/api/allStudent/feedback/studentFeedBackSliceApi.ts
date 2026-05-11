import baseApi from "../../baseApi";

export const feedBackStudentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // need to add types
    geFeedBackOverviewPage: builder.query({
      query: () => "/students/feedbacks/overview",
      providesTags: ["StudentFeedback"],
    }),
    geAllFeedback: builder.query({
      query: () => "/students/feedbacks",
      providesTags: ["StudentFeedback"],
    }),
    getFeedBackSingle: builder.query({
      query: (id) => ({
        url: `/students/feedbacks/${id}`,
      }),
      providesTags: ["StudentFeedback"],
    }),
  }),
});

export const {
  useGeAllFeedbackQuery,
  useGetFeedBackSingleQuery,
  useGeFeedBackOverviewPageQuery,
} = feedBackStudentApi;
