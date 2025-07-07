/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../Loader/Loader.jsx';
import { useUserlogoutMutation } from '../../api/auth.js';
import { logout } from '../../slices/AuthSlice.js';

const MobileMenu = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.theme);

  const [userlogout, { isLoading }] = useUserlogoutMutation();
  const [loading, setLoading] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    setLoading(50)
    try {
      await userlogout().unwrap();
      dispatch(logout());
      navigate('/login');
      toast.success('Logged out successfully');
      setLoading(100)
    } catch (err) {
      toast.error(err?.data?.message);
    }
  }

  return (
    <div className={`shadow-2xl z-10 w-[200px] flex flex-col space-y-4 
      absolute top-1 
      left-28 md:left-28 lg:left-28 
      ${theme ? 'bg-zinc-900' : 'bg-white'} 
      p-4 rounded-md 
      transition-all duration-300 transform origin-top-right`}>
      
      {!userInfo && <>
        <Link to='/login'>
          <h3 className={`${theme ? 'text-white' : 'text-gray-800'} hover:text-gray-500 cursor-pointer`}>Login</h3>
        </Link>
        <Link to='/register'>
          <h3 className={`${theme ? 'text-white' : 'text-gray-800'} hover:text-gray-500 cursor-pointer`}>Register</h3>
        </Link>
      </>}
      {userInfo && <>
        <Link to={`/profile/${userInfo?.user?._id || userInfo?.updatedUser?._id}`} >
          <h3 className={`${theme ? 'text-white' : 'text-gray-800'} hover:text-gray-500 cursor-pointer`}>Profile</h3>
        </Link>

        <Link to='/finduser'>
          <h3 className={`${theme ? 'text-white' : 'text-gray-800'} hover:text-gray-500 cursor-pointer`}>Find users</h3>
        </Link>

        <Link to='/dashboard'>
          <h3 className={`${theme ? 'text-white' : 'text-gray-800'} hover:text-gray-500 cursor-pointer`}>Analytics</h3>
        </Link>

        <Link to='/write'>
          <h3 className={`${theme ? 'text-white' : 'text-gray-800'} hover:text-gray-500 cursor-pointer`}>Write</h3>
        </Link>
        <h3 className={`${theme ? 'text-white' : 'text-gray-800'} hover:text-gray-500 cursor-pointer`} onClick={handleLogout}>Logout</h3>
      </>}
    </div>
  );
};

export default MobileMenu;
