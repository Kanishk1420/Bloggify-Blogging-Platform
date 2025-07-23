/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import DOMPurify from "dompurify";
import {
  useCreateCommentMutation,
  useGetAllCommentQuery,
} from "../../api/comment";
import avatar from "../../assets/avatar.jpg";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import PostDetailSkeleton from "../../components/Skeleton/PostDetailSkeleton";
import { IoPlayCircleOutline, IoShareOutline } from "react-icons/io5";
import { useDeletePostMutation, useGetPostByIdQuery } from "../../api/post";
import { useGetUserQuery } from "../../api/user";
import Bookmark from "../../components/Post/Bookmark";
import Like from "../../components/Post/Like";
import Dislike from "../../components/Post/Dislike";
import { getLikedPost, getPost } from "../../slices/PostSlice";
import Navbar from "../../components/Navbar/Navbar";
import Comment from "../../components/Post/Comment";
import Footer from "../../components/Footer/Footer";

const PostDetails = () => {
  const postId = useParams().id;
  const { data, isLoading } = useGetPostByIdQuery(postId);
  const {
    data: commentData,
    isLoading: commentLoader,
    error: commentError,
    refetch,
  } = useGetAllCommentQuery(postId);
  const navigate = useNavigate();
  const [deletePost] = useDeletePostMutation();
  const [createComment] = useCreateCommentMutation();
  const { data: userData, isSuccess } = useGetUserQuery(data?.getPost?.userId);
  const [comment, setComment] = useState("");
  const { userInfo } = useSelector((state) => state.auth);
  const [showLoader, setShowLoader] = useState(true);
  const { theme } = useSelector((state) => state.theme);

  // Add a ref for the content div to apply custom styles
  const contentRef = useRef(null);

  const dispatch = useDispatch();
  const userId = userInfo?.user?._id;

  // Add custom CSS for code blocks
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
            /* Code block styling */
            .post-content pre {
                background-color: ${theme ? "#1e1e1e" : "#f5f5f5"} !important;
                border-radius: 6px !important;
                padding: 1rem !important;
                margin: 1.5rem 0 !important;
                overflow-x: auto !important;
                border: 1px solid ${theme ? "#333" : "#e0e0e0"} !important;
                font-family: 'Fira Code', Consolas, Monaco, 'Andale Mono', monospace !important;
            }
            
            .post-content pre code {
                font-size: 0.85rem !important;
                line-height: 1.5 !important;
                color: ${theme ? "#e0e0e0" : "#333"} !important;
            }
            
            .post-content code:not(pre code) {
                background-color: ${theme ? "#2d2d2d" : "#f0f0f0"} !important;
                color: ${theme ? "#e0e0e0" : "#333"} !important;
                padding: 0.2em 0.4em !important;
                border-radius: 3px !important;
                font-family: 'Fira Code', Consolas, Monaco, 'Andale Mono', monospace !important;
                font-size: 0.85rem !important;
            }
            
            .post-content blockquote {
                border-left: 4px solid ${
                  theme ? "#4a5568" : "#e2e8f0"
                } !important;
                padding-left: 1rem !important;
                margin-left: 0 !important;
                color: ${theme ? "#a0aec0" : "#4a5568"} !important;
            }
            
            .post-content h1, 
            .post-content h2 {
                border-bottom: 1px solid ${
                  theme ? "#2d3748" : "#edf2f7"
                } !important;
                padding-bottom: 0.5rem !important;
                margin-top: 2rem !important;
            }
            
            .post-content a {
                color: ${theme ? "#63b3ed" : "#3182ce"} !important;
                text-decoration: none !important;
            }
            
            .post-content a:hover {
                text-decoration: underline !important;
            }
            
            .post-content img {
                max-width: 100% !important;
                height: auto !important;
                border-radius: 6px !important;
            }
            
            .post-content table {
                border-collapse: collapse !important;
                width: 100% !important;
                margin: 1rem 0 !important;
            }
            
            .post-content th, 
            .post-content td {
                border: 1px solid ${theme ? "#4a5568" : "#e2e8f0"} !important;
                padding: 0.5rem !important;
            }
            
            .post-content th {
                background-color: ${theme ? "#2d3748" : "#edf2f7"} !important;
            }
        `;

    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [theme]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => clearTimeout(delay);
  }, []);

  useEffect(() => {
    if (data && data.getPost) {
      dispatch(getPost(data?.getPost));
    }
  }, [data, dispatch]);

  const handleDelete = async () => {
    try {
      await deletePost(postId);
      toast.success("Post deleted successfully");
      navigate("/");
    } catch (err) {
      toast.error(err?.message || "Failed to delete the post");
      console.log(err);
    }
  };

  const commentHandler = async (e) => {
    e.preventDefault();
    if (comment.trim() === "") return toast.warning("Comment can't be empty");
    try {
      const commentData = {
        comment,
        postId,
        author: userInfo?.user?.username,
        userId: userInfo?.user?._id,
      };
      await createComment(commentData);
      setComment("");
      toast.success("Comment added successfully");
      refetch();
    } catch (err) {
      toast.error(err?.message || "Failed to add comment");
      console.log(err);
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleShare = async () => {
    const shareText = `${data?.getPost?.title}\n${window.location.href}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: data?.getPost?.title,
          text: shareText,
          url: window.location.href,
        });
        console.log("Post shared successfully");
      } catch (err) {
        console.error("Error sharing post:", err);
      }
    } else {
      console.log("Web Share API not supported");
    }
  };

  return (
    <>
      <Navbar />
      {showLoader ? (
        <PostDetailSkeleton />
      ) : (
        <div
          className={`${
            theme
              ? "bg-gradient-to-b from-black to-gray-800 via-black text-white"
              : "bg-gray-50"
          }`}
        >
          <div className={`px-4 md:px-8 py-7 max-w-4xl mx-auto`}>
            {/* Article Header */}
            <div
              className={`${
                theme ? "bg-zinc-900/60" : "bg-white"
              } rounded-xl p-6 md:p-8 mb-6 shadow-lg`}
            >
              <h1
                className={`text-3xl md:text-4xl font-bold mb-4 leading-tight ${
                  theme ? "text-white" : "text-[#1e3a8a]"
                }`}
              >
                {data?.getPost?.title}
              </h1>

              {/* Date info */}
              <div
                className={`flex items-center space-x-2 text-sm ${
                  theme ? "text-gray-400" : "text-gray-600"
                } mb-4`}
              >
                <p>
                  {new Date(data?.getPost?.updatedAt).toLocaleDateString(
                    "en-US",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </p>
                <span>•</span>
                <p>
                  {new Date(data?.getPost?.updatedAt).toLocaleTimeString(
                    "en-US",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
              </div>

              {/* Tags/Categories - Moved here for better visibility */}
              {data?.getPost?.categories?.length > 0 && (
                <div className="mb-4 flex flex-wrap items-center">
                  <div
                    className={`mr-2 ${
                      theme ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 inline-block mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    <span className="text-xs font-medium">Tags:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {data?.getPost?.categories.map((item, index) => (
                      <div
                        key={index}
                        className={`px-2 py-1 text-xs rounded-full transition-transform hover:scale-105 ${
                          theme
                            ? "bg-purple-900/30 text-purple-300 border border-purple-800/30"
                            : "bg-purple-50 text-purple-700 border border-purple-100"
                        }`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div
                className={`border-b mb-4 ${
                  theme ? "border-zinc-700" : "border-gray-200"
                }`}
              ></div>

              {/* Author Info */}
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={
                    userData?.user?.profilePhoto?.url
                      ? userData.user.profilePhoto?.url
                      : avatar
                  }
                  className="w-10 h-10 rounded-full ring-1 ring-gray-300 cursor-pointer object-cover shadow-sm"
                  alt="Author"
                  onClick={() => navigate(`/profile/${data?.getPost?.userId}`)}
                />
                <div>
                  <p
                    className="font-semibold cursor-pointer hover:underline"
                    onClick={() =>
                      navigate(`/profile/${data?.getPost?.userId}`)
                    }
                  >
                    {userData?.user?.firstname} {userData?.user?.lastname}
                  </p>
                  {userId === data?.getPost?.userId && (
                    <p
                      className="text-sm text-green-500 hover:text-green-600 cursor-pointer"
                      onClick={() => navigate(`/profile/${userId}`)}
                    >
                      Your Profile
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {data?.getPost?.photo?.url && (
              <div className="mb-8">
                <img
                  src={data?.getPost?.photo?.url}
                  loading="lazy"
                  className="w-full rounded-xl shadow-lg object-cover max-h-[500px]"
                  alt={data?.getPost?.title}
                />
              </div>
            )}

            {/* Article Content */}
            <div
              className={`${
                theme ? "bg-zinc-900/60" : "bg-white"
              } rounded-xl p-6 md:p-8 mb-6 shadow-lg`}
            >
              <div
                ref={contentRef}
                className={`post-content ${
                  theme ? "text-gray-200" : "text-gray-800"
                } leading-relaxed mb-6`}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(data?.getPost?.description),
                }}
              />

              {/* Categories */}
              {data?.getPost?.categories?.length > 0 && (
                <div className="mt-8 mb-6">
                  <p
                    className={`text-sm ${
                      theme ? "text-gray-400" : "text-gray-600"
                    } mb-2`}
                  >
                    Categories:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {data?.getPost?.categories.map((item, index) => (
                      <div
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm ${
                          theme
                            ? "bg-zinc-800 text-gray-300 border border-zinc-700"
                            : "bg-gray-100 text-gray-700 border border-gray-200"
                        }`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interaction Buttons */}
              <div
                className={`border-t ${
                  theme ? "border-zinc-700" : "border-gray-200"
                } pt-4 mt-6`}
              >
                <div className="flex items-center">
                  <div className="flex items-center gap-4">
                    <Like postId={postId} />
                    <Dislike postId={postId} />
                  </div>

                  <div className="flex flex-grow justify-end items-center gap-6">
                    <Bookmark postId={postId} />

                    <button
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${
                        theme
                              ? "bg-zinc-800 text-white hover:bg-zinc-700"
                              : "bg-gray-200 text-gray-800 hover:bg-[#1576D8] hover:text-white"
                          } transition-all duration-200`}
                      onClick={handleShare}
                      title="Share"
                    >
                      <IoShareOutline size={18} />
                      <span className="text-sm hidden sm:inline">Share</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Edit/Delete Buttons */}
              {data?.getPost?.userId === userInfo?.user?._id && (
                <div className="flex items-center gap-3 mt-6">
                  <button
                    onClick={() => handleNavigate(`/edit/${postId}`)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                      theme
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-100 hover:bg-blue-200 text-blue-800"
                    } transition-colors`}
                  >
                    <BiEdit size={18} className={theme ? "" : "text-blue-600"} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                      theme
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-red-100 hover:bg-red-200 text-red-800"
                    } transition-colors`}
                  >
                    <MdDelete size={18} className={theme ? "" : "text-red-600"} />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div
              className={`${
                theme ? "bg-zinc-900/60" : "bg-white"
              } rounded-xl p-6 md:p-8 shadow-lg`}
            >
              <h3 className="text-xl font-semibold mb-6 text-gray-700">Comments</h3>

              {commentError ? (
                <p className="text-red-400 mb-6">Unable to load comments</p>
              ) : commentData?.comments?.length === 0 ? (
                <p
                  className={`${
                    theme ? "text-gray-400" : "text-gray-600"
                  } mb-6`}
                >
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                <div className="space-y-4 mb-8">
                  {commentData?.comments?.map((item) => (
                    <Comment
                      key={item._id}
                      comment={item}
                      userData={item.userId}
                    />
                  ))}
                </div>
              )}

              {/* Comment Form */}
              <div className="mt-6">
                <h3
                  className={`text-lg font-medium mb-4 ${
                    theme ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  Write a comment
                </h3>
                <div className="flex flex-col space-y-4">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg ${
                      theme
                        ? "bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500"
                        : "bg-gray-50 text-gray-800 border border-gray-300 focus:border-blue-500"
                    } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    placeholder="Share your thoughts..."
                    rows={4}
                  ></textarea>
                  <div>
                    <button
                      disabled={commentLoader}
                      type="submit"
                      onClick={commentHandler}
                      className={`w-full md:w-auto px-8 py-3 rounded-lg font-medium transition bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white`}
                    >
                      {commentLoader ? "Posting..." : "Post Comment"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default PostDetails;
