import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DOMPurify from "dompurify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const MyBookmark = () => {
  const { bookmarkedPosts } = useSelector((state) => state.post);
  const { theme } = useSelector((state) => state.theme);
  const navigate = useNavigate();
  const [showLoader, setShowLoader] = useState(true);
  const [filteredBookmarks, setFilteredBookmarks] = useState([]);
  
  // Get search query from URL
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const bookmarkSearchQuery = searchParams.get('bookmarksearch');

  useEffect(() => {
    const delay = setTimeout(() => {
      setShowLoader(false);
    }, 500);

    return () => clearTimeout(delay);
  }, []);

  // Filter bookmarks based on search term from URL
  useEffect(() => {
    if (!bookmarkedPosts || bookmarkedPosts.length === 0) {
      setFilteredBookmarks([]);
      return;
    }
    
    if (!bookmarkSearchQuery) {
      setFilteredBookmarks(bookmarkedPosts);
    } else {
      const filtered = bookmarkedPosts.filter(post => 
        post.postData.title.toLowerCase().includes(bookmarkSearchQuery.toLowerCase())
      );
      setFilteredBookmarks(filtered);
    }
  }, [bookmarkedPosts, bookmarkSearchQuery]);

  // Loading skeleton for bookmarks
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-8">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className={`
            rounded-xl overflow-hidden mb-6 transition-all
            ${
              theme
                ? "text-white border border-zinc-800/30 shadow-lg shadow-indigo-900/20"
                : "bg-white/90 shadow-md shadow-gray-200/70 border border-gray-100"
            }
          `}
        >
          <div className="w-full h-full p-4">
            <div
              className={`h-[180px] ${
                theme ? "bg-gray-700" : "bg-gray-300"
              } animate-pulse rounded-lg mb-4`}
            ></div>
            <div
              className={`h-6 w-3/4 ${
                theme ? "bg-gray-700" : "bg-gray-300"
              } animate-pulse rounded-md mb-2`}
            ></div>
            <div
              className={`h-4 w-1/2 ${
                theme ? "bg-gray-700" : "bg-gray-300"
              } animate-pulse rounded-md mb-4`}
            ></div>
            <div className="flex justify-between">
              <div
                className={`h-4 w-24 ${
                  theme ? "bg-gray-700" : "bg-gray-300"
                } animate-pulse rounded-md`}
              ></div>
              <div
                className={`h-4 w-16 ${
                  theme ? "bg-gray-700" : "bg-gray-300"
                } animate-pulse rounded-md`}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (showLoader) {
    return (
      <div className="container mx-auto px-4">
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      {filteredBookmarks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {filteredBookmarks.map((post) => (
            <div
              key={post.postId}
              className={`
                rounded-xl overflow-hidden mb-6 transition-all cursor-pointer
                ${
                  theme
                    ? "text-white border border-zinc-800/30 shadow-lg shadow-indigo-900/20 hover:shadow-indigo-900/30"
                    : "bg-white/90 shadow-md shadow-gray-200/70 hover:shadow-gray-300/80 border border-gray-100"
                }
              `}
              onClick={() => navigate(`/posts/post/${post.postId}`)}
            >
              {/* Image Section */}
              <div className="w-full h-[200px] overflow-hidden">
                <img
                  src={post.postData.photo?.url || post.postData.image?.url}
                  alt={post.postData.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    // Fallback for missing images
                    e.target.src =
                      "https://via.placeholder.com/800x400?text=Blog+Image";
                  }}
                />
              </div>

              {/* Content Section */}
              <div
                className={`p-4 ${theme ? "backdrop-blur-sm bg-black/5" : ""}`}
              >
                <h2
                  className={`text-xl font-semibold mb-2 line-clamp-2 ${
                    theme ? "text-white" : "text-[#1e3a8a]"
                  }`}
                >
                  {post.postData.title}
                </h2>

                <div className="flex justify-between items-center mb-3 text-sm">
                  <p
                    className={`font-medium ${
                      theme ? "text-gray-200" : "text-black"
                    }`}
                  >
                    {post.postData.firstname} {post.postData.lastname}
                  </p>
                  <p className={`${theme ? "text-gray-300" : "text-gray-500"}`}>
                    {new Date(post.postData.updatedAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>

                <div
                  className={`text-xs ${
                    theme ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  <p
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        post.postData.description.slice(0, 100) + "..Read More"
                      ),
                    }}
                  />
                </div>

                {/* Tags - if available */}
                {post.postData.tags && post.postData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {post.postData.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className={`
            px-2 py-1 rounded-full text-xs font-medium
            ${
              theme
                ? "bg-indigo-900/20 backdrop-blur-sm text-gray-200"
                : "bg-gray-100 text-[#1576D8]"
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
        <div
          className={`
          rounded-xl overflow-hidden p-10 text-center
        `}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-16 w-16 mx-auto mb-4 ${
              theme ? "text-gray-500" : "text-gray-400"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
          <h3
            className={`text-xl font-divd mb-2`}
          >
            {bookmarkSearchQuery ? `No bookmarks found matching "${bookmarkSearchQuery}"` : "No Bookmarked Posts"}
          </h3>
          <p className="mb-4">
            {bookmarkSearchQuery 
              ? "Try a different search term or check your bookmarks." 
              : "You haven't bookmarked any posts yet."}
          </p>
          <button
            onClick={() => navigate("/home")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors"
          >
            Explore Posts
          </button>
        </div>
      )}
    </div>
  );
};

export default MyBookmark;
