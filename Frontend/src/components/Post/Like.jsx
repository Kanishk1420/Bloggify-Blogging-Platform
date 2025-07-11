/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { addLike, getLikedPost, removeLike } from '../../slices/PostSlice';
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify';
import { useGetPostByIdQuery, useLikePostMutation, useUnlikePostMutation } from '../../api/post';

const Like = ({ postId }) => {
    const { likedPosts } = useSelector((state) => state.post);
    const [likecount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [likePost, { data: LikedData }] = useLikePostMutation();
    const [unlikePost] = useUnlikePostMutation();
    const { userInfo } = useSelector((state) => state.auth)
    const userId = userInfo?.user?._id;
    const { data } = useGetPostByIdQuery(postId);
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
                    dispatch(addLike(userId, postId));
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
            
            await likePost({ id: postId, userId });
            setIsLiked(true);
            dispatch(addLike(userId, postId));
            setLikeCount(prev => prev + 1);
            toast.success("Post liked successfully");
        } catch (err) {
            console.error("Like error:", err);
            toast.error("Failed to like post");
        }
    };

    const handleUnlike = async () => {
        try {
            await unlikePost({ id: postId, userId });
            setIsLiked(false);
            dispatch(removeLike({ userId, postId }));
            setLikeCount(prev => prev - 1);
            toast.info("Post unliked");
        } catch (err) {
            console.error("Unlike error:", err);
            toast.error("Failed to unlike post");
        }
    };

    return (
        <div className='flex gap-3 justify-start items-center mx-2'>
            {isLiked ? (
                <FaHeart size={21} className='cursor-pointer' color='red' onClick={handleUnlike} />
            ) : (
                <FaRegHeart size={21} className='cursor-pointer' onClick={handleLike} />
            )}
            <span className='mx-2'>{likecount}</span>
        </div>
    );
}

Like.propTypes = {
    postId: PropTypes.string.isRequired
};

export default Like;