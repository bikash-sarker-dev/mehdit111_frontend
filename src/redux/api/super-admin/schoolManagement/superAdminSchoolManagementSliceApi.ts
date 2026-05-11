import baseApi from "../../baseApi";

export const schoolManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // need to add types
    getAllSchool: builder.query({
      query: () => "/schools",
      providesTags: ["SchoolManager"],
    }),

    getAllSchoolName: builder.query({
      query: () => "/schools/name-list",
      providesTags: ["SchoolManager"],
    }),

    getSingleSchool: builder.query({
      query: (id) => `/schools/${id}`,
      providesTags: ["SchoolManager"],
    }),

    createSchool: builder.mutation({
      query: (payload) => ({
        url: "/schools",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SchoolManager"],
    }),

    updateSchool: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/schools/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["SchoolManager"],
    }),

    deleteSchool: builder.mutation({
      query: (id) => ({
        url: `/schools/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SchoolManager"],
    }),
  }),
});

export const {
  useCreateSchoolMutation,
  useDeleteSchoolMutation,
  useGetAllSchoolQuery,
  useGetSingleSchoolQuery,
  useGetAllSchoolNameQuery,
  useUpdateSchoolMutation,
} = schoolManagementApi;
