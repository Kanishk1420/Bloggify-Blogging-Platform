/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetUserPostQuery } from '../../api/post';
import { myPosts } from '../../slices/PostSlice';
import Loader from '../Loader/Loader';
import { Loader2 } from 'lucide-react';

const MyBlogs = ({ userId }) => {
    const { id } = useParams();
    const { data, isLoading } = useGetUserPostQuery(userId);
    const [userPost, setUserPost] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (data) {
            setUserPost(data.userPost);
            dispatch(myPosts(data.userPost));
            window.location.reload();
        } else {
            setUserPost([]);

        }
    }, [id]);




    return (
        <>
            {isLoading ? (
                null
            ) : (
                <>
                    {data?.userPost?.length > 0 ? (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-8 max-xl:grid-cols-1 h-auto'>
                            {data?.userPost?.map((post) => (
                                <div key={post._id} className='flex flex-col cursor-pointer' onClick={() => navigate(`/posts/post/${post._id}`)}>
                                    <div className='h-auto'>
                                        <img src={post.photo?.url} alt="" className='w-full h-full object-cover shadow-xl rounded-md' />
                                    </div>
                                    <div>
                                        <h1 className='text-xl font-bold md:text-2xl'>{post.title}</h1>
                                        <div className='flex mb-2 text-sm font-semibold text-gray-500 justify-between items-center md:mb-4'>
                                            <p>{`${post.firstname} ${post.lastname}`}</p>
                                            <div className='flex space-x-2'>
                                                <p>{new Date(post.updatedAt).toLocaleDateString()}</p>
                                                <p>{new Date(post.updatedAt).toLocaleTimeString()}</p>
                                            </div>
                                        </div>
                                        <p className='text-sm md:text-lg' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.description.slice(0, 200) + "..Read More") }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <h1 className='text-2xl font-bold text-center mt-8'>No Post Found</h1>
                    )}
                </>
            )}
        </>
)
};

MyBlogs.propTypes = {
    userId: PropTypes.string.isRequired
};

export default MyBlogs;
