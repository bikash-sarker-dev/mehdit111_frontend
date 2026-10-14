import baseApi from "../../baseApi";

export const adminSettingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSuperAdminProfilePlatform: builder.query({
      query: () => ({
        url: `/user/me`,
        method: "GET",
      }),
      providesTags: ["userSettings"],
    }),
    updateAdminProfileGeneralSettings: builder.mutation({
      query: (payload) => ({
        url: `/user/me/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["userSettings"],
    }),
    saveCompanyBrandInfo: builder.mutation({
      query: (payload) => ({
        url: `/user/me/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["userSettings"],
    }),

    changeAdminPassword: builder.mutation({
      query: (payload) => ({
        url: `/auth/change-password`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["userSettings"],
    }),
  }),
});

export const {
  useGetSuperAdminProfilePlatformQuery,
  useUpdateAdminProfileGeneralSettingsMutation,
  useSaveCompanyBrandInfoMutation,
  useChangeAdminPasswordMutation,
} = adminSettingApi;
