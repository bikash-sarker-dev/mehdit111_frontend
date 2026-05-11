import baseApi from "../baseApi";

export const subscriptionPanApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    paymentCreate: builder.mutation({
      query: (body) => ({
        url: "/payments/subscription/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SubscriptionPan"],
    }),

    getActiveSubscriptionPan: builder.query({
      query: (id) => ({
        url: `/plans/active`,
        method: "GET",
      }),
      providesTags: ["SubscriptionPan"],
    }),

    // for super addmin working
    createSubscriptionPan: builder.mutation({
      query: (body) => ({
        url: "/plans",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SubscriptionPan"],
    }),

    updateSubscriptionPan: builder.mutation({
      query: ({ id, data }) => ({
        url: `/plans/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["SubscriptionPan"],
    }),

    deleteSubscriptionPan: builder.mutation({
      query: (id) => ({
        url: `/plans/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SubscriptionPan"],
    }),

    getSingleSubscriptionPan: builder.query({
      query: (id) => ({
        url: `/plans/${id}`,
        method: "GET",
      }),
      providesTags: ["SubscriptionPan"],
    }),

    getAllSubscriptionPan: builder.query({
      query: (id) => ({
        url: `/plans`,
        method: "GET",
      }),
      providesTags: ["SubscriptionPan"],
    }),
  }),
});

export const {
  useGetActiveSubscriptionPanQuery,
  usePaymentCreateMutation,
  useCreateSubscriptionPanMutation,
  useGetAllSubscriptionPanQuery,
  useGetSingleSubscriptionPanQuery,
  useUpdateSubscriptionPanMutation,
  useDeleteSubscriptionPanMutation,
} = subscriptionPanApi;
