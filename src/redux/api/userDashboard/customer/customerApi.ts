// import baseApi from "../../baseApi";

// export const customerApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     getAllCustomer: builder.query({
//       query: ({ businessId, limit, page }) => ({
//         url: `/campaign?businessId=${businessId}&page=${page}&limit=${limit}`,
//         method: "get",
//       }),
//       providesTags: ["userCustomer"],
//     }),

//     getCustomerStats: builder.query({
//       query: (businessId) => ({
//         url: `/campaign/business/${businessId}/stats`,
//         method: "get",
//       }),
//       providesTags: ["userCustomer"],
//     }),

//     addCustomerSMS: builder.mutation({
//       query: (payload) => ({
//         url: "/campaign",
//         method: "POST",
//         body: payload,
//       }),
//       invalidatesTags: ["userCustomer"],
//     }),
//     addCustomerEmail: builder.mutation({
//       query: (payload) => ({
//         url: "/campaign",
//         method: "POST",
//         body: payload,
//       }),
//       invalidatesTags: ["userCustomer"],
//     }),
//     resendRequestCustomer: builder.mutation({
//       query: (campaignId) => ({
//         url: `/campaign/${campaignId}/resend`,
//         method: "POST",
//       }),
//       invalidatesTags: ["userCustomer"],
//     }),
//     bulkImportCustomers: builder.mutation({
//       query: (payload) => ({
//         url: "/campaign/batch",
//         method: "POST",
//         body: payload,
//       }),
//       invalidatesTags: ["userCustomer"],
//     }),
//     deleteCustomer: builder.mutation({
//       query: (campaignId) => ({
//         url: `/campaign/${campaignId}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["userCustomer"],
//     }),
//   }),
// });

// export const {
//   useGetAllCustomerQuery,
//   useGetCustomerStatsQuery,
//   useAddCustomerEmailMutation,
//   useAddCustomerSMSMutation,
//   useBulkImportCustomersMutation,
//   useDeleteCustomerMutation,
//   useResendRequestCustomerMutation
// } = customerApi;
import baseApi from "../../baseApi";

export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Now supports: status, channel, searchTerm (undefined values are dropped)
    getAllCustomer: builder.query({
      query: ({
        businessId,
        page = 1,
        limit = 10,
        status,
        channel,
        searchTerm,
      }) => ({
        url: "/campaign",
        method: "GET",
        params: { businessId, page, limit, status, channel, searchTerm },
      }),
      providesTags: ["userCustomer"],
    }),

    getCustomerStats: builder.query({
      query: (businessId) => ({
        url: `/campaign/business/${businessId}/stats`,
        method: "GET",
      }),
      providesTags: ["userCustomer"],
    }),

    addCustomerSMS: builder.mutation({
      query: (payload) => ({ url: "/campaign", method: "POST", body: payload }),
      invalidatesTags: ["userCustomer"],
    }),

    addCustomerEmail: builder.mutation({
      query: (payload) => ({ url: "/campaign", method: "POST", body: payload }),
      invalidatesTags: ["userCustomer"],
    }),

    resendRequestCustomer: builder.mutation({
      query: (campaignId) => ({
        url: `/campaign/${campaignId}/resend`,
        method: "POST",
      }),
      invalidatesTags: ["userCustomer"],
    }),

    bulkImportCustomers: builder.mutation({
      query: (payload) => ({
        url: "/campaign/batch",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["userCustomer"],
    }),

    deleteCustomer: builder.mutation({
      query: (campaignId) => ({
        url: `/campaign/${campaignId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["userCustomer"],
    }),
  }),
});

export const {
  useGetAllCustomerQuery,
  useGetCustomerStatsQuery,
  useAddCustomerEmailMutation,
  useAddCustomerSMSMutation,
  useBulkImportCustomersMutation,
  useDeleteCustomerMutation,
  useResendRequestCustomerMutation,
} = customerApi;
