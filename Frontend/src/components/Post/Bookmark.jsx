/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types'
import { useAddBookmarkMutation , useRemoveBookmarkMutation  } from '../../api/post.js'
import {addBookmarkPost, removeBookmarkPost} from '../../slices/PostSlice.js'
import { useSelector, useDispatch } from 'react-redux'
import { BsBookmark } from 'react-icons/bs';
import { FaBookmark } from 'react-icons/fa';
import { toast } from 'react-toastify'

const Bookmark = ({ postId }) => {

    const [addBookmark] = useAddBookmarkMutation();
    const [removeBookmark] = useRemoveBookmarkMutation();
    const { bookmarkedPosts } = useSelector((state) => state.post);
    const { theme } = useSelector((state) => state.theme)

    const dispatch = useDispatch();


    const handleBookmark = async () => {
        try {
            const res = await addBookmark(postId).unwrap();
            toast.success("Post bookmarked successfully");
            await dispatch(addBookmarkPost(postId))
        } catch (err) {
            toast.error(err?.message || "Failed to bookmark the post");
            console.log(err);
        }
    };

    const handleRemoveBookmark = async () => {
        try {
            const res = await removeBookmark(postId).unwrap();
            toast.success("Bookmark removed successfully");
            await dispatch(removeBookmarkPost(postId))
        } catch (err) {
            toast.error(err?.message || "Failed to remove bookmark");
            console.log(err);
        }
    };


    return (
        <div>
            {bookmarkedPosts?.some((post) => post.postId === postId) ? (<FaBookmark size={21} className='cursor-pointer' color={`${theme ? "white" : "black"} `} onClick={handleRemoveBookmark} />
            ) : (<BsBookmark size={21} className='cursor-pointer' onClick={handleBookmark} />)}
        </div>
    )

}

Bookmark.propTypes = {
    postId: PropTypes.string.isRequired
}
export default Bookmark