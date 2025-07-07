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
    const [isLiked, setisLiked] = useState(false)
    const [likePost, { data: LikedData }] = useLikePostMutation();
    const [unlikePost] = useUnlikePostMutation();
    const { userInfo } = useSelector((state) => state.auth)
    const userId = userInfo?.user?._id;
    const { data } = useGetPostByIdQuery(postId);
    const dispatch = useDispatch();

    useEffect(() => {
        if (data && postId) {
            setLikeCount(data?.getPost?.likes?.length)
        }


    }, [data?.getPost, postId])

    useEffect(() => {
        dispatch(getLikedPost())
    },[dispatch])       


    if (data?.likes?.includes(userId)) {
        return true;
    }
    const handleLike = async () => {
        try {
            if (likedPosts?.some((post) => post.postId === postId)) {
                return toast.error("You have already liked this post");

            }
            await likePost({ id: postId, userId: userInfo?.user?._id });
            setisLiked(true)
            dispatch(addLike(userId,postId));
            setLikeCount((prev) => prev + 1)
        } catch (err) {
            console.log(err);
        }
    };

    const handleUnlike = async () => {
        try {
            await unlikePost({ id: postId, userId: userInfo?.user?._id });
            setisLiked(false)
            dispatch(removeLike(userId));
            setLikeCount((prev) => prev - 1)

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className='flex gap-3 justify-start items-center mx-2'>
            {likedPosts.find((post) => post.userId === userId && post.postId === postId) ? (
                <FaHeart size={21} className='cursor-pointer' color='red' onClick={handleUnlike} />
            ) : (
                <FaRegHeart size={21} className='cursor-pointer' onClick={handleLike} />
            )}
            <span className='mx-2'>{likecount}</span>
        </div>
    )
}

Like.propTypes = {
    postId: PropTypes.string.isRequired
};

export default Like;