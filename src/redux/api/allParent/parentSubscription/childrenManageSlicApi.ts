import baseApi from "../../baseApi";

export const parentSubScriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // need to add types
    getParentAllSubscription: builder.query({
      query: () => "payments/users-all-subscription-plan",
      providesTags: ["parentSubScription"],
    }),
    getChildrenLinked: builder.query({
      query: () => "/parents/child/my-all-children",
      providesTags: ["parentSubScription"],
    }),

    getPaymentHistory: builder.query({
      query: () => "/payments/payment-history",
      providesTags: ["parentSubScription"],
    }),
  }),
});

export const {
  useGetChildrenLinkedQuery,
  useGetParentAllSubscriptionQuery,
  useGetPaymentHistoryQuery,
} = parentSubScriptionApi;
