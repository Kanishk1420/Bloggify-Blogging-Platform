import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useDeleteCommentMutation, useUpdateCommentMutation } from '../../api/comment'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useGetUserQuery } from '../../api/user'
import avatar from '../../assets/avatar.jpg'
import CommentLike from '../Comment/CommentLike';
import CommentDislike from '../Comment/CommentDislike';

const Comment = ({ comment, userData }) => {
    const getTimeInfo = (comment) => {
        const createdAt = new Date(comment.createdAt);
        const updatedAt = new Date(comment.updatedAt);
        
        // Helper to format time elapsed
        const formatTimeElapsed = (timestamp) => {
            const now = new Date();
            const diff = Math.floor((now - timestamp) / 1000); // Difference in seconds
            
            if (diff < 60) return `${diff} seconds ago`;
            if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
            if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
            if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
            if (diff < 2592000) return `${Math.floor(diff / 604800)} weeks ago`;
            if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`;
            return `${Math.floor(diff / 31536000)} years ago`;
        };
        
        // Check if comment has been edited (allow 1 second difference for DB operations)
        const hasBeenEdited = (updatedAt - createdAt) > 1000;
        
        return {
            postedTime: formatTimeElapsed(createdAt),
            editedTime: hasBeenEdited ? formatTimeElapsed(updatedAt) : null,
            hasBeenEdited
        };
    };

    const { userInfo } = useSelector((state) => state.auth);
    const [deleteComment] = useDeleteCommentMutation();
    const [updateComment] = useUpdateCommentMutation();
    const [editMode, setEditMode] = useState(false);
    const [editedComment, setEditedComment] = useState(comment.comment);
    const navigate = useNavigate();
    const { data } = useGetUserQuery(userData);
    const { theme } = useSelector((state) => state.theme)

    const timeInfo = getTimeInfo(comment);

    const deleteCommentHandler = async () => {
        try {
            const id = comment._id;
            await deleteComment(id);
            window.location.reload();
        } catch (err) {
            console.log(err);
            toast.error(err?.message || "Try again later!!");
        }
    };

    const handleUpdateComment = async () => {
        try {
            const id = comment._id;
            await updateComment({ id: id, comment: editedComment, author: userInfo?.user?.id });
            setEditMode(false);
            toast.success("Comment updated successfully!");
            window.location.reload();
        } catch (err) {
            console.log(err);
            toast.error(err?.message || "Try again later!!");
        }
    };

    useEffect(() => {
        setEditedComment(comment.comment)
    }, [comment.comment])

    return (
        <>
            <div>
                <div className={` border-b-2 ${theme ? "border-slate-700" : "border-gray-200"} `}></div>
                <div className='px-2 py-2 my-2 rounded-md'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center'>
                            <img src={data?.user?.profilePhoto?.url ?? avatar} alt="" className='w-10 h-10 object-cover rounded-full mt-2' />
                            <div className='ml-2'>
                                <p className='font-bold cursor-pointer' onClick={() => navigate(`/profile/${comment.userId}`)}>
                                    {data?.user?.firstname} {data?.user?.lastname}
                                </p>
                            </div>
                        </div>
                        <div className='flex justify-center items-center space-x-4 text-sm'>
                            {/* Enhanced timestamp display */}
                            <div className='text-xs text-gray-500'>
                                <span>{timeInfo.postedTime}</span>
                                {timeInfo.hasBeenEdited && (
                                    <span className='ml-1 italic'>(edited {timeInfo.editedTime})</span>
                                )}
                            </div>
                            <div className="flex gap-2">
                                {userInfo?.user?._id === comment.userId && !editMode && (
                                    <>
                                        <button 
                                            onClick={() => setEditMode(true)}
                                            className={`${theme ? "text-white" : "text-[#1576D8]"} hover:opacity-80`}
                                        >
                                            <FaEdit size={16} />
                                        </button>
                                        <button 
                                            onClick={deleteCommentHandler}
                                            className={`${theme ? "text-red-400" : "text-red-500"} hover:opacity-80`}
                                        >
                                            <FaTrash size={16} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {editMode &&
                        <div className='mt-2'>
                            <div className='flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4'>
                                <textarea
                                    value={editedComment}
                                    onChange={(e) => setEditedComment(e.target.value)}
                                    className='w-full md:w-2/3 px-4 py-2 text-black bg-white rounded-md focus:outline-none focus:ring focus:ring-blue-200 h-10'
                                    placeholder='Write your comment here...'
                                ></textarea>
                                <button
                                    type='submit'
                                    onClick={handleUpdateComment}
                                    className='w-full md:w-auto h-auto px-6 bg-black rounded-md hover:bg-gray-800 transition duration-300'
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    }
                    
                    {/* Reduced margin on comment text */}
                    {!editMode && <p className='ml-12 -mt-2'>{comment.comment}</p>}
                    
                    {/* Adjusted margin on like/dislike buttons */}
                    {!editMode && (
                        <div className="flex items-center space-x-4 mt-2 ml-12">
                            <CommentLike comment={comment} />
                            <CommentDislike comment={comment} />
                        </div>
                    )}
                </div>
                <div className={` border-b-1 ${theme ? "border-slate-700" : "border-gray-200"} `}></div>
            </div>
        </>
    );
};

Comment.propTypes = {
    comment: PropTypes.object.isRequired,
    userData: PropTypes.string.isRequired
};

export default Comment;
