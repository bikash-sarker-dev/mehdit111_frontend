import baseApi from "../../baseApi";

export const studentManagerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // need to add types
    getAllStudent: builder.query({
      query: () => "/teachers/all-students",
      providesTags: ["Progress"],
    }),
    // need to add types
    getSingleStudent: builder.query({
      query: (id) => ({
        url: `/teachers/all-students/${id}`,
      }),
      providesTags: ["Progress"],
    }),
  }),
});

export const { useGetAllStudentQuery, useGetSingleStudentQuery } =
  studentManagerApi;
