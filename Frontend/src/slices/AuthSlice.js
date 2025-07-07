import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
  isAuthenticated: false,
  followers: localStorage.getItem("followers") ? JSON.parse(localStorage.getItem("followers")) : [],
  following: localStorage.getItem("following") ? JSON.parse(localStorage.getItem("following")) : [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      state.isAuthenticated = action.payload ? true : false;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.userInfo = null;
      state.isAuthenticated = false;
      localStorage.clear();
    },
    updateCredentials: (state, action) => {
      state.userInfo = action.payload;
      state.isAuthenticated = action.payload ? true : false;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },

    addFollower: (state, action) => {
      state.followers.push(action.payload);
      localStorage.setItem("followers", JSON.stringify(action.payload));
    },


    addFollowing: (state, action) => {
      state.following.push(action.payload);
      localStorage.setItem("following", JSON.stringify(action.payload));
    },
  },
});

export default authSlice.reducer;

export const {
  setCredentials,
  logout,
  updateCredentials,
  addFollower,
  addFollowing,
} = authSlice.actions;
