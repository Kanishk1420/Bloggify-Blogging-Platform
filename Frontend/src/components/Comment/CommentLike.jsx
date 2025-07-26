import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FaThumbsUp, FaRegThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useLikeCommentMutation, useUnlikeCommentMutation, useUndislikeCommentMutation } from '../../api/comment';

const CommentLike = ({ comment, onLikeDislikeChange }) => {
    const { theme } = useSelector((state) => state.theme);
    const [likeCount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [likeComment] = useLikeCommentMutation();
    const [unlikeComment] = useUnlikeCommentMutation();
    const [undislikeComment] = useUndislikeCommentMutation();
    const { userInfo } = useSelector((state) => state.auth);
    const userId = userInfo?.user?._id;
    
    // Set initial like count and check if user has liked
    useEffect(() => {
        if (comment) {
            setLikeCount(comment.likes?.length || 0);
            
            const userHasLiked = comment.likes?.some(
                likeId => likeId === userId || 
                (typeof likeId === 'object' && likeId._id === userId)
            );
            
            setIsLiked(userHasLiked);
        }
    }, [comment, userId]);
    
    const handleLike = async () => {
        try {
            if (!userId) {
                return toast.info("Please login to like comments");
            }
            
            if (isLiked) {
                return toast.info("You've already liked this comment");
            }
            
            // Check if comment is disliked by this user
            const isDisliked = comment.dislikes?.some(
                dislikeId => dislikeId === userId || 
                (typeof dislikeId === 'object' && dislikeId._id === userId)
            );
            
            // If disliked, remove the dislike first
            if (isDisliked) {
                await undislikeComment({ id: comment._id, userId });
                
                // IMPORTANT: Notify parent about the change
                if (onLikeDislikeChange) {
                    onLikeDislikeChange({
                        type: 'UNDISLIKE',
                        commentId: comment._id
                    });
                }
            }
            
            // Optimistically update UI
            setIsLiked(true);
            setLikeCount(prev => prev + 1);
            
            const response = await likeComment({ id: comment._id, userId });
            
            // IMPORTANT: Notify parent with updated comment data
            if (onLikeDislikeChange && response.data?.comment) {
                onLikeDislikeChange({
                    type: 'LIKE',
                    commentId: comment._id,
                    updatedComment: response.data.comment
                });
            }
            
        } catch (err) {
            console.error("Like error:", err);
            toast.error("Failed to like comment");
            // Revert optimistic UI update
            setIsLiked(false);
            setLikeCount(prev => prev - 1);
        }
    };
    
    const handleUnlike = async () => {
        try {
            // Optimistically update UI
            setIsLiked(false);
            setLikeCount(prev => prev - 1);
            
            const response = await unlikeComment({ id: comment._id, userId });
            
            // IMPORTANT: Notify parent with updated comment data
            if (onLikeDislikeChange && response.data?.comment) {
                onLikeDislikeChange({
                    type: 'UNLIKE',
                    commentId: comment._id,
                    updatedComment: response.data.comment
                });
            }
            
        } catch (err) {
            console.error("Unlike error:", err);
            toast.error("Failed to remove like");
            // Revert optimistic UI update
            setIsLiked(true);
            setLikeCount(prev => prev + 1);
        }
    };
    
    return (
        <div className='flex gap-1 justify-start items-center'>
            {isLiked ? (
                <FaThumbsUp size={14} className='cursor-pointer' color={theme ? '#4ade80' : '#22c55e'} onClick={handleUnlike} />
            ) : (
                <FaRegThumbsUp size={14} className='cursor-pointer' onClick={handleLike} />
            )}
            <span className='text-xs'>{likeCount}</span>
        </div>
    );
};

CommentLike.propTypes = {
    comment: PropTypes.object.isRequired,
    onLikeDislikeChange: PropTypes.func
};

export default CommentLike;