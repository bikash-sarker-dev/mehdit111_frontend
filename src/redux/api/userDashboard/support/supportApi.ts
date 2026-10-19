import baseApi from "../../baseApi";

export const supportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendSupportInquiry: builder.mutation<
      { statusCode: number; success: boolean; message: string; data: { targetEmail: string } },
      {
        name: string;
        email: string;
        category: string;
        subject?: string;
        message: string;
      }
    >({
      query: (payload) => ({
        url: "/support/inquiry",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const { useSendSupportInquiryMutation } = supportApi;
