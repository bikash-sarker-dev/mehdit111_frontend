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
    getStep1: builder.query({
      query: (query) => ({
        url: `/business/search-places?query=${query}`,
        method: "GET",
      }),
      providesTags: ["onboarding"],
    }),
    postStep1: builder.mutation({
      query: (body) => ({
        url: `/business`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["onboarding"],
    }),

    // setep 1 api
    postStep2: builder.mutation({
      query: ({ businessId, body }) => ({
        url: `/business/${businessId}/sync-google`,
        method: "POST",
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
    patchStep3: builder.mutation({
      query: ({ businessId, body }) => ({
        url: `/business/${businessId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["onboarding"],
    }),

    // setep 4 api
    getStep4: builder.query({
      query: (query) => ({
        url: `/competitor/search?query=${query}`,
        method: "GET",
      }),
      providesTags: ["onboarding"],
    }),

    postStep4: builder.mutation({
      query: (body) => ({
        url: `/competitor`,
        method: "POST",
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
      query: ({ query, cardId }) => ({
        url: `/nfc/${cardId}/qrcode?format=${query}`,
        method: "GET",
      }),
      providesTags: ["onboarding"],
    }),

    postStep5: builder.mutation({
      query: (body) => ({
        url: `/nfc`,
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
  }),
});

export const {
  useGetCheckUserBusinessProfileQuery,
  useGetStep1Query,
  usePostStep1Mutation,
  usePostStep2Mutation,
  usePatchStep2Mutation,
  usePatchStep3Mutation,
  useGetStep4Query,
  usePostStep4Mutation,
  usePatchStep4Mutation,
  useGetStep5Query,
  usePostStep5Mutation,
  usePatchStep5Mutation,
} = onboardingApi;
