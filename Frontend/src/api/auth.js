import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}`,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      // Try to get token from Redux state first
      let token = getState().auth.userInfo?.token;

      // If not in state, try localStorage
      if (!token) {
        token = localStorage.getItem("userToken");
      }

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (newUser) => ({
        url: `auth/login`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: newUser,
      }),
    }),

    userlogout: builder.mutation({
      query: () => ({
        url: `auth/logout`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }),
    }),

    refetch: builder.query({
      query: () => ({
        url: `auth/refetch`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }),
    }),

    resetPassword: builder.mutation({
      query: (body) => ({
        url: `auth/reset-password`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      }),
    }),

    sendOtp: builder.mutation({
      query: (email) => ({
        url: `auth/send-otp`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: email,
      }),
    }),

    register: builder.mutation({
      query: (newUser) => ({
        url: `auth/register`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: newUser,
      }),
    }),

    checkUsernameAvailability: builder.query({
      query: (username) => ({
        url: `/auth/check-username?username=${username}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useUserlogoutMutation,
  useRefetchQuery,
  useResetPasswordMutation,
  useSendOtpMutation,
  useCheckUsernameAvailabilityQuery,
} = authApi;
