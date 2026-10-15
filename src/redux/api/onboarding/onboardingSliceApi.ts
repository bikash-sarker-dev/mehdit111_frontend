import baseApi from "../baseApi";

export const onboardingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCheckUserBusinessProfile: builder.query({
      query: () => ({
        url: `/business`,
        method: "GET",
      }),
      providesTags: ["onboarding"],
    }),

    // setep 1 api
    postStep1: builder.mutation({
      query: (body) => ({
        url: `/business`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["onboarding"],
    }),

    // setep 1 api
    getStep2: builder.query({
      query: (query) => ({
        url: `/business/search-places?query=${query}`,
        method: "GET",
      }),
      providesTags: ["onboarding"],
    }),
    step2ConnectGMB: builder.mutation({
      query: ({ businessId, body }) => ({
        url: `/business/${businessId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["onboarding"],
    }),
    patchStep2: builder.mutation({
      query: ({ businessId, body }) => ({
        url: `/business/${businessId}/onboarding`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["onboarding"],
    }),

    // setep 3 api
    step3ReviewRequestChooseChannelSMSEmailNFC: builder.mutation({
      query: ({ businessId, body }) => ({
        url: `/business/${businessId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["onboarding"],
    }),
    patchStep3: builder.mutation({
      query: ({ businessId, body }) => ({
        url: `/business/${businessId}/onboarding`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["onboarding"],
    }),

    // setep 4 api
    step4ReviewRequestConfigureTimingDelay: builder.mutation({
      query: ({ businessId, body }) => ({
        url: `/business/${businessId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["onboarding"],
    }),
    patchStep4: builder.mutation({
      query: ({ businessId, body }) => ({
        url: `/business/${businessId}/onboarding`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["onboarding"],
    }),

    // setep 5 api
    getStep5: builder.query({
      query: (businessId) => ({
        url: `/competitor/business/${businessId}/suggestions`,
        method: "GET",
      }),
      providesTags: ["onboarding"],
    }),

    postStep5: builder.mutation({
      query: ({ businessId, body }) => ({
        url: `/competitor/business/${businessId}/bulk`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["onboarding"],
    }),
    patchStep5: builder.mutation({
      query: ({ businessId, body }) => ({
        url: `/business/${businessId}/onboarding`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["onboarding"],
    }),

    // setep 6 api
    getStep6: builder.query({
      query: ({ query, cardId }) => ({
        url: `/nfc/${cardId}/qrcode?format=${query}`,
        method: "GET",
      }),
      providesTags: ["onboarding"],
    }),

    postStep6: builder.mutation({
      query: (body) => ({
        url: `/nfc`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["onboarding"],
    }),
    patchStep6: builder.mutation({
      query: ({ businessId, body }) => ({
        url: `/business/${businessId}/onboarding`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["onboarding"],
    }),

    patchAllStep7: builder.mutation({
      query: ({ businessId, body }) => ({
        url: `/business/${businessId}/onboarding`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["onboarding"],
    }),
  }),
});

// this api payload body data
// this api reponse
export const {
  useGetCheckUserBusinessProfileQuery,
  usePostStep1Mutation,
  useGetStep2Query,
  useStep2ConnectGMBMutation,
  usePatchStep2Mutation,
  useStep3ReviewRequestChooseChannelSMSEmailNFCMutation,
  usePatchStep3Mutation,
  useStep4ReviewRequestConfigureTimingDelayMutation,
  usePatchStep4Mutation,
  useGetStep5Query,
  usePostStep5Mutation,
  usePatchStep5Mutation,
  useGetStep6Query,
  usePostStep6Mutation,
  usePatchStep6Mutation,
  usePatchAllStep7Mutation,
} = onboardingApi;
