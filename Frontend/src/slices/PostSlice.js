import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  postData: localStorage.getItem("postData")
    ? JSON.parse(localStorage.getItem("postData"))
    : null,
  likedPosts: localStorage.getItem("likedPosts")
    ? JSON.parse(localStorage.getItem("likedPosts"))
    : [],
  bookmarkedPosts: localStorage.getItem("bookmarkedPosts")
    ? JSON.parse(localStorage.getItem("bookmarkedPosts"))
    : [],

  profilePosts: localStorage.getItem("profilePosts")
    ? JSON.parse(localStorage.getItem("profilePosts"))
    : null,
  isBookmarked: false,
  color: "white",
  likesCount: 0,
  postLiked: false,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    getPost: (state, action) => {
      state.postData = action.payload;
      localStorage.setItem("postData", JSON.stringify(action.payload));

      const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 30 days
      localStorage.setItem("expirationTime", expirationTime);
    },

    addLike: (state, action) => {
      const userId = action.payload;
      const postId = state.postData._id;
      const existingPostIndex = state.likedPosts.findIndex(
        (post) => post.userId === userId && post.postId === postId
      );

      if (existingPostIndex === -1) {
        state.likedPosts.push({ userId: userId, postId: postId });
        state.postLiked = true;
        state.likesCount += 1;
        localStorage.setItem("likedPosts", JSON.stringify(state.likedPosts));
      }
    },

    removeLike: (state, action) => {
      const userId = action.payload;

      const existingPostIndex = state.likedPosts.findIndex(
        (post) => post.userId === userId
      );
      if (existingPostIndex !== -1) {
        state.likedPosts.splice(existingPostIndex, 1);
      }

      // Update state
      state.postLiked = false;
      state.likesCount -= 1;

      localStorage.setItem("likedPosts", JSON.stringify(state.likedPosts));
    },

    addBookmarkPost: (state, action) => {
      const postId = action.payload;
      const existingPostIndex = state.bookmarkedPosts.findIndex(
        (post) => post.postId === postId
      );
      if (existingPostIndex === -1) {
        state.bookmarkedPosts.push({
          postId: postId,
          postData: state.postData,
        });
        state.isBookmarked = true;
        localStorage.setItem(
          "bookmarkedPosts",
          JSON.stringify(state.bookmarkedPosts)
        );
      }
    },

    removeBookmarkPost: (state, action) => {
      const postId = action.payload;
      const existingPostIndex = state.bookmarkedPosts.findIndex(
        (post) => post.postId === postId
      );
      state.bookmarkedPosts.splice(existingPostIndex, 1);
      state.isBookmarked = false;
      localStorage.setItem(
        "bookmarkedPosts",
        JSON.stringify(state.bookmarkedPosts)
      );
    },

    myPosts: (state, action) => {
      state.profilePosts = action.payload;
      localStorage.setItem("usersPosts", JSON.stringify(state.profilePosts));
    },

    getLikedPost: (state) => {
      const likedPosts = JSON.parse(localStorage.getItem("likedPosts")) || [];
      state.likedPosts = likedPosts;
    },
  },
});

export default postSlice.reducer;

export const {
  getPost,
  addLike,
  removeLike,
  addBookmarkPost,
  removeBookmarkPost,
  myPosts,
  getLikedPost,
} = postSlice.actions;
