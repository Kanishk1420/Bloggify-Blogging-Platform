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
    useUndislikePostMutation
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

    // Set initial like count - THIS IS WHERE THE INFINITE LOOP HAPPENS
    useEffect(() => {
        if (data?.getPost) {
            setLikeCount(data.getPost.likes?.length || 0);
            
            // Check if user has already liked the post
            const userHasLiked = data.getPost.likes?.some(
                likeId => likeId === userId || 
                (typeof likeId === 'object' && likeId._id === userId)
            );
            
            setIsLiked(userHasLiked);
            
            // CRITICAL FIX: Don't dispatch inside this effect
            // This was causing the infinite loop by updating Redux state
            // which triggered re-renders and called this effect again
        }
    }, [data, userId, postId]); // Remove likedPosts from dependencies

    // Initialize liked posts from backend in a separate effect
    useEffect(() => {
        // Only call this once on component mount, not on every update
        dispatch(getLikedPost());
    }, [dispatch]);       

    const handleLike = async () => {
        try {
            if (isLiked) {
                return toast.info("You've already liked this post");
            }
            
            // Check if post is disliked by this user
            const isDisliked = dislikedPosts?.some(post => 
                post.postId === postId && post.userId === userId
            );
            
            // If disliked, remove the dislike first
            if (isDisliked) {
                await undislikePost({ id: postId, userId });
                dispatch(removeDislike({ userId, postId }));
                
                // Update dislike element if it exists
                const dislikeElement = document.querySelector(`[data-dislike-id="${postId}"] span`);
                if (dislikeElement) {
                    const count = parseInt(dislikeElement.textContent);
                    if (!isNaN(count) && count > 0) {
                        dislikeElement.textContent = count - 1;
                    }
                }
            }
            
            // Optimistically update UI
            setIsLiked(true);
            setLikeCount(prev => prev + 1);
            
            await likePost({ id: postId, userId });
            dispatch(addLike({userId, postId}));
            
            // No need to refetch here - let RTK Query handle invalidation
            
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
            dispatch(removeLike({ userId, postId }));
            
            // No need to refetch here - let RTK Query handle invalidation
            
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