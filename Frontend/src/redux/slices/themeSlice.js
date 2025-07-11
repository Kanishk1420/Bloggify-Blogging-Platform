import { createSlice } from '@reduxjs/toolkit';

// Get initial theme from localStorage, or use dark theme by default
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  return savedTheme !== null ? JSON.parse(savedTheme) : true; // true = dark mode by default
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    theme: getInitialTheme(),
  },
  reducers: {
    toggleTheme: (state) => {
      state.theme = !state.theme;
      // Save to localStorage whenever theme changes
      localStorage.setItem('theme', JSON.stringify(state.theme));
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', JSON.stringify(action.payload));
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;