/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types'
import { useAddBookmarkMutation , useRemoveBookmarkMutation  } from '../../api/post.js'
import {addBookmarkPost, removeBookmarkPost} from '../../slices/PostSlice.js'
import { useSelector, useDispatch } from 'react-redux'
import { BsBookmark } from 'react-icons/bs';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
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

    const isBookmarked = bookmarkedPosts?.some((post) => post.postId === postId);

    return (
        <button 
          onClick={isBookmarked ? handleRemoveBookmark : handleBookmark}
          className={`flex items-center gap-1 ${
            theme 
              ? "text-white hover:text-gray-300" 
              : "text-[#1576D8] hover:text-blue-700"
          }`}
        >
          {isBookmarked ? (
            <FaBookmark className={`${theme ? "text-white" : "text-[#1576D8]"}`} size={21} />
          ) : (
            <FaRegBookmark className={`${theme ? "text-white" : "text-[#1576D8]"}`} size={21} />
          )}
        </button>
    )

}

Bookmark.propTypes = {
    postId: PropTypes.string.isRequired
}
export default Bookmark