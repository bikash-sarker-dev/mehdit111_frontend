import baseApi from "../baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    registration: builder.mutation({
      query: (payload) => ({
        url: "/auth/register",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["User"],
    }),

    registrationverifyOtp: builder.mutation({
      query: (body) => ({
        url: "/auth/verify-registration-otp",
        method: "POST",
        body,
      }),
    }),

    resendRegistrationOtp: builder.mutation({
      query: (body) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body,
      }),
    }),

    resendSingUpCode: builder.mutation({
      query: (body) => ({
        url: "/auth/resend-signup-otp",
        method: "POST",
        body,
      }),
    }),
    forgetPassword: builder.mutation({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),
    verifyForgotOtp: builder.mutation({
      query: (body) => ({
        url: "/auth/verify-forgot-otp",
        method: "POST",
        body,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    resetPassword: builder.mutation({
      query: (payload) => ({
        url: `/auth/reset-password`,
        method: "POST",
        body: payload,
      }),
    }),

    googleLogin: builder.mutation({
      query: (payload) => ({
        url: `/auth/social-login`,
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useLogoutMutation,
  useVerifyForgotOtpMutation,
  useResendSingUpCodeMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useGoogleLoginMutation,
  useRegistrationMutation,
  useRegistrationverifyOtpMutation,
  useResendRegistrationOtpMutation,
  useSignInMutation,
} = authApi;
