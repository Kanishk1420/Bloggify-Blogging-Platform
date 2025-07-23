import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AnimatePresence } from "framer-motion";
import Home from './pages/Home/Home'
import Landing from './pages/Landing/Landing'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import PostDetails from './pages/PostBody/PostDetails'
import EditPost from './pages/PostAction/EditPost'
import MyBookmark from './pages/ProfileDetail/MyBookmark'
import FiindAllUsers from './pages/FindUser/FiindAllUsers'
import Profile from './pages/ProfileDetail/Profile'
import EditProfile from './pages/ProfileAction/EditProfile'
import Dashboard from './pages/Analytics/Dashboard'
import Notfound from './components/ErrorPage/Notfound'
import CreatePost from './pages/PostAction/CreatePost'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ResetPassword from './pages/ResetPassword/ResetPassword'
import ThemeInitializer from './components/ThemeInitializer'

// Create the AnimatedRoutes component that will handle transitions
const AnimatedRoutes = () => {
  const location = useLocation();
  const { theme } = useSelector((state) => state.theme);
  
  return (
    <div className={`min-h-screen ${theme ? "bg-zinc-950" : "bg-white"}`}>
      <ThemeInitializer />
      <ToastContainer autoClose={3000} />
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route exact path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/posts/post/:id" element={<PostDetails />} />
          <Route path="/edit/:id" element={<EditPost />} />
          <Route path="/bookmark/:id" element={<MyBookmark />} />
          <Route path='/finduser' element={<FiindAllUsers />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path='/profile/edit/:id' element={<EditProfile />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path="*" element={<Notfound />} />
          <Route path='/write' element={<CreatePost />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
};

export default App;