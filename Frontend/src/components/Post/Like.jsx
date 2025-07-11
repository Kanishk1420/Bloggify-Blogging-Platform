/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import { FaThumbsUp, FaRegThumbsUp } from 'react-icons/fa';
import { addLike, getLikedPost, removeLike, removeDislike } from '../../slices/PostSlice';
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify';
import { 
    useGetPostByIdQuery, 
    useLikePostMutation, 
    useUnlikePostMutation,
    useUndislikePostMutation // Import from post API file instead
} from '../../api/post';

const Like = ({ postId }) => {
    const { likedPosts, dislikedPosts } = useSelector((state) => state.post);
    const { theme } = useSelector((state) => state.theme);
    const [likecount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [likePost] = useLikePostMutation();
    const [unlikePost] = useUnlikePostMutation();
    const [undislikePost] = useUndislikePostMutation(); 
    const { userInfo } = useSelector((state) => state.auth)
    const userId = userInfo?.user?._id;
    const { data, refetch } = useGetPostByIdQuery(postId);
    const dispatch = useDispatch();

    // Set initial like count
    useEffect(() => {
        if (data?.getPost) {
            setLikeCount(data.getPost.likes?.length || 0);
            
            // Check if user has already liked the post
            const userHasLiked = data.getPost.likes?.some(
                likeId => likeId === userId || 
                (typeof likeId === 'object' && likeId._id === userId)
            );
            
            setIsLiked(userHasLiked);
            
            // Sync with Redux store
            if (userHasLiked) {
                const likeExists = likedPosts.some(post => post.postId === postId && post.userId === userId);
                if (!likeExists) {
                    dispatch(addLike({userId, postId}));
                }
            }
        }
    }, [data, userId, postId, dispatch, likedPosts]);

    // Initialize liked posts from backend
    useEffect(() => {
        dispatch(getLikedPost());
    }, [dispatch]);      

    const handleLike = async () => {
        try {
            if (isLiked) {
                return toast.info("You've already liked this post");
            }
            
            // Check if post is already disliked
            const isDisliked = dislikedPosts?.some(post => 
                post.postId === postId && post.userId === userId
            );
            
            // If disliked, remove the dislike first
            if (isDisliked) {
                await undislikePost({ id: postId, userId });
                dispatch(removeDislike({ userId, postId }));
                
                // Find dislike component in same parent and update its state
                // This is a bit hacky but works for immediate UI update
                const dislikeCountElement = document.querySelector(`[data-dislike-id="${postId}"] span`);
                if (dislikeCountElement) {
                    const currentCount = parseInt(dislikeCountElement.textContent);
                    if (!isNaN(currentCount) && currentCount > 0) {
                        dislikeCountElement.textContent = currentCount - 1;
                    }
                }
            }
            
            // Continue with the like operation
            await likePost({ id: postId, userId });
            
            // Optimistically update UI
            setIsLiked(true);
            setLikeCount(prev => prev + 1);
            
            // Update Redux store
            dispatch(addLike({userId, postId}));
            
            // Refetch to ensure data consistency
            refetch();
            
            toast.success("Post liked successfully");
        } catch (err) {
            console.error("Like error:", err);
            toast.error("Failed to like post");
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
            
            await unlikePost({ id: postId, userId });
            
            // Update Redux store
            dispatch(removeLike({ userId, postId }));
            
            // Refetch to ensure data consistency
            refetch();
            
            toast.info("Post unliked");
        } catch (err) {
            console.error("Unlike error:", err);
            toast.error("Failed to unlike post");
            // Revert optimistic UI update
            setIsLiked(true);
            setLikeCount(prev => prev + 1);
        }
    };

    return (
        <div className='flex gap-3 justify-start items-center mx-2'>
            {isLiked ? (
                <FaThumbsUp size={18} className='cursor-pointer' color={theme ? '#4ade80' : '#22c55e'} onClick={handleUnlike} />
            ) : (
                <FaRegThumbsUp size={18} className='cursor-pointer' onClick={handleLike} />
            )}
            <span className='mx-2 text-sm'>{likecount}</span>
        </div>
    );
}

Like.propTypes = {
    postId: PropTypes.string.isRequired
};

export default Like;