/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import DOMPurify from 'dompurify';

const HomePost = ({ post }) => {
  const { theme } = useSelector((state) => state.theme);
  const [showLoader, setShowLoader] = useState(true);

  // Format date in a readable format without using date-fns
  const formattedDate = new Date(post?.createdAt || post?.updatedAt).toLocaleDateString();
  
  // Extract a short description (first 100 characters)
  const desc = DOMPurify.sanitize(post.description.slice(0, 100) + "..Read More");

  useEffect(() => {
    const delay = setTimeout(() => {
      setShowLoader(false);
    }, 500); // Reduced from 1000ms to 500ms for faster loading

    return () => clearTimeout(delay);
  }, []);

  return (
    <div className={`
      rounded-xl overflow-hidden mb-6 transition-all
      ${theme 
        ? 'text-white border border-zinc-800/30 shadow-lg shadow-indigo-900/20 hover:shadow-indigo-900/30' 
        : 'bg-white/90 shadow-md shadow-gray-200/70 hover:shadow-gray-300/80 border border-gray-100'
      }
    `}>
      {showLoader ? (
        // Loader skeleton
        <div className="w-full h-full p-4">
          <div className={`h-[180px] ${theme ? 'bg-gray-700' : 'bg-gray-300'} animate-pulse rounded-lg mb-4`}></div>
          <div className={`h-6 w-3/4 ${theme ? 'bg-gray-700' : 'bg-gray-300'} animate-pulse rounded-md mb-2`}></div>
          <div className={`h-4 w-1/2 ${theme ? 'bg-gray-700' : 'bg-gray-300'} animate-pulse rounded-md mb-4`}></div>
          <div className="flex justify-between">
            <div className={`h-4 w-24 ${theme ? 'bg-gray-700' : 'bg-gray-300'} animate-pulse rounded-md`}></div>
            <div className={`h-4 w-16 ${theme ? 'bg-gray-700' : 'bg-gray-300'} animate-pulse rounded-md`}></div>
          </div>
        </div>
      ) : (
        <>
          {/* Image Section - Full width with consistent height */}
          <div className="w-full h-[200px] overflow-hidden">
            <img 
              src={post.photo?.url || post.image?.url} 
              alt={post.title} 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          
          {/* Content Section - Now with backdrop-blur for better text readability */}
          <div className={`p-4 ${theme ? 'backdrop-blur-sm bg-black/5' : ''}`}>
            <h2 className={`text-xl font-semibold mb-2 line-clamp-2 post-card-title ${
  theme ? 'text-white' : 'text-[#1e3a8a]'
}`}>
              {post.title}
            </h2>
            
            <div className="flex justify-between items-center mb-3 text-sm">
              <p className={`font-medium ${theme ? 'text-gray-200' : 'text-black'}`}>
                {post.firstname && post.lastname 
                  ? `${post.firstname} ${post.lastname}`
                  : post.userId?.firstname && post.userId?.lastname
                    ? `${post.userId.firstname} ${post.userId.lastname}`
                    : post.username || post.userId?.username  // Fallback to username if name not available
                }
              </p>
              <p className={`${theme ? 'text-gray-300' : 'text-gray-500'}`}>
                {formattedDate}
              </p>
            </div>
            
            <div className={`text-sm ${theme ? 'text-gray-200' : 'text-gray-600'}`}>
              <p dangerouslySetInnerHTML={{ __html: desc }} />
            </div>
            
            {/* Tags - if available */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {post.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${theme 
                        ? 'bg-indigo-900/20 backdrop-blur-sm text-gray-200' 
                        : 'bg-gray-100 text-gray-700'
                      }
                    `}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

HomePost.propTypes = {
  post: PropTypes.shape({
    description: PropTypes.string,
    photo: PropTypes.shape({
      url: PropTypes.string
    }),
    image: PropTypes.shape({
      url: PropTypes.string
    }),
    title: PropTypes.string,
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    username: PropTypes.string,
    userId: PropTypes.object,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
    tags: PropTypes.array
  }).isRequired
};

export default HomePost;
