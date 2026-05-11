import baseApi from "../baseApi";

export const getMe = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // need to add types
    getMeProfile: builder.query({
      query: () => "/users/profile",
      providesTags: ["User"],
    }),

    profileUpdate: builder.mutation({
      query: (payload) => ({
        url: "/users/profile",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["User"],
    }),

    profileUpdateAvatar: builder.mutation({
      query: (payload) => ({
        url: "/users/profile/avatar",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["User"],
    }),

    changePassword: builder.mutation({
      query: (payload) => ({
        url: "/auth/change-password",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetMeProfileQuery,
  useProfileUpdateMutation,
  useProfileUpdateAvatarMutation,
  useChangePasswordMutation,
} = getMe;
