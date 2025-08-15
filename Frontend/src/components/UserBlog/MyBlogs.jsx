 
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetUserPostQuery } from '../../api/post';
import { myPosts } from '../../slices/PostSlice';
import Loader from '../Loader/Loader';
import { Loader2 } from 'lucide-react';
import DOMPurify from 'dompurify';

const MyBlogs = ({ userId }) => {
    const { id } = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const postSearchQuery = searchParams.get('postsearch');
    
    const { data, isLoading } = useGetUserPostQuery(userId);
    const [userPost, setUserPost] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { theme } = useSelector((state) => state.theme);
    const [showLoader, setShowLoader] = useState(true);

    useEffect(() => {
        if (data) {
            setUserPost(data.userPost);
            dispatch(myPosts(data.userPost));
        } else {
            setUserPost([]);
        }
    }, [data, dispatch]);

    useEffect(() => {
        const delay = setTimeout(() => {
            setShowLoader(false);
        }, 500);

        return () => clearTimeout(delay);
    }, []);

    // Filter posts based on search term from URL
    useEffect(() => {
        if (!data?.userPost) return;
        
        if (!postSearchQuery) {
            setFilteredPosts(data.userPost);
        } else {
            const filtered = data.userPost.filter(post => 
                post.title.toLowerCase().includes(postSearchQuery.toLowerCase())
            );
            setFilteredPosts(filtered);
        }
    }, [data, postSearchQuery]);

    // Loading skeleton for cards
    const LoadingSkeleton = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-8">
            {[1, 2, 3, 4].map((item) => (
                <div 
                    key={item} 
                    className={`
                        rounded-xl overflow-hidden mb-6 transition-all
                        ${theme 
                            ? 'text-white border border-zinc-800/30 shadow-lg shadow-indigo-900/20' 
                            : 'bg-white/90 shadow-md shadow-gray-200/70 border border-gray-100'
                        }
                    `}
                >
                    <div className="w-full h-full p-4">
                        <div className={`h-[180px] ${theme ? 'bg-gray-700' : 'bg-gray-300'} animate-pulse rounded-lg mb-4`}></div>
                        <div className={`h-6 w-3/4 ${theme ? 'bg-gray-700' : 'bg-gray-300'} animate-pulse rounded-md mb-2`}></div>
                        <div className={`h-4 w-1/2 ${theme ? 'bg-gray-700' : 'bg-gray-300'} animate-pulse rounded-md mb-4`}></div>
                        <div className="flex justify-between">
                            <div className={`h-4 w-24 ${theme ? 'bg-gray-700' : 'bg-gray-300'} animate-pulse rounded-md`}></div>
                            <div className={`h-4 w-16 ${theme ? 'bg-gray-700' : 'bg-gray-300'} animate-pulse rounded-md`}></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    if (isLoading || showLoader) {
        return <LoadingSkeleton />;
    }

    return (
        <>
            {filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-8">
                    {filteredPosts.map((post) => (
                        <div 
                            key={post._id} 
                            className={`
                                rounded-xl overflow-hidden mb-6 transition-all cursor-pointer
                                ${theme 
                                    ? 'text-white border border-zinc-800/30 shadow-lg shadow-indigo-900/20 hover:shadow-indigo-900/30' 
                                    : 'bg-white/90 shadow-md shadow-gray-200/70 hover:shadow-gray-300/80 border border-gray-100'
                                }
                            `}
                            onClick={() => navigate(`/posts/post/${post._id}`)}
                        >
                            {/* Image Section */}
                            <div className="w-full h-[200px] overflow-hidden">
                                <img 
                                    src={post.photo?.url} 
                                    alt={post.title} 
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            
                            {/* Content Section */}
                            <div className={`p-4 ${theme ? 'backdrop-blur-sm bg-black/5' : ''}`}>
                                <h2 className={`text-xl font-semibold mb-2 line-clamp-2 ${
                                    theme ? 'text-white' : 'text-[#1e3a8a]'
                                }`}>
                                    {post.title}
                                </h2>
                                
                                <div className="flex justify-between items-center mb-3 text-sm">
                                    <p className={`font-medium ${theme ? 'text-gray-200' : 'text-black'}`}>
                                        {`${post.firstname} ${post.lastname}`}
                                    </p>
                                    <p className={`${theme ? 'text-gray-300' : 'text-gray-500'}`}>
                                        {new Date(post.updatedAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                
                                <div className={`text-xs ${theme ? 'text-gray-200' : 'text-gray-700'}`}>
                                    <p dangerouslySetInnerHTML={{ 
                                        __html: DOMPurify.sanitize(post.description.slice(0, 100) + "..Read More") 
                                    }} />
                                </div>
                                
                                {/* Tags - if available */}
                                {post.tags && post.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {post.tags.slice(0, 3).map((tag, index) => (
                                            <span 
                                                key={index}
                                                className={`
                                                    px-2 py-1 rounded-full text-xs font-medium
                                                    ${theme 
                                                        ? 'bg-indigo-900/20 backdrop-blur-sm text-gray-200' 
                                                        : 'bg-gray-100 text-[#1576D8]'
                                                    }
                                                `}
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={`
                    flex flex-col items-center justify-center py-16 px-4 
                    text-center mt-4
                `}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <h1 className='text-2xl font-bold'>
                        {postSearchQuery ? `No posts found matching "${postSearchQuery}"` : "No Posts Found"}
                    </h1>
                    <p className={`mt-2 ${theme ? "text-gray-400" : "text-gray-600"}`}>
                        {postSearchQuery 
                            ? "Try a different search term or check back later." 
                            : "This user hasn't published any posts yet."}
                    </p>
                </div>
            )}
        </>
    );
};

MyBlogs.propTypes = {
    userId: PropTypes.string.isRequired,
};

export default MyBlogs;
