/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import DOMPurify from 'dompurify';
import { useCreateCommentMutation, useGetAllCommentQuery } from '../../api/comment'
import avatar from '../../assets/avatar.jpg'
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import PostDetailSkeleton from '../../components/Skeleton/PostDetailSkeleton'
import { IoPlayCircleOutline, IoShareOutline } from "react-icons/io5";
import { useDeletePostMutation, useGetPostByIdQuery } from '../../api/post';
import { useGetUserQuery } from '../../api/user';
import Bookmark from '../../components/Post/Bookmark'
import Like from '../../components/Post/Like'
import { getLikedPost, getPost } from '../../slices/PostSlice'
import Navbar from '../../components/Navbar/Navbar';
import Comment from '../../components/Post/Comment'
import Footer from '../../components/Footer/Footer';



const PostDetails = () => {
    const postId = useParams().id;
    const { data, isLoading } = useGetPostByIdQuery(postId);
    const { data: commentData, isLoading: commentLoader, error: commentError, refetch } = useGetAllCommentQuery(postId);
    const navigate = useNavigate();
    const [deletePost] = useDeletePostMutation();
    const [createComment] = useCreateCommentMutation();
    const { data: userData, isSuccess } = useGetUserQuery(data?.getPost?.userId);
    const [comment, setComment] = useState('');
    const { userInfo } = useSelector((state) => state.auth);
    const [showLoader, setShowLoader] = useState(true);
    const { theme } = useSelector((state) => state.theme)


    const dispatch = useDispatch();
    const userId = userInfo?.user?._id;

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
            navigate('/');
        } catch (err) {
            toast.error(err?.message || "Failed to delete the post");
            console.log(err);
        }
    };

    const commentHandler = async (e) => {
        e.preventDefault();
        if (comment.trim() === '') return toast.warning("Comment can't be empty");
        try {
            const commentData = {
                comment,
                postId,
                author: userInfo?.user?.username,
                userId: userInfo?.user?._id
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
                    url: window.location.href
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
            {showLoader ? <PostDetailSkeleton /> : (
                <div className={`${theme ? "bg-gradient-to-b from-black to-gray-800 via-black text-white" : ""}`}>
                    <div className={`px-4 md:px-8 py-7 max-w-4xl mx-auto `}>
                        <h1 className='text-4xl font-bold mb-4'>{data?.getPost?.title}</h1>
                        <div className='flex items-center space-x-2 text-sm text-gray-600 mb-4'>
                            <p>{new Date(data?.getPost?.updatedAt).toLocaleDateString()}</p>
                            <span>|</span>
                            <p>{new Date(data?.getPost?.updatedAt).toLocaleTimeString()}</p>
                        </div>

                        <div className={` border-b-2 mb-2 ${theme ? "border-slate-600" : "border-gray-100"}`}></div>

                        <div className="flex mb-5 mt-4">

                            {/* Like  */}
                            <div className=''>

                                {/* Like components */}
                                <Like postId={postId} />

                            </div>


                            <button className="flex text-gray-500 flex-grow justify-end gap-6">

                                {/* Bookmark  */}

                                <Bookmark postId={postId} />

                                <span><IoPlayCircleOutline size={21} className='cursor-pointer' title="Play" /></span>
                                <span><IoShareOutline size={21} className='cursor-pointer' title="Share" onClick={handleShare} /></span>
                            </button>
                        </div>

                        <div className={` border-b-2 mb-5 ${theme ? "border-slate-600" : "border-gray-100"}`}></div>

                        <div className='flex  justify-start items-center gap-3 mb-3'>
                            <img src={userData?.user?.profilePhoto?.url ? userData.user.profilePhoto?.url : avatar} className='w-10 h-10 rounded-full ring-1 ring-black cursor-pointer object-cover' alt="" />
                            <p className='font-semibold text-md cursor-pointer' onClick={() => navigate(`/profile/${data?.getPost?.userId}`)}>{userData?.user?.username}</p>

                            {/* Follow And Unfollow  */}

                            {userId === data?.getPost?.userId && (<>
                                <span className='text-gray-300'>•</span>
                                <p className='text-green-500 font-sans hover:text-zinc-400 cursor-pointer' onClick={() => navigate(`/profile/${userId}`)}>Your Profile</p>
                            </>)}


                        </div>
                        {data?.getPost?.photo?.url && (
                            <img
                                src={data?.getPost?.photo?.url}
                                loading='lazy'
                                className='w-full rounded-lg mb-6 shadow-xl'
                                alt=""
                            />
                        )}


                        <div className={`text-lg text-gray-800 leading-relaxed mb-6 font-serif ${theme ? "text-white" : ""}`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data?.getPost?.description) }} />

                        <div className='flex flex-wrap items-center space-x-2 mb-6'>
                            {data?.getPost?.categories.map((item, index) => (
                                <div key={index} className='bg-gray-200 rounded-md px-3 py-1 text-sm text-gray-600'>{item}</div>
                            ))}
                        </div>

                        <div className='flex items-center justify-between'>
                            {data?.getPost?.userId === userInfo?.user?._id && (
                                <div className='flex items-center space-x-2'>
                                    <button onClick={() => handleNavigate(`/edit/${postId}`)} className='flex items-center px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-md'><BiEdit size={20} />Edit</button>
                                    <button onClick={handleDelete} className='flex items-center px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-md'><MdDelete size={20} />Delete</button>
                                </div>
                            )}
                        </div>

                        <h3 className='text-xl font-semibold mt-8 mb-4'>Comments:</h3>
                        {commentError ? <h2 className='text-red-400'>Comments not found!!</h2> : (
                            <>
                                {commentData?.comments?.map((item) => (
                                    <Comment key={item._id} comment={item} userData={item.userId} />
                                ))}
                            </>
                        )}

                        <div className='mt-8'>
                            <h3 className='text-xl font-semibold mb-4'>Write Comment:</h3>
                            <div className='flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4'>
                                <textarea value={comment} onChange={(e) => setComment(e.target.value)} className='w-full md:w-2/3 px-4 py-2 bg-gray-100 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:ring focus:ring-blue-200' placeholder='Write your comment here...'></textarea>
                                <button disabled={commentLoader} type='submit' onClick={commentHandler} className={`w-full md:w-auto h-12 px-6 bg-zinc-950 text-white rounded-md hover:bg-zinc-600 transition duration-300 `}>Comment</button>
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
