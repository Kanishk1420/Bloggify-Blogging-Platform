import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useDeleteCommentMutation, useUpdateCommentMutation } from '../../api/comment'
import { toast } from 'react-toastify';
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
    const [localComment, setLocalComment] = useState(comment);
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
            await updateComment({ 
                commentId: comment._id,
                comment: editedComment, 
                userId: userInfo?.user?._id || userInfo?.updatedUser?._id
            }).unwrap();
            
            // Update UI immediately
            setEditMode(false);
            
            // Update local state instead of mutating props
            if (comment.comment !== editedComment) {
                setLocalComment({
                    ...comment,
                    comment: editedComment,
                    updatedAt: new Date().toISOString()
                });
            }
            
            toast.success("Comment updated successfully!");
        } catch (err) {
            console.log(err);
            toast.error(err?.data?.message || err?.message || "Try again later!");
        }
    };

    const handleLikeDislikeChange = ({ type, updatedComment }) => {
        // Define userId from userInfo
        const userId = userInfo?.user?._id || userInfo?.updatedUser?._id;
        
        if (updatedComment) {
            // If we have full updated comment data, use it
            setLocalComment(updatedComment);
        } else {
            // Otherwise make optimistic updates based on action type
            const newComment = { ...localComment };
            
            if (type === 'LIKE') {
                // Add user to likes if not already there
                if (!newComment.likes.includes(userId)) {
                    newComment.likes = [...newComment.likes, userId];
                }
                // Remove from dislikes if present
                newComment.dislikes = newComment.dislikes.filter(id => 
                    id !== userId && (typeof id === 'object' ? id._id !== userId : true)
                );
            } else if (type === 'UNLIKE') {
                // Remove from likes
                newComment.likes = newComment.likes.filter(id => 
                    id !== userId && (typeof id === 'object' ? id._id !== userId : true)
                );
            } else if (type === 'DISLIKE') {
                // Add to dislikes if not already there
                if (!newComment.dislikes.includes(userId)) {
                    newComment.dislikes = [...newComment.dislikes, userId];
                }
                // Remove from likes if present
                newComment.likes = newComment.likes.filter(id => 
                    id !== userId && (typeof id === 'object' ? id._id !== userId : true)
                );
            } else if (type === 'UNDISLIKE') {
                // Remove from dislikes
                newComment.dislikes = newComment.dislikes.filter(id => 
                    id !== userId && (typeof id === 'object' ? id._id !== userId : true)
                );
            }
            
            setLocalComment(newComment);
        }
    };

    useEffect(() => {
        setEditedComment(comment.comment)
    }, [comment.comment])

    return (
        <div className="border-t border-gray-700 py-4">
            <div key={comment._id} className="mb-4 last:mb-0">
                <div className="flex items-start justify-between mb-2">
                    {/* User image */}
                    <div className="flex-shrink-0 mr-3">
                        <img
                          src={data?.user?.profilePhoto?.url ?? avatar}
                          alt=""
                          className="w-10 h-10 object-cover rounded-full"
                        />
                    </div>

                    {/* Content container */}
                    <div className="flex-1 min-w-0">
                        {/* Header: username, time, and actions */}
                        <div className="flex items-start justify-between">
                            <div>
                                {/* Username */}
                                <h4 className="text-white font-medium">
                                    {`${data?.user?.firstname} ${data?.user?.lastname}`}
                                </h4>
                                
                                {/* Timestamp - fixed display */}
                                <div className="text-gray-400 text-xs">
                                    <span>{timeInfo.postedTime}</span>
                                    {timeInfo.hasBeenEdited && (
                                        <span className="ml-1">(edited {timeInfo.editedTime})</span>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            {userInfo?.user?._id === comment.userId && (
                                <div className="flex items-center space-x-3 ml-2">
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
                                </div>
                            )}
                        </div>

                        {/* Edit mode */}
                        {editMode && (
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
                                        disabled={editedComment === comment.comment}
                                        className={`w-full md:w-auto px-6 py-2.5 rounded-md font-medium transition duration-300 ${
                                            theme 
                                              ? 'bg-zinc-800 hover:bg-zinc-700 text-white'  // Dark theme
                                              : 'bg-blue-500 hover:bg-blue-600 text-white'  // Light theme - lighter blue
                                        } ${editedComment === comment.comment ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {editedComment === comment.comment ? "No Changes" : "Update"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Comment text - improved alignment */}
                        {!editMode && <p className='mt-1'>{localComment.comment}</p>}
                        
                        {/* Like/dislike buttons - improved alignment */}
                        {!editMode && (
                            <div className="flex items-center space-x-4 mt-2">
                                <CommentLike 
                                  comment={localComment} 
                                  onLikeDislikeChange={handleLikeDislikeChange} 
                                />
                                <CommentDislike 
                                  comment={localComment} 
                                  onLikeDislikeChange={handleLikeDislikeChange}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

Comment.propTypes = {
    comment: PropTypes.object.isRequired,
    userData: PropTypes.string.isRequired
};

export default Comment;
