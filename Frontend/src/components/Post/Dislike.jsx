import { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import { FaThumbsDown, FaRegThumbsDown } from 'react-icons/fa';
import { addDislike, removeDislike, removeLike } from '../../slices/PostSlice';
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify';
import { 
  useGetPostByIdQuery, 
  useDislikePostMutation, 
  useUndislikePostMutation,
  useUnlikePostMutation 
} from '../../api/post';

const Dislike = ({ postId }) => {
    const { dislikedPosts, likedPosts } = useSelector((state) => state.post);
    const { theme } = useSelector((state) => state.theme);
    const [dislikeCount, setDislikeCount] = useState(0);
    const [isDisliked, setIsDisliked] = useState(false);
    const [dislikePost] = useDislikePostMutation();
    const [undislikePost] = useUndislikePostMutation();
    const [unlikePost] = useUnlikePostMutation();
    const { userInfo } = useSelector((state) => state.auth)
    const userId = userInfo?.user?._id;
    const { data, refetch } = useGetPostByIdQuery(postId);
    const dispatch = useDispatch();

    // Set initial dislike count
    useEffect(() => {
        if (data?.getPost) {
            setDislikeCount(data.getPost.dislikes?.length || 0);
            
            // Check if user has already disliked the post
            const userHasDisliked = data.getPost.dislikes?.some(
                dislikeId => dislikeId === userId || 
                (typeof dislikeId === 'object' && dislikeId._id === userId)
            );
            
            setIsDisliked(userHasDisliked);
            
            // Sync with Redux store
            if (userHasDisliked) {
                const dislikeExists = dislikedPosts?.some(post => post.postId === postId && post.userId === userId);
                if (!dislikeExists) {
                    dispatch(addDislike({userId, postId}));
                }
            }
        }
    }, [data, userId, postId, dispatch, dislikedPosts]);

    const handleDislike = async () => {
        try {
            if (isDisliked) {
                return toast.info("You've already disliked this post");
            }
            
            // Check if post is liked, unlike it first
            const isLiked = likedPosts?.some(post => post.postId === postId && post.userId === userId);
            if (isLiked) {
                await unlikePost({ id: postId, userId });
                dispatch(removeLike({ userId, postId }));
            }
            
            // Optimistically update UI
            setIsDisliked(true);
            setDislikeCount(prev => prev + 1);
            
            await dislikePost({ id: postId, userId });
            
            // Update Redux store
            dispatch(addDislike({userId, postId}));
            
            // Refetch to ensure data consistency
            refetch();
            
            toast.success("Post disliked");
        } catch (err) {
            console.error("Dislike error:", err);
            toast.error("Failed to dislike post");
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
            
            await undislikePost({ id: postId, userId });
            
            // Update Redux store
            dispatch(removeDislike({ userId, postId }));
            
            // Refetch to ensure data consistency
            refetch();
            
            toast.info("Dislike removed");
        } catch (err) {
            console.error("Undislike error:", err);
            toast.error("Failed to remove dislike");
            // Revert optimistic UI update
            setIsDisliked(true);
            setDislikeCount(prev => prev + 1);
        }
    };

    // Add data-attribute for targeting this component from the Like component
    return (
        <div className='flex gap-3 justify-start items-center mx-2' data-dislike-id={postId}>
            {isDisliked ? (
                <FaThumbsDown size={18} className='cursor-pointer' color={theme ? '#f87171' : '#dc2626'} onClick={handleUndislike} />
            ) : (
                <FaRegThumbsDown size={18} className='cursor-pointer' onClick={handleDislike} />
            )}
            <span className='mx-2 text-sm'>{dislikeCount}</span>
        </div>
    );
}

Dislike.propTypes = {
    postId: PropTypes.string.isRequired
};

export default Dislike;