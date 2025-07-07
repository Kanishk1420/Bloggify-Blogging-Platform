import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaBookmark, FaHeart, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import avatar from '../../assets/avatar.jpg'
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer'
import { useGetAnalyticsQuery, useGetUserPostQuery } from '../../api/post'
import { useUserFollowerListQuery } from '../../api/user';

const Dashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!userInfo?.token) {
      navigate('/login');
    }
  }, [userInfo, navigate]);
  
  const userId = userInfo?.user?._id;
  const { data: userData } = useGetUserPostQuery(userId);
  const { data: followerData } = useUserFollowerListQuery(userId);
  const { data: analytics } = useGetAnalyticsQuery(undefined, {
    skip: !userInfo?.token
  });
  const { theme } = useSelector((state) => state.theme);
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * 5;
  const endIndex = Math.min(startIndex + 5, followerData?.followers?.length);

  const renderNoPostsMessage = () => {
    return <h1>Please post something :(</h1>;
  };

  return (
    <>
      <Navbar />
      <div className={`min-h-screen ${theme ? 'bg-gradient-to-b from-black to-gray-900 via-black text-white' : 'bg-white'}`}>
        <h1 className={`text-2xl font-semibold pt-5 pb-5 px-5 ${theme ? 'text-white' : 'text-black'}`}>Your Analytics</h1>
        <article className={`flex flex-col md:flex-row gap-4 rounded-lg p-6 ${theme ? 'bg-black/70 text-white ring-1 ring-slate-700' : 'bg-white border border-gray-200'}`}>
          {/* Views */}
          <div className='flex flex-col items-center mx-auto md:w-1/3'>
            <span className="rounded-full bg-slate-200 p-3 text-black ">
              <FaUser />
            </span>
            <div>
              <p className={`text-2xl text-center font-medium ${theme ? 'text-white' : 'text-gray-700'}`}>{followerData?.followers?.length || 0}</p>
              <p className="text-sm text-gray-500">Total Followers</p>
            </div>
          </div>
          {/* Likes */}
          <div className='flex flex-col items-center mx-auto md:w-1/3'>
            <span className="rounded-full bg-slate-200 p-3 text-black ">
              <FaHeart />
            </span>
            <div>
              <p className={`text-2xl text-center font-medium ${theme ? 'text-white' : 'text-gray-700'}`}>{analytics?.analytics?.totalLikes || 0}</p>
              <p className="text-sm text-gray-500">Total Likes</p>
            </div>
          </div>
          {/* Bookmark */}
          <div className='flex flex-col items-center mx-auto md:w-1/3'>
            <span className="rounded-full bg-slate-200 p-3 text-black ">
              <FaBookmark />
            </span>
            <div>
              <p className={`text-2xl text-center font-medium ${theme ? 'text-white' : 'text-gray-700'}`}>{analytics?.analytics?.totalBookmarks || 0}</p>
              <p className="text-sm text-gray-500">Total Bookmark</p>
            </div>
          </div>
        </article>
        <div className={`md:px-[160px] w-full mt-14 flex flex-col md:flex-row ${theme ? 'text-white' : ''}`}>
          {/* User posts */}
          <div className='grid grid-cols-1 max-sm:px-10 pb-10 md:w-1/2'>

            {userData?.userPost?.length > 0 ? (

              <>

                {userData?.userPost?.map((post) => (
                  <div key={post._id} className='cursor-pointer pb-3' onClick={() => navigate(`/posts/post/${post._id}`)}>
                    <article
                      className="hover:animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s] max-w-md"
                    >
                      <div className={`rounded-[10px] p-3 ${theme ? "bg-black" : "bg-white"}`}>
                        <div className="flex justify-between items-start">
                          <time className={`block text-xs ${theme ? "text-white" : "text-gray-400"}`}>
                            {new Date(post.updatedAt).toLocaleDateString()}
                          </time>
                        </div>
                        
                        <h3 className={`text-lg font-medium ${theme ? "text-white" : "text-gray-900"}`}>
                          {post.title}
                        </h3>
                        
                        {post.categories.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {post.categories?.map((category, index) => (
                              <span key={index} className="whitespace-nowrap rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-600">
                                {category}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </article>
                  </div>
                ))}
              </>
            ) : renderNoPostsMessage()}


          </div>

          {/* Followers section - Always render this container */}
          <div className="w-full md:w-1/2 mt-5 md:mt-0">
            <h1 className='font-semibold text-xl max-sm:px-5 md:flex md:justify-end'>Recent followers</h1>
            <div className="mt-5 max-sm:px-5 pb-9 md:float-end">
              {followerData?.followers?.length > 0 ? (
                <>
                  {followerData?.followers?.slice(startIndex, endIndex).map((followingUser) => (
                    <div key={followingUser._id} className="flex pb-4 items-center justify-between gap-3 cursor-pointer" onClick={() => navigate(`/profile/${followingUser._id}`)}>
                      <div className='flex items-center gap-3'>
                        <img src={followingUser.profilePhoto?.url ?? avatar} className='w-10 h-10 object-cover rounded-full' alt='' />
                        <p className='font-semibold '>{followingUser.username}</p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Pagination */}
                  {followerData?.followers?.length > 5 && (
                    <div className="flex justify-center items-center gap-2 mt-4">
                      <button
                        onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
                        disabled={currentPage === 1}
                        className={`${theme ? "text-white" : "text-black"} border rounded-md px-5 py-1 font-semibold`}
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
                        disabled={endIndex >= followerData?.followers?.length}
                        className={`${theme ? "text-white" : "text-black"} border rounded-md px-5 py-1 font-semibold`}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="md:text-right mt-4">
                  <h1 className="text-lg font-semibold">You don&apos;t have followers :(</h1>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
