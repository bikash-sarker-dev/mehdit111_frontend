import baseApi from "../../baseApi";

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAvailablePlansPricing: builder.query({
      query: () => ({
        url: `/subscription/plans`,
        method: "GET",
      }),
      providesTags: ["Subscriptoin"],
    }),

    getMyCurrentSubscription: builder.query({
      query: (businessId) => ({
        url: `/subscription/my-subscription/${businessId}`,
        method: "GET",
      }),
      providesTags: ["Subscriptoin"],
    }),

    upgradeChangePlanCheckout: builder.mutation({
      query: (payload: { businessId: string; plan: string }) => ({
        url: "/subscription/create-checkout-session",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Subscriptoin"],
    }),
    cancelSubscription: builder.mutation({
      query: (businessId) => ({
        url: `/subscription/cancel/${businessId}`,
        method: "POST",
      }),
      invalidatesTags: ["userCustomer"],
    }),
  }),
});

export const {
  useGetAvailablePlansPricingQuery,
  useGetMyCurrentSubscriptionQuery,
  useUpgradeChangePlanCheckoutMutation,
  useCancelSubscriptionMutation,
} = subscriptionApi;
