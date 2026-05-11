import baseApi from "../baseApi";

export const teamMemberManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTeamMember: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/company/${id}/members`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["TeamManagement"],
    }),
    deleteTeamMember: builder.mutation({
      query: ({ companyId, memberId }) => ({
        url: `/company/${companyId}/members/${memberId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TeamManagement"],
    }),

    teamMemberStats: builder.mutation({
      query: ({ companyId, memberId, payload }) => ({
        url: `/company/${companyId}/members/${memberId}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["TeamManagement"],
    }),

    getAllTeamMembers: builder.query({
      query: (id) => ({
        url: `/company/${id}/members`,
        method: "GET",
      }),
      providesTags: ["TeamManagement"],
    }),

    getsuperAdminTeammanagementSingle: builder.query({
      query: (id) => ({
        url: `/Teams/${id}`,
        method: "GET",
      }),
      providesTags: ["TeamManagement"],
    }),
  }),
});

export const {
  useCreateTeamMemberMutation,
  useGetAllTeamMembersQuery,
  useDeleteTeamMemberMutation,
  useTeamMemberStatsMutation,
} = teamMemberManagementApi;
