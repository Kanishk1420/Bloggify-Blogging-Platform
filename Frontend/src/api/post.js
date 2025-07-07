import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const postApi = createApi({
  reducerPath: "postApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "include",
    prepareHeaders: (headers) => {
      // Get token from localStorage if it exists
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ["Post"],
  endpoints: (builder) => ({
    getAllPost: builder.query({
      query: () => `/post/`,
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
    }),

    unlikePost: builder.mutation({
      query: ({ id, userId }) => ({
        url: `/post/unlike/${id}`,
        method: "PUT",
        body: { userId },
      }),
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

    getFollowingPost:builder.query({
      query:() => `/post/followings`
    }),

    getAnalytics:builder.query({
        query:() => '/post/analytics'
    })
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
  useGetAnalyticsQuery
} = postApi;
