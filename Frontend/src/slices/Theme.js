/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: JSON.parse(localStorage.getItem("darkMode")) || false,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {


    toggleDarkMode: (state, action) => {
      state.theme = !state.theme;
      localStorage.setItem("darkMode", JSON.stringify(state.theme));
    },
  },
});

export default themeSlice.reducer;

export const { toggleDarkMode } = themeSlice.actions;
