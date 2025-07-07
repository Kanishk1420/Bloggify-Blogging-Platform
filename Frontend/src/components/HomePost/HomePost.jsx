/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

const HomePost = ({ post }) => {

  const desc = DOMPurify.sanitize(post.description.slice(0, 100) + "..Read More");
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const delay = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => clearTimeout(delay);
  }, []);

  return (

    <section className=''>
      <>
        {showLoader ? (

          <div className=''> 

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-8 max-xl:grid-cols-1 xl:max-w-[45rem]' >

              <div className='h-[200px] md:h-auto bg-gray-300 animate-pulse rounded-lg'></div>

              <div className='flex flex-col' >
                <div className='h-6 w-3/4 bg-gray-300 animate-pulse rounded-md mb-2'></div>
                <div className='h-4 w-1/2 bg-gray-300 animate-pulse rounded-md mb-4'></div>
                <div className='flex mb-2 items-center'>
                  <div className='h-4 w-16 bg-gray-300 animate-pulse rounded-md mr-2'></div>
                  <div className='h-4 w-16 bg-gray-300 animate-pulse rounded-md'></div>
                </div>
                <div className='h-20 w-full bg-gray-300 animate-pulse rounded-md'></div>
              </div >
            </div >

          </div>) : (<div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-8 max-xl:grid-cols-1 xl:max-w-[45rem] '>

            <div className='h-[150px] md:h-auto'>
              <img src={post.photo?.url} alt="" className={`w-full h-full max-xl:object-contain object-cover rounded-lg`} />
            </div>

            <div className='flex flex-col'>
              <h1 className='text-xl font-bold md:text-2xl'>{post.title}</h1>
              <div className='flex mb-2 text-sm font-semibold text-gray-500 justify-between items-center md:mb-4'>
                <p>{post.username}</p>
                <div className='flex space-x-2'>
                  {/* Format date and time */}
                  <p>{new Date(post.updatedAt).toLocaleDateString()}</p>
                  <p>{new Date(post.updatedAt).toLocaleTimeString()}</p>
                </div>
              </div>
              {/* Add max-width for tablet devices */}
              <p className='text-sm md:text-base max-w-xl' dangerouslySetInnerHTML={{ __html: desc }} />
            </div>
          </div>)}
      </>

    </section>
  );
};

HomePost.propTypes = {
  post: PropTypes.shape({
    description: PropTypes.string,
    photo: PropTypes.shape({
      url: PropTypes.string
    }),
    title: PropTypes.string,
    username: PropTypes.string,
    updatedAt: PropTypes.string
  }).isRequired
};

export default HomePost;
