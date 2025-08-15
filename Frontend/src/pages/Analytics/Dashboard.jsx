import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaBookmark, FaHeart, FaUser, FaThumbsDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { DEFAULT_AVATAR, getRandomAvatar } from '../../utils/avatarUtil';
import OptimizedAvatar from "../../components/Avatar/OptimizedAvatar";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import PageTransition from "../../components/PageTransition/PageTransition";
import { useGetAnalyticsQuery, useGetUserPostQuery } from "../../api/post";
import { useUserFollowerListQuery } from "../../api/user";

const Dashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    // Check both token and isAuthenticated flag
    const authCheck = setTimeout(() => {
      if (!userInfo?.token && !userInfo?.user) {
        // Store the intended destination for redirect after login
        sessionStorage.setItem("redirectAfterLogin", "/dashboard");
        navigate("/login");
      }
    }, 100);

    return () => clearTimeout(authCheck);
  }, [userInfo, navigate]);

  const userId = userInfo?.user?._id;
  const { data: userData } = useGetUserPostQuery(userId);
  const { data: followerData } = useUserFollowerListQuery(userId);
  const { data: analytics } = useGetAnalyticsQuery(undefined, {
    skip: !userInfo?.token,
  });
  const { theme } = useSelector((state) => state.theme);
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * 5;
  const endIndex = Math.min(startIndex + 5, followerData?.followers?.length);

  const renderNoPostsMessage = () => {
    return (
      <div className="flex flex-col items-center justify-center p-8 rounded-lg bg-opacity-10 backdrop-blur-sm border border-gray-700/30">
        <p className="text-lg font-medium mb-2">No posts yet</p>
        <p className="text-sm opacity-70">
          Start creating content to see your analytics
        </p>
        <button
          onClick={() => navigate("/write")}
          className="mt-4 px-5 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-md hover:opacity-90 transition-all"
        >
          Create Post
        </button>
      </div>
    );
  };

  useEffect(() => {
  }, [userInfo]);

  return (
    <>
      <PageTransition type="slide">
        <Navbar />
        <div
          className={`min-h-screen pb-20 ${
            theme
              ? "bg-gradient-to-b from-zinc-900 to-black text-white"
              : "bg-gradient-to-b from-white to-slate-50"
          }`}
        >
          <div className="container mx-auto px-4 py-8">
            <h1
              className={`text-3xl font-bold mb-8 border-l-4 border-purple-600 pl-4 ${
                theme ? "text-white" : "text-gray-800"
              }`}
            >
              Your Analytics Dashboard
            </h1>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {/* Followers Card */}
              <div
                className={`relative overflow-hidden rounded-xl p-6 ${
                  theme
                    ? "bg-zinc-900 border border-zinc-700"
                    : "bg-white shadow-lg"
                } transition-all hover:shadow-xl`}
              >
                <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-purple-500/10"></div>
                <div className="flex items-start">
                  <div
                    className={`p-3 rounded-lg ${
                      theme ? "bg-purple-900/30" : "bg-purple-100"
                    }`}
                  >
                    <FaUser
                      className={`text-xl ${
                        theme ? "text-purple-300" : "text-purple-700"
                      }`}
                    />
                  </div>
                </div>
                <h3 className="mt-4 text-3xl font-bold">
                  {followerData?.followers?.length || 0}
                </h3>
                <p
                  className={`text-sm ${
                    theme ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Total Followers
                </p>
                <div className="absolute bottom-0 right-0 h-1 w-full bg-gradient-to-r from-purple-500 to-indigo-500"></div>
              </div>

              {/* Likes Card */}
              <div
                className={`relative overflow-hidden rounded-xl p-6 ${
                  theme
                    ? "bg-zinc-900 border border-zinc-700"
                    : "bg-white shadow-lg"
                } transition-all hover:shadow-xl`}
              >
                <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-red-500/10"></div>
                <div className="flex items-start">
                  <div
                    className={`p-3 rounded-lg ${
                      theme ? "bg-red-900/30" : "bg-red-100"
                    }`}
                  >
                    <FaHeart
                      className={`text-xl ${
                        theme ? "text-red-300" : "text-red-700"
                      }`}
                    />
                  </div>
                </div>
                <h3 className="mt-4 text-3xl font-bold">
                  {analytics?.analytics?.totalLikes || 0}
                </h3>
                <p
                  className={`text-sm ${
                    theme ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Total Likes
                </p>
                <div className="absolute bottom-0 right-0 h-1 w-full bg-gradient-to-r from-red-500 to-pink-500"></div>
              </div>
              {/* Dislikes Card */}
              <div
                className={`relative overflow-hidden rounded-xl p-6 ${
                  theme
                    ? "bg-zinc-900 border border-zinc-700"
                    : "bg-white shadow-lg"
                } transition-all hover:shadow-xl`}
              >
                <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-orange-500/10"></div>
                <div className="flex items-start">
                  <div
                    className={`p-3 rounded-lg ${
                      theme ? "bg-orange-900/30" : "bg-orange-100"
                    }`}
                  >
                    <FaThumbsDown
                      className={`text-xl ${
                        theme ? "text-orange-300" : "text-orange-700"
                      }`}
                    />
                  </div>
                </div>
                <h3 className="mt-4 text-3xl font-bold">
                  {analytics?.analytics?.totalDislikes || 0}
                </h3>
                <p
                  className={`text-sm ${
                    theme ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Total Dislikes
                </p>
                <div className="absolute bottom-0 right-0 h-1 w-full bg-gradient-to-r from-orange-500 to-yellow-500"></div>
              </div>
              {/* Bookmarks Card */}
              <div
                className={`relative overflow-hidden rounded-xl p-6 ${
                  theme
                    ? "bg-zinc-900 border border-zinc-700"
                    : "bg-white shadow-lg"
                } transition-all hover:shadow-xl`}
              >
                <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-blue-500/10"></div>
                <div className="flex items-start">
                  <div
                    className={`p-3 rounded-lg ${
                      theme ? "bg-blue-900/30" : "bg-blue-100"
                    }`}
                  >
                    <FaBookmark
                      className={`text-xl ${
                        theme ? "text-blue-300" : "text-blue-700"
                      }`}
                    />
                  </div>
                </div>
                <h3 className="mt-4 text-3xl font-bold">
                  {analytics?.analytics?.totalBookmarks || 0}
                </h3>
                <p
                  className={`text-sm ${
                    theme ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Total Bookmarks
                </p>
                <div className="absolute bottom-0 right-0 h-1 w-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
              </div>
            </div>

            {/* Content Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* User Posts Section */}
              <div>
                <h2
                  className={`text-xl font-semibold mb-5 border-b pb-2 ${
                    theme
                      ? "border-gray-700 text-white"
                      : "border-gray-300 text-gray-700"
                  }`}
                >
                  Your Recent Posts
                </h2>
                <div className="space-y-4">
                  {userData?.userPost?.length > 0
                    ? userData?.userPost?.map((post) => (
                        <div
                          key={post._id}
                          onClick={() => navigate(`/posts/post/${post._id}`)}
                          className={`cursor-pointer transform transition-all hover:scale-[1.01] rounded-lg overflow-hidden border ${
                            theme
                              ? "border-zinc-700 hover:border-zinc-600"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div
                            className={`p-4 ${
                              theme ? "bg-zinc-900" : "bg-white"
                            }`}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <time
                                className={`text-xs ${
                                  theme ? "text-gray-400" : "text-gray-500"
                                }`}
                              >
                                {new Date(post.updatedAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </time>
                            </div>
                            <h3
                              className={`text-lg font-semibold mb-2 line-clamp-2 ${
                                theme ? "text-white" : "text-gray-800"
                              }`}
                            >
                              {post.title}
                            </h3>
                            {post.categories?.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {post.categories?.map((category, index) => (
                                  <span
                                    key={index}
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      theme
                                        ? "bg-purple-900/30 text-purple-300"
                                        : "bg-purple-100 text-purple-700"
                                    }`}
                                  >
                                    {category}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="h-1 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></div>
                        </div>
                      ))
                    : renderNoPostsMessage()}
                </div>
              </div>

              {/* Followers Section */}
              <div>
                <h2
                  className={`text-xl font-semibold mb-5 border-b pb-2 ${
                    theme
                      ? "border-gray-700 text-white"
                      : "border-gray-300 text-gray-700"
                  } lg:text-right`}
                >
                  Recent Followers
                </h2>
                <div className="space-y-4">
                  {followerData?.followers?.length > 0 ? (
                    <>
                      {followerData?.followers
                        ?.slice(startIndex, endIndex)
                        .map((followingUser) => (
                          <div
                            key={followingUser._id}
                            onClick={() =>
                              navigate(`/profile/${followingUser._id}`)
                            }
                            className={`cursor-pointer flex items-center p-3 rounded-lg transition-all hover:scale-[1.01] ${
                              theme
                                ? "bg-zinc-900 hover:bg-zinc-800 border border-zinc-800"
                                : "bg-white hover:bg-gray-50 shadow-sm hover:shadow"
                            }`}
                          >
                            <OptimizedAvatar
                              src={followingUser.profilePhoto?.url || getRandomAvatar(followingUser._id)}
                              className="w-12 h-12 rounded-full object-cover border-2 border-purple-500 p-0.5"
                              alt={followingUser.username || "Follower"}
                              fallbackSrc={DEFAULT_AVATAR}
                              loading="lazy"
                            />
                            <div className="ml-3">
                              {/* Show full name first as primary information */}
                              {followingUser.firstname &&
                              followingUser.lastname ? (
                                <p className="font-medium">
                                  {followingUser.firstname}{" "}
                                  {followingUser.lastname}
                                </p>
                              ) : (
                                <p className="font-medium">
                                  {followingUser.username}
                                </p>
                              )}

                              {/* Show username as secondary information */}
                              {followingUser.username &&
                                (followingUser.firstname ||
                                  followingUser.lastname) && (
                                  <p
                                    className={`text-xs ${
                                      theme ? "text-gray-400" : "text-gray-500"
                                    }`}
                                  >
                                    @
                                    {followingUser.username.startsWith("@")
                                      ? followingUser.username.substring(1)
                                      : followingUser.username}
                                  </p>
                                )}
                            </div>
                          </div>
                        ))}

                      {/* Pagination */}
                      {followerData?.followers?.length > 5 && (
                        <div className="flex justify-center mt-6 gap-3">
                          <button
                            onClick={() =>
                              setCurrentPage((prevPage) =>
                                Math.max(prevPage - 1, 1)
                              )
                            }
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-md transition-all ${
                              currentPage === 1
                                ? `${
                                    theme
                                      ? "bg-zinc-800 text-gray-500"
                                      : "bg-gray-100 text-gray-400"
                                  } cursor-not-allowed`
                                : `${
                                    theme
                                      ? "bg-zinc-800 hover:bg-zinc-700 text-white"
                                      : "bg-white hover:bg-gray-100 text-gray-800 border border-gray-300"
                                  }`
                            }`}
                          >
                            Previous
                          </button>
                          <button
                            onClick={() =>
                              setCurrentPage((prevPage) => prevPage + 1)
                            }
                            disabled={
                              endIndex >= followerData?.followers?.length
                            }
                            className={`px-4 py-2 rounded-md transition-all ${
                              endIndex >= followerData?.followers?.length
                                ? `${
                                    theme
                                      ? "bg-zinc-800 text-gray-500"
                                      : "bg-gray-100 text-gray-400"
                                  } cursor-not-allowed`
                                : `${
                                    theme
                                      ? "bg-purple-800 hover:bg-purple-700 text-white"
                                      : "bg-purple-600 hover:bg-purple-700 text-white"
                                  }`
                            }`}
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div
                      className={`flex flex-col items-center justify-center p-6 rounded-lg ${
                        theme
                          ? "bg-zinc-900 border border-zinc-800"
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      <p className="text-lg font-medium mb-1">
                        No followers yet
                      </p>
                      <p
                        className={`text-sm ${
                          theme ? "text-gray-400" : "text-gray-500"
                        } text-center`}
                      >
                        Share your posts to gain followers!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </PageTransition>
    </>
  );
};

export default Dashboard;
