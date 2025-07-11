import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../redux/slices/themeSlice';

const ThemeInitializer = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  
  useEffect(() => {
    // Load theme from localStorage on app initialization
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme !== null) {
      dispatch(setTheme(JSON.parse(savedTheme)));
    }
    
    // Apply theme to document body for global styles
    if (theme) {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
    } else {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
    }
  }, [theme, dispatch]);
  
  return null; // This component doesn't render anything
};

export default ThemeInitializer;