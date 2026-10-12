import baseApi from "../../baseApi";

export const adminSettingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    SaveGeneralSettings: builder.mutation({
      query: ({ businessId, payload }) => ({
        url: `/business/${businessId}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["userSettings"],
    }),

    updateProfile: builder.mutation({
      query: (payload) => ({
        url: `/user/me/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["userSettings"],
    }),

    updateAdminProfileGeneralSettings: builder.mutation({
      query: (payload) => ({
        url: `/user/me`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["userSettings"],
    }),

    getSuperAdminProfilePlatform: builder.query({
      query: () => ({
        url: `/user/me`,
        method: "GET",
      }),
      providesTags: ["userSettings"],
    }),

    changePassword: builder.mutation({
      query: (payload) => ({
        url: `/auth/change-password`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["userSettings"],
    }),
    changeEmailAddress: builder.mutation({
      query: (payload) => ({
        url: `/user/me`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["userSettings"],
    }),
  }),
});

export const {
  useChangeEmailAddressMutation,
  useChangePasswordMutation,
  useSaveGeneralSettingsMutation,
  useUpdateProfileMutation,
} = adminSettingApi;
