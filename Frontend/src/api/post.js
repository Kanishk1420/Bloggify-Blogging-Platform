import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const postApi = createApi({
  reducerPath: "postApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      // Get the token from state
      const token = getState().auth.userInfo?.token;

      // If we have a token, include it in requests
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Post", "SinglePost"],
  endpoints: (builder) => ({
    getAllPost: builder.query({
      query: () => `/post/?populate=true`, // Make sure this matches your backend API
      providesTags: (result) =>
        result
          ? [
              ...result.allPost.map(({ _id }) => ({ type: "Post", id: _id })),
              { type: "Post", id: "LIST" },
            ]
          : [{ type: "Post", id: "LIST" }],
    }),

    getSearchPost: builder.mutation({
      query: (search) => ({
        url: `/post/search/${search}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    getPostById: builder.query({
      query: (postId) => `/post/${postId}`,
      providesTags: (result, error, id) => [{ type: "SinglePost", id }],
    }),

    uploadFile: builder.mutation({
      query: (file) => ({
        url: `/post/upload`,
        method: "POST",
        body: file,
      }),
    }),

    postUpload: builder.mutation({
      query: (data) => ({
        url: `/post/create`,
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    deletePost: builder.mutation({
      query: (postId) => ({
        url: `/post/${postId}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    updatePost: builder.mutation({
      query: ({ updateData, postId }) => ({
        url: `/post/${postId}`,
        method: "PUT",
        body: updateData,
      }),
    }),

    getUserPost: builder.query({
      query: (userId) => `/post/user/${userId}`, // Change from "users" to "user"
    }),

    likePost: builder.mutation({
      query: ({ id, userId }) => ({
        url: `/post/like/${id}`,
        method: "PUT",
        body: { userId },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "SinglePost", id }],
    }),

    unlikePost: builder.mutation({
      query: ({ id, userId }) => ({
        url: `/post/unlike/${id}`,
        method: "PUT",
        body: { userId },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "SinglePost", id }],
    }),

    addBookmark: builder.mutation({
      query: (id) => ({
        url: `/post/addbookmark/${id}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    removeBookmark: builder.mutation({
      query: (id) => ({
        url: `/post/removebookmark/${id}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    getFollowingPost: builder.query({
      query: () => `/post/followings`,
    }),

    getAnalytics: builder.query({
      query: () => "post/analytics",
    }),

    // Add these new endpoints
    dislikePost: builder.mutation({
      query: ({ id, userId }) => ({
        url: `/post/dislike/${id}`,
        method: "PUT",
        body: { userId },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "SinglePost", id }],
    }),
    undislikePost: builder.mutation({
      query: ({ id, userId }) => ({
        url: `/post/undislike/${id}`,
        method: "PUT",
        body: { userId },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "SinglePost", id }],
    }),
  }),
});

export const {
  useGetAllPostQuery,
  useGetSearchPostMutation,
  useGetPostByIdQuery,
  useUploadFileMutation,
  usePostUploadMutation,
  useDeletePostMutation,
  useUpdatePostMutation,
  useGetUserPostQuery,
  useLikePostMutation,
  useUnlikePostMutation,
  useAddBookmarkMutation,
  useRemoveBookmarkMutation,
  useGetFollowingPostQuery,
  useGetAnalyticsQuery,
  useDislikePostMutation,
  useUndislikePostMutation,
} = postApi;
