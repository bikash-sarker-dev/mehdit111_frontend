import baseApi from "../../baseApi";

export const subjectManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // need to add types
    getAllSubject: builder.query({
      query: () => "/subjects",
      providesTags: ["SubjectManager"],
    }),

    getSingleSubject: builder.query({
      query: () => "/SubjectManagers/profile",
      providesTags: ["SubjectManager"],
    }),

    createSubject: builder.mutation({
      query: (payload) => ({
        url: "/subjects/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SubjectManager"],
    }),

    updateSubject: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/subjects/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["SubjectManager"],
    }),

    deleteSubject: builder.mutation({
      query: (id) => ({
        url: `/subjects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SubjectManager"],
    }),
  }),
});

export const {
  useCreateSubjectMutation,
  useDeleteSubjectMutation,
  useGetAllSubjectQuery,
  useGetSingleSubjectQuery,
  useUpdateSubjectMutation,
} = subjectManagementApi;
