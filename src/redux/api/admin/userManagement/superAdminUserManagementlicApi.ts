import baseApi from "../../baseApi";

export const superAdminUserManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (payload) => ({
        url: `/users/create`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["UserManagement"],
    }),
    userUpdate: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/users/${id}/update`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["UserManagement"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["UserManagement"],
    }),

    userSuspend: builder.mutation({
      query: (id) => ({
        url: `/users/${id}/status`,
        method: "PATCH",
      }),
      invalidatesTags: ["UserManagement"],
    }),

    getsuperAdminUsermanagement: builder.query({
      query: () => ({
        url: `/users`,
        method: "GET",
      }),
      providesTags: ["UserManagement"],
    }),

    getsuperAdminUsermanagementSingle: builder.query({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      providesTags: ["UserManagement"],
    }),
  }),
});

export const {
  useGetsuperAdminUsermanagementQuery,
  useGetsuperAdminUsermanagementSingleQuery,
  useDeleteUserMutation,
  useUserSuspendMutation,
  useCreateUserMutation,
  useUserUpdateMutation,
} = superAdminUserManagementApi;
