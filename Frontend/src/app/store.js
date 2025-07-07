import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/AuthSlice";
import themeSlice from '../slices/Theme'
import { authApi } from "../api/auth";
import { postApi } from "../api/post";
import { commentApi } from "../api/comment";
import { userApi } from "../api/user";
import PostSlice from "../slices/PostSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    post: PostSlice,
    theme:themeSlice,
    [authApi.reducerPath]: authApi.reducer,
    [postApi.reducerPath]: postApi.reducer,
    [commentApi.reducerPath]: commentApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      postApi.middleware,
      commentApi.middleware,
      userApi.middleware
    ),

  devTools: true,
});

export default store;
