import baseApi from "../../baseApi";

export const studentProgressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // need to add types
    getStudentProgressAllData: builder.query({
      query: () => "/students/progress-tracking",
      providesTags: ["Progress"],
    }),
  }),
});

export const { useGetStudentProgressAllDataQuery } = studentProgressApi;
