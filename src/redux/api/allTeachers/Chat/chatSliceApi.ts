import baseApi from "../../baseApi";

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // need to add types
    getTheChatlist: builder.query({
      query: () => "/chats/get-my-chat",
      providesTags: ["Chat"],
    }),
    chatingFile: builder.mutation({
      query: (payload) => ({
        url: "/chats/send-file",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Chat"],
    }),

    // Notification
    getAllNotification: builder.query({
      query: () => "/notifications",
      providesTags: ["Chat"],
    }),

    notificatonMarkAll: builder.mutation({
      query: () => ({
        url: "/notifications/mark-all-read",
        method: "PATCH",
      }),
      invalidatesTags: ["Chat"],
    }),

    notificatonMarkSingle: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Chat"],
    }),
  }),
});

export const {
  useGetTheChatlistQuery,
  useChatingFileMutation,
  useGetAllNotificationQuery,
  useNotificatonMarkAllMutation,
  useNotificatonMarkSingleMutation,
} = chatApi;
