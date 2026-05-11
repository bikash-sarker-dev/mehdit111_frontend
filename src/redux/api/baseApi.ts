// src/features/api/baseApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const baseApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = Cookies?.get("token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: [
    "User",
    "SubscriptionPan",
    "UserManagement",
    "TeamManagement",
    "SubjectManager",
    "GradeManager",
    "Assignment",
    "Progress",
    "Chat",
    "StudentAssignment",
    "StudentFeedback",
    "ParentHome",
    "ChildrenMange",
    "ParentProgress",
    "SchoolManager",
    "Ai",
    "Subscriptoin",
    "parentSubScription",
  ],
});

// Export hooks for usage in functional components
export default baseApi;
