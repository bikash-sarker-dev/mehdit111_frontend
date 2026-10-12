// import baseApi from "../../baseApi";

// export const superAdminUserManagementApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     getAllUsersBusinesses: builder.query({
//       query: ({ page, limit, search, status }) => ({
//         url: `/user?${page}=1&${limit}=10&${search}=&status=${status}`,
//         method: "GET",
//       }),
//       providesTags: ["UserManagement"],
//     }),

//     GetSingleBusinessProfile: builder.query({
//       query: (businessId) => ({
//         url: `/business/${businessId}`,
//         method: "GET",
//       }),
//       providesTags: ["UserManagement"],
//     }),

//     getSingleUserbyID: builder.query({
//       query: (userId) => ({
//         url: `/user/${userId}`,
//         method: "GET",
//       }),
//       providesTags: ["UserManagement"],
//     }),

//     suspendOrActivateAccount: builder.mutation({
//       query: (userId) => ({
//         url: `/user/${userId}/status`,
//         method: "PATCH",
//       }),
//       invalidatesTags: ["UserManagement"],
//     }),

//     deleteBusinessProfile: builder.mutation({
//       query: (businessId) => ({
//         url: `/business/${businessId}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["UserManagement"],
//     }),
//     deleteUserAccountPermanently: builder.mutation({
//       query: (userId) => ({
//         url: `/user/${userId}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["UserManagement"],
//     }),
//   }),
// });

// export const {
//   useGetAllUsersBusinessesQuery,
//   useGetSingleBusinessProfileQuery,
//   useGetSingleUserbyIDQuery,
//   useSuspendOrActivateAccountMutation,
//   useDeleteBusinessProfileMutation,
//   useDeleteUserAccountPermanentlyMutation,
// } = superAdminUserManagementApi;
import baseApi from "../../baseApi";

export interface UsersQueryArgs {
  page?: number;
  limit?: number;
  /** Search by user name, email or business name. */
  search?: string;
  /** "active" | "inactive" | "blocked". Omit for all users. */
  status?: string;
}

export interface UpdateUserStatusArgs {
  userId: string;
  status: "active" | "inactive" | "blocked";
}

export const superAdminUserManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /user?page=1&limit=10&search=&status=active
    getAllUsersBusinesses: builder.query<unknown, UsersQueryArgs | void>({
      query: (args) => {
        const { page = 1, limit = 10, search, status } = args ?? {};
        return {
          url: "/user",
          method: "GET",
          // Empty values are left out so the backend never receives `search=` / `status=`.
          params: {
            page,
            limit,
            ...(search ? { search } : {}),
            ...(status ? { status } : {}),
          },
        };
      },
      providesTags: ["UserManagement"],
    }),

    GetSingleBusinessProfile: builder.query({
      query: (businessId) => ({
        url: `/business/${businessId}`,
        method: "GET",
      }),
      providesTags: ["UserManagement"],
    }),

    getSingleUserbyID: builder.query({
      query: (userId) => ({
        url: `/user/${userId}`,
        method: "GET",
      }),
      providesTags: ["UserManagement"],
    }),

    // PATCH /user/:id/status   body: { "status": "blocked" }
    suspendOrActivateAccount: builder.mutation<unknown, UpdateUserStatusArgs>({
      query: ({ userId, status }) => ({
        url: `/user/${userId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["UserManagement"],
    }),

    deleteBusinessProfile: builder.mutation({
      query: (businessId) => ({
        url: `/business/${businessId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["UserManagement"],
    }),

    deleteUserAccountPermanently: builder.mutation({
      query: (userId) => ({
        url: `/user/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["UserManagement"],
    }),
  }),
});

export const {
  useGetAllUsersBusinessesQuery,
  useGetSingleBusinessProfileQuery,
  useGetSingleUserbyIDQuery,
  useSuspendOrActivateAccountMutation,
  useDeleteBusinessProfileMutation,
  useDeleteUserAccountPermanentlyMutation,
} = superAdminUserManagementApi;
