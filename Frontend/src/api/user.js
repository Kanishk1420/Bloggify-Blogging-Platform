import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.userInfo?.token;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (id) => {
        if (!id) {
          return { url: '', skip: true };
        }
        return `/user/${id}`;
      },
      skip: (id) => !id,
      providesTags: ['User'],
    }),

    updateUser: builder.mutation({
      query: (user) => ({
        url: `/user/update`,
        method: "PATCH",
        body: user,
      }),
      invalidatesTags: ['User'],
    }),

    getAllUsers: builder.query({
      query: (id) => `/alluser/${id}`,
    }),

    followUser: builder.mutation({
      query: (id) => ({
        url: `/alluser/follow/${id}`,
        method: "PUT",
      }),
    }),

    userFollowingList: builder.query({
      query: (id) => `/alluser/following/${id}`,
    }),

    userFollowerList: builder.query({
      query: (id) => `/alluser/followers/${id}`,
    }),

    unfollowUser: builder.mutation({
      query: (id) => ({
        url: `/alluser/unfollow/${id}`,
        method: "PUT",
      }),
    }),


    getAllUsersList:builder.query({
      query:()=> `/user/allUser`,
      
    }),

    searchUser: builder.query({
      query: (search) => `/user/search/${search}`,
    }),

    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/user/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetUserQuery,
  useUpdateUserMutation,
  useGetAllUsersQuery,
  useFollowUserMutation,
  useUserFollowingListQuery,
  useUserFollowerListQuery,
  useUnfollowUserMutation,
  useGetAllUsersListQuery,
  useSearchUserQuery,
  useDeleteUserMutation,
} = userApi;
