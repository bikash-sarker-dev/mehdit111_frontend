import baseApi from "../../baseApi";

export const adminSubscriptionPanApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRevenueBillingPlatformStats: builder.query({
      query: () => ({
        url: `/analytics/admin/overview`,
        method: "GET",
      }),
      providesTags: ["SubscriptionPan"],
    }),

    getPaymentsTransactionsTable: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/user`,
        method: "GET",
        params: {
          page,
          limit,
        },
      }),
      providesTags: ["SubscriptionPan"],
    }),

    updateSubscriptionPan: builder.mutation({
      query: ({ planKey, payload }) => ({
        url: `/subscription/plans/${planKey}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["SubscriptionPan"],
    }),

    freeTrailUpdate: builder.mutation({
      query: (payload) => ({
        url: `/subscription/free-trial`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["SubscriptionPan"],
    }),

    getAllSubscriptionPan: builder.query({
      query: () => ({
        url: `/subscription/plans`,
        method: "GET",
      }),
      providesTags: ["SubscriptionPan"],
    }),
  }),
});

export const {
  useGetAllSubscriptionPanQuery,
  useGetRevenueBillingPlatformStatsQuery,
  useGetPaymentsTransactionsTableQuery,
  useUpdateSubscriptionPanMutation,
  useFreeTrailUpdateMutation,
} = adminSubscriptionPanApi;
