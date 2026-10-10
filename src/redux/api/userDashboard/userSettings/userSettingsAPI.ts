import baseApi from "../../baseApi";

export const reviewGapApi = baseApi.injectEndpoints({
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

    uploadCompanyLogo: builder.mutation({
      query: ({ businessId, payload }) => ({
        url: `/business/${businessId}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["userSettings"],
    }),

    getBusinessLogo: builder.query({
      query: (businessId) => ({
        url: `/business/${businessId}`,
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
  useGetBusinessLogoQuery,
  useSaveGeneralSettingsMutation,
  useUpdateProfileMutation,
  useUploadCompanyLogoMutation,
} = reviewGapApi;
