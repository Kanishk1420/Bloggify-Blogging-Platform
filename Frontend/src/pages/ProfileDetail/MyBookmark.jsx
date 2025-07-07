import DOMPurify from 'dompurify';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const MyBookmark = () => {
  const { bookmarkedPosts } = useSelector((state) => state.post);
  const navigate = useNavigate();

  return (
    <div className='container mx-auto mt-8'>
      {bookmarkedPosts.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {bookmarkedPosts.map((post) => (
            <div
              key={post.postId}
              className='flex flex-col cursor-pointer border rounded-md p-6 hover:shadow-lg'
              onClick={() => navigate(`/posts/post/${post.postId}`)}
            >
              <h1 className='text-2xl font-bold mb-4'>{post.postData.title}</h1>
              <div className='flex items-center mb-4'>
                <p className='text-gray-500 mr-4'>{post.postData.firstname} {post.postData.lastname}</p>
                <p className='text-gray-500'>{new Date(post.postData.updatedAt).toLocaleDateString()}</p>
              </div>
              <p className='text-gray-700' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.postData.description.slice(0, 200) + '...Read More') }} />
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h1 className='text-xl font-bold text-center'>No bookmarked posts</h1>
        </div>
      )}
    </div>
  );
};

export default MyBookmark;
