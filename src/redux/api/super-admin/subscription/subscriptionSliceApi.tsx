import baseApi from "../../baseApi";

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // need to add types
    getSubscriptionManagementOverview: builder.query({
      query: () => "/payments/subscription-management-overview",
      providesTags: ["Subscriptoin"],
    }),

    getAllSubscriptionPlan: builder.query({
      query: () => "/payments/plans",
      providesTags: ["Subscriptoin"],
    }),

    getSingleSubscriptionPlan: builder.query({
      query: (id) => ({
        url: `/payments/plans/${id}`,
        method: "GET",
      }),
      providesTags: ["Subscriptoin"],
    }),

    createSubscriptionPlan: builder.mutation({
      query: (payload) => ({
        url: "/payments/plans",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Subscriptoin"],
    }),

    updateSubscriptionPlan: builder.mutation({
      query: ({ id, body }) => ({
        url: `/payments/plans/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Subscriptoin"],
    }),

    deleteSubject: builder.mutation({
      query: (id) => ({
        url: `/subjects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subscriptoin"],
    }),

    // payment
    subscriptionPayment: builder.mutation({
      query: (payload) => ({
        url: "/payments/subscribe",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Subscriptoin"],
    }),
  }),
});

export const {
  useCreateSubscriptionPlanMutation,
  useGetSingleSubscriptionPlanQuery,
  useGetSubscriptionManagementOverviewQuery,
  useUpdateSubscriptionPlanMutation,
  useGetAllSubscriptionPlanQuery,
  useSubscriptionPaymentMutation,
} = subscriptionApi;
