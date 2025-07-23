/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import avatar from '../../assets/avatar.jpg'
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import MyBlogs from '../../components/UserBlog/MyBlogs'
import { useFollowUserMutation, useGetUserQuery, useUnfollowUserMutation, useUserFollowerListQuery, useUserFollowingListQuery } from '../../api/user';
import MyBookmark from './MyBookmark';
import Loader from '../../components/Loader/Loader';
import Userfollowing from './Userfollowing';
import UserFollowers from './UserFollowers'



const Profile = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const userId = useParams().id;
  const navigate = useNavigate();
  const pathname = window.location.pathname;
  const [userData, setUserData] = useState(null)
  const [activeLink, setActiveLink] = useState('posts');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('following');
  const { data, isLoading } = useGetUserQuery(userId);
  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();
  const { data: isFollowingData, isLoading: isFollowingLoading, refetch: refetchFollowing, isSuccess: Following } = useUserFollowingListQuery(userId);
  const { data: isFollowerData, isLoading: isFollowerLoading, refetch: refetchFollowers, isSuccess: Followers } = useUserFollowerListQuery(userId);
  const dispatch = useDispatch();

  const { theme } = useSelector((state) => state.theme);
  const [loading, setLoading] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [processing, setProcessing] = useState(false)
  const effectRun = useRef(false)




  useEffect(() => {
    if (!isLoading && data && pathname.includes(userId)) {
      setUserData(data.user);
      setFollowerCount(data?.user?.followers?.length)
    }
  }, [data, isLoading]);

  useEffect(() => {
    return () => {
      setShowModal(false);
    };
  }, [userId]);



  const handleFollowingClick = () => {
    setShowModal(true);
    setModalType('following');
  };

  const handleFollowersClick = () => {
    setShowModal(true);
    setModalType('followers');
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleFollow = async () => {
    try {
      setProcessing(true)
      setLoading(50);
      const res = await followUser(userId).unwrap();
      setFollowerCount((prev) => Math.max(prev + 1, 1))
      refetchFollowing();
      refetchFollowers();
    } catch (error) {
      console.error('Error following user:', error);
      toast.error(error?.data?.message || 'Failed to follow user');

    } finally {
      setProcessing(false)
      setLoading(0)
    }
  };

  const handleUnfollow = async () => {
    try {
      setProcessing(true)
      setLoading(50);
      await unfollowUser(userId).unwrap();
      setFollowerCount((prev) => Math.max(prev - 1, -1))
      refetchFollowing();
      refetchFollowers();

    } catch (error) {
      console.error('Error unfollowing user:', error);
      toast.error(error?.data?.message || 'Failed to unfollow user');
      setLoading(0);
    } finally {
      setProcessing(false)
      setLoading(0)
    }
  };


  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    } else {
      document.body.style.overflow = 'auto'; // Allow scrolling when modal is closed
    }

    const handleClickOutside = (event) => {
      const modalOverlay = document.querySelector('.fixed.inset-0');
      const modalContent = document.querySelector('.profile-modal');

      if (modalOverlay && modalContent && !modalContent.contains(event.target)) {
        setShowModal(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto'; // Reset overflow when component unmounts
    };
  }, [showModal]);

  return (
    <section className='modal-content'>
      <Navbar />

      {loading > 0 && (
        <div>
          <span
            role="progressbar"
            aria-labelledby="ProgressLabel"
            aria-valuenow={loading}
            className="block rounded-full bg-slate-700 relative overflow-hidden"
            style={{ height: '3px' }}
          >
            <span className="block absolute inset-0 bg-indigo-600" style={{ width: `${loading}%`, transition: 'width 0.3s ease-in-out' }}></span>
          </span>
        </div>
      )}


      <div className={`px-4  pb-80 overflow-y-auto ${theme ? " bg-gradient-to-b from-black to-gray-900 via-black text-white" : ""}  `}>
        <div className='flex md:flex-row justify-center flex-col-reverse '>
          <div className='md:w-2/3 md:px-4 mt-4'>
            {/* Updated tab navigation with blue color for light mode */}
            {userInfo?.user?._id === userId && (
              <div className='flex justify-start items-center gap-6 mb-4'>
                <h1
                  className={`text-xl font-semibold cursor-pointer ${
                    activeLink === 'posts' 
                    ? theme 
                        ? 'border-b-2 border-white text-white' 
                        : 'border-b-2 border-[#1576D8] text-[#1576D8]' 
                    : theme 
                        ? 'text-gray-300 hover:text-white' 
                        : 'text-gray-600 hover:text-[#1576D8]'
                  }`}
                  onClick={() => setActiveLink('posts')}
                >
                  Your posts
                </h1>
                <h1
                  className={`text-xl font-semibold cursor-pointer ${
                    activeLink === 'bookmarks' 
                    ? theme 
                        ? 'border-b-2 border-white text-white' 
                        : 'border-b-2 border-[#1576D8] text-[#1576D8]' 
                    : theme 
                        ? 'text-gray-300 hover:text-white' 
                        : 'text-gray-600 hover:text-[#1576D8]'
                  }`}
                  onClick={() => setActiveLink('bookmarks')}
                >
                  Bookmarks
                </h1>
              </div>
            )}
            {activeLink === 'posts' ? (
              <>
                <h1 className='text-xl font-bold mt-5'>Posts</h1>
                <MyBlogs userId={userId} />
              </>
            ) : (
              <>
                <h1 className='text-xl font-bold mt-8'></h1>
                <MyBookmark userId={userId} />
              </>
            )}

          </div>
          <div className='md:w-1/3 pl-4 mt-8 md:mt-8'>
            {/* Profile Card */}
            <div className={`rounded-xl overflow-hidden shadow-lg ${
              theme ? "bg-zinc-900 shadow-zinc-800/50" : "bg-white shadow-gray-200/70"
            }`}>
              {/* Profile Header/Cover */}
              <div className={`h-24 w-full ${
                theme ? "bg-gradient-to-r from-blue-900 to-purple-900" : "bg-gradient-to-r from-blue-400 to-purple-500"
              }`}></div>
              
              {/* Profile Content */}
              <div className="px-6 pb-6 relative">
                {/* Profile Picture - Positioned to overlap header */}
                <div className="flex justify-center -mt-12 mb-3">
                  {!userData ? (
                    <div className={`w-24 h-24 rounded-full animate-pulse ${
                      theme ? "bg-gray-700" : "bg-gray-300"
                    }`}></div>
                  ) : (
                    <div className={`w-24 h-24 rounded-full overflow-hidden border-4 ${
                      theme ? "border-zinc-900 bg-zinc-900" : "border-white bg-white"
                    } shadow-md`}>
                      <img 
                        src={userData?.profilePhoto?.url ?? avatar} 
                        alt='profile' 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  )}
                </div>
                
                {!userData ? (
                  <Loader />
                ) : (
                  <>
                    {/* User Info */}
                    <div className="text-center mb-4">
                      <h2 className={`text-xl font-bold ${theme ? "text-white" : "text-gray-800"}`}>
                        {userData?.firstname} {userData?.lastname}
                      </h2>
                      <p className={`text-sm ${theme ? "text-gray-300" : "text-gray-600"}`}>
                        @{userData?.username?.replace('@', '')}
                      </p>
                      <p className={`mt-2 ${theme ? "text-gray-400" : "text-gray-700"}`}>
                        {userData?.bio || "No bio provided"}
                      </p>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex justify-center mb-4">
                      {userInfo?.user?._id === userId ? (
                         <button className='btn-donate mt-3 btn-custom' onClick={() => navigate(`/profile/edit/${userInfo?.user?._id}`)}>Edit profile</button>
                      ) : (
                        <div>
                          {isFollowerData?.followers?.find((user) => user._id === userInfo?.user?._id) ? (
                            // Unfollow button - keep as is
                            <button 
                              onClick={handleUnfollow}
                              disabled={processing}
                              className={`flex items-center gap-2 px-8 py-2 rounded-full font-medium transition-all ${
                                processing
                                  ? "bg-gray-500 cursor-not-allowed"
                                  : theme
                                    ? "bg-gray-200 hover:bg-gray-300 text-black" 
                                    : "bg-zinc-800 hover:bg-zinc-700 text-white"
                              }`}
                            >
                              {/* Button content remains the same */}
                              {processing ? (
                                <>
                                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014.708 14H2c0 4.418 3.582 8 8 8v-2c-3.314 0-6-2.686-6-6zM20 12c0-4.418-3.582-8-8-8v2c3.314 0 6 2.686 6 6 0 1.385-.468 2.657-1.25 3.682l1.562 1.562A7.962 7.962 0 0020 12z"></path>
                                  </svg>
                                  Processing
                                </>
                              ) : (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
                                  </svg>
                                  Unfollow
                                </>
                              )}
                            </button>
                          ) : (
                            // Follow button - keep as is
                            <button 
                              onClick={handleFollow}
                              disabled={processing}
                              className={`flex items-center gap-2 px-8 py-2 rounded-full font-medium transition-all ${
                                processing
                                  ? "bg-gray-500 cursor-not-allowed"
                                  : "w-full md:w-auto rounded-full font-medium transition bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                              }`}
                            >
                              {processing ? (
                                <>
                                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014.708 14H2c0 4.418 3.582 8 8 8v-2c-3.314 0-6-2.686-6-6zM20 12c0-4.418-3.582-8-8-8v2c3.314 0 6 2.686 6 6 0 1.385-.468 2.657-1.25 3.682l1.562 1.562A7.962 7.962 0 0020 12z"></path>
                                  </svg>
                                  Processing
                                </>
                              ) : (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                  </svg>
                                  Follow
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Stats */}
                    <div className={`flex justify-center border-t border-b py-3 ${
                      theme ? "border-zinc-800" : "border-gray-200"
                    }`}>
                      <div onClick={handleFollowersClick} className="w-1/2 text-center cursor-pointer hover:bg-opacity-10 hover:bg-blue-500 px-2 py-1 rounded-md transition-colors">
                        <p className={`text-xl font-bold ${theme ? "text-white" : "text-gray-800"}`}>
                          {followerCount}
                        </p>
                        <p className={`text-sm ${theme ? "text-gray-400" : "text-gray-600"}`}>
                          Followers
                        </p>
                      </div>
                      <div onClick={handleFollowingClick} className="w-1/2 text-center cursor-pointer hover:bg-opacity-10 hover:bg-blue-500 px-2 py-1 rounded-md transition-colors">
                        <p className={`text-xl font-bold ${theme ? "text-white" : "text-gray-800"}`}>
                          {userData?.following?.length || 0}
                        </p>
                        <p className={`text-sm ${theme ? "text-gray-400" : "text-gray-600"}`}>
                          Following
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Optional: User's Recent Activity or Additional Info */}
            <div className={`mt-4 rounded-xl overflow-hidden shadow-lg ${
              theme ? "bg-zinc-900 shadow-zinc-800/50" : "bg-white shadow-gray-200/70"
            }`}>
              <div className="p-4">
                <h3 className={`font-medium mb-2 ${theme ? "text-gray-200" : "text-gray-700"}`}>
                  Member since
                </h3>
                <p className={`text-sm ${theme ? "text-gray-400" : "text-gray-600"}`}>
                  {userData?.createdAt 
                    ? new Date(userData.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : "Loading..."
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="flex items-center justify-center min-h-screen">
            <div className={`profile-modal ${theme ? "bg-zinc-950 text-white" : "bg-white text-black"} p-4 rounded-lg max-w-2xl`}>

              <div className="">
                {modalType === 'following' ? <Userfollowing /> : <UserFollowers />}
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </section>
  );
};

export default Profile;
