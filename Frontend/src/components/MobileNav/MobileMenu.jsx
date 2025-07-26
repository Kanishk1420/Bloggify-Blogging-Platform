/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader.jsx";
import { useUserlogoutMutation } from "../../api/auth.js";
import { logout } from "../../slices/AuthSlice.js";

const MobileMenu = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.theme);

  const [userlogout, { isLoading }] = useUserlogoutMutation();
  const [loading, setLoading] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      // Use the RTK Query hook that's already imported
      await userlogout().unwrap();

      // Clear Redux state
      dispatch(logout());

      // Clear any local storage items
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userToken"); // Add this line to clear the token
      localStorage.removeItem("likedPosts");
      localStorage.removeItem("bookmarkedPosts");

      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div
      className={`
  shadow-2xl 
  z-10 
  w-[120px] md:w-[150px]
  flex flex-col space-y-4 
  absolute top-1 
  right-0 md:-right-24
  ${theme ? "bg-zinc-900" : "bg-white"} 
  p-4 rounded-md 
  transition-all duration-300 transform origin-top-right
  max-h-[calc(100vh-80px)] overflow-y-auto`}
    >
      {!userInfo && (
        <>
          <Link to="/login">
            <h3
              className={`${
                theme ? "text-white" : "text-[#1576D8]"
              } hover:opacity-80 cursor-pointer`}
            >
              Login
            </h3>
          </Link>
          <Link to="/register">
            <h3
              className={`${
                theme ? "text-white" : "text-[#1576D8]"
              } hover:opacity-80 cursor-pointer`}
            >
              Register
            </h3>
          </Link>
        </>
      )}
      {userInfo && (
        <>
          <Link
            to={`/profile/${userInfo?.user?._id || userInfo?.updatedUser?._id}`}
          >
            <h3
              className={`${
                theme ? "text-white" : "text-gray-800"
              } hover:text-gray-500 cursor-pointer py-1`}
            >
              Profile
            </h3>
          </Link>

          <Link to="/finduser">
            <h3
              className={`${
                theme ? "text-white" : "text-gray-800"
              } hover:text-gray-500 cursor-pointer py-1`}
            >
              Find users
            </h3>
          </Link>

          <Link to="/dashboard">
            <h3
              className={`${
                theme ? "text-white" : "text-gray-800"
              } hover:text-gray-500 cursor-pointer py-1`}
            >
              Analytics
            </h3>
          </Link>

          <Link to="/write">
            <h3
              className={`${
                theme ? "text-white" : "text-gray-800"
              } hover:text-gray-500 cursor-pointer py-1`}
            >
              Write
            </h3>
          </Link>
          <h3
            className={`${
              theme ? "text-white" : "text-gray-800"
            } hover:text-gray-500 cursor-pointer py-1`}
            onClick={handleLogout}
          >
            Logout
          </h3>
        </>
      )}
    </div>
  );
};

export default MobileMenu;
