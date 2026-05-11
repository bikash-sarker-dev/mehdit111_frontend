import baseApi from "../../baseApi";

export const aiTeacherApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // need to add types
    geAiTecherVideoLink: builder.query({
      query: (id) => ({
        url: `/ai-teacher/all-chat-tutor-videos/${id}`,
        method: "GET",
      }),
      providesTags: ["Ai"],
    }),

    minMapImageGenerate: builder.mutation({
      query: (payload) => ({
        url: "/ai-teacher/generate-mind-map",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Ai"],
    }),

    // ai teacher api
    aiTeacherChatGenerate: builder.mutation({
      query: (payload) => ({
        url: "/ai-teacher/generate-chat-tutor",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Ai"],
    }),
  }),
});

export const {
  useMinMapImageGenerateMutation,
  useAiTeacherChatGenerateMutation,
  useGeAiTecherVideoLinkQuery,
} = aiTeacherApi;
