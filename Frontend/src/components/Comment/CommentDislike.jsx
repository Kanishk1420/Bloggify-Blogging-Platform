import  { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FaThumbsDown, FaRegThumbsDown } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useDislikeCommentMutation, useUndislikeCommentMutation, useUnlikeCommentMutation } from '../../api/comment';

const CommentDislike = ({ comment }) => {
    const { theme } = useSelector((state) => state.theme);
    const [dislikeCount, setDislikeCount] = useState(0);
    const [isDisliked, setIsDisliked] = useState(false);
    const [dislikeComment] = useDislikeCommentMutation();
    const [undislikeComment] = useUndislikeCommentMutation();
    const [unlikeComment] = useUnlikeCommentMutation();
    const { userInfo } = useSelector((state) => state.auth);
    const userId = userInfo?.user?._id;
    
    // Set initial dislike count and check if user has disliked
    useEffect(() => {
        if (comment) {
            setDislikeCount(comment.dislikes?.length || 0);
            
            const userHasDisliked = comment.dislikes?.some(
                dislikeId => dislikeId === userId || 
                (typeof dislikeId === 'object' && dislikeId._id === userId)
            );
            
            setIsDisliked(userHasDisliked);
        }
    }, [comment, userId]);
    
    const handleDislike = async () => {
        try {
            if (!userId) {
                return toast.info("Please login to dislike comments");
            }
            
            if (isDisliked) {
                return toast.info("You've already disliked this comment");
            }
            
            // Check if comment is liked by this user
            const isLiked = comment.likes?.some(
                likeId => likeId === userId || 
                (typeof likeId === 'object' && likeId._id === userId)
            );
            
            // If liked, remove the like first
            if (isLiked) {
                await unlikeComment({ id: comment._id, userId });
                
                // Update like count element if it exists
                const likeCountElement = document.querySelector(`[data-comment-like-id="${comment._id}"] span`);
                if (likeCountElement) {
                    const currentCount = parseInt(likeCountElement.textContent);
                    if (!isNaN(currentCount) && currentCount > 0) {
                        likeCountElement.textContent = currentCount - 1;
                    }
                }
            }
            
            // Optimistically update UI
            setIsDisliked(true);
            setDislikeCount(prev => prev + 1);
            
            await dislikeComment({ id: comment._id, userId });
            
        } catch (err) {
            console.error("Dislike error:", err);
            toast.error("Failed to dislike comment");
            // Revert optimistic UI update
            setIsDisliked(false);
            setDislikeCount(prev => prev - 1);
        }
    };
    
    const handleUndislike = async () => {
        try {
            // Optimistically update UI
            setIsDisliked(false);
            setDislikeCount(prev => prev - 1);
            
            await undislikeComment({ id: comment._id, userId });
            
        } catch (err) {
            console.error("Undislike error:", err);
            toast.error("Failed to remove dislike");
            // Revert optimistic UI update
            setIsDisliked(true);
            setDislikeCount(prev => prev + 1);
        }
    };
    
    return (
        <div className='flex gap-1 justify-start items-center' data-comment-dislike-id={comment._id}>
            {isDisliked ? (
                <FaThumbsDown size={14} className='cursor-pointer' color={theme ? '#f87171' : '#dc2626'} onClick={handleUndislike} />
            ) : (
                <FaRegThumbsDown size={14} className='cursor-pointer' onClick={handleDislike} />
            )}
            <span className='text-xs'>{dislikeCount}</span>
        </div>
    );
};

CommentDislike.propTypes = {
    comment: PropTypes.object.isRequired
};

export default CommentDislike;