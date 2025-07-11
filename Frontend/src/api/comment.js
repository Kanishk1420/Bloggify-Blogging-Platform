import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const commentApi = createApi({
  reducerPath: "commentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "include",
  }),
  tagTypes: ["Comment"],
  endpoints: (builder) => ({
    getAllComment: builder.query({
      query: (postId) => `/comment/post/${postId}`,
      providesTags: ["Comment"],
    }),

    createComment: builder.mutation({
      query: (commentData) => ({
        url: `/comment/add/`,
        method: "POST",
        body: commentData,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Comment"],
    }),

    deleteComment: builder.mutation({
      query: (id) => ({
        url: `/comment/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Comment"],
    }),

    updateComment: builder.mutation({
      query: (newData) => ({
        url: `/comment/update`,
        method: "PUT",
        body: newData,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Comment"],
    }),

    // Add these new mutations
    likeComment: builder.mutation({
      query: ({ id, userId }) => ({
        url: `/comment/like/${id}`,
        method: "PUT",
        body: { userId },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Comment"],
    }),

    unlikeComment: builder.mutation({
      query: ({ id, userId }) => ({
        url: `/comment/unlike/${id}`,
        method: "PUT",
        body: { userId },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Comment"],
    }),

    dislikeComment: builder.mutation({
      query: ({ id, userId }) => ({
        url: `/comment/dislike/${id}`,
        method: "PUT",
        body: { userId },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Comment"],
    }),

    undislikeComment: builder.mutation({
      query: ({ id, userId }) => ({
        url: `/comment/undislike/${id}`,
        method: "PUT",
        body: { userId },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Comment"],
    }),
  }),
});

export const {
  useGetAllCommentQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useUpdateCommentMutation,
  useLikeCommentMutation,
  useUnlikeCommentMutation,
  useDislikeCommentMutation,
  useUndislikeCommentMutation
} = commentApi;
