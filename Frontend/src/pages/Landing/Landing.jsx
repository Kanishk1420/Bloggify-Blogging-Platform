 
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { BsMoonStarsFill } from 'react-icons/bs';
import { MdSunny } from 'react-icons/md';
import PropTypes from 'prop-types';
import Footer from '../../components/Footer/Footer';
import DOMPurify from 'dompurify';
import { useGetAllPostQuery } from '../../api/post';
import { toggleDarkMode } from '../../slices/Theme';
import { motion } from "framer-motion";
import PageTransition from '../../components/PageTransition/PageTransition';

// Import SVGs - replace with your actual paths
import publishArticleSVG from "../../assets/undraw_blogging_t042.svg";
import blogSVG from "../../assets/undraw_blog_1ca8.svg";
import blogPostSVG from "../../assets/undraw_blog-post_f68f.svg";
import fashionBloggingSVG from "../../assets/undraw_fashion-blogging_wfoz.svg";
import publishSVG from "../../assets/undraw_publish-article_u3z6.svg";
import { DEFAULT_AVATAR } from '../../utils/avatarUtil';



// Image Slider/Carousel Component
const ImageSlider = ({ theme }) => {
  // Array of images for the slider
  const images = [
    { src: publishArticleSVG, alt: "Blogging illustration" },
    { src: blogSVG, alt: "Blog illustration" },
    { src: blogPostSVG, alt: "Blog post illustration" },
    { src: fashionBloggingSVG, alt: "Fashion blogging illustration" },
    { src: publishSVG, alt: "Publishing article illustration" }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [images.length]);

  return (
    <div className="relative w-full h-[450px] flex justify-center items-center overflow-hidden">
      {images.map((image, index) => {
        // Calculate positions for sliding effect
        const position = index - currentIndex;
        
        return (
          <div
            key={index}
            className={`absolute w-full h-full flex justify-center items-center
              transition-all duration-700 ease-in-out will-change-transform will-change-opacity
              ${Math.abs(position) > 1 ? 'opacity-0' : position === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            style={{
              transform: `translateX(${position * 100}%)`,
              transition: 'transform 700ms ease-in-out, opacity 700ms ease-in-out'
            }}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="max-w-[90%] max-h-[450px] object-contain"
              style={{
                filter: theme ? 'drop-shadow(0 4px 6px rgba(255, 255, 255, 0.1))' : 'none',
                opacity: 0
              }}
              // Preload images for smoother transitions
              onLoad={(e) => {
                e.target.style.transition = 'opacity 300ms ease-in-out';
                e.target.style.opacity = 1;
              }}
            />
          </div>
        );
      })}
      
      {/* Dots indicator */}
      <div className="absolute bottom-0 flex justify-center w-full pb-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 mx-0.5 rounded-full transition-colors focus:outline-none
              ${index === currentIndex 
                ? (theme ? 'bg-indigo-400' : 'bg-[#2563EB]') 
                : (theme ? 'bg-gray-600' : 'bg-gray-300')}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// Add PropTypes validation
ImageSlider.propTypes = {
  theme: PropTypes.bool
};

// Blog Card Component
const BlogCard = ({ post, theme }) => {
  // Format date in a readable format
  const formattedDate = new Date(post?.createdAt || post?.updatedAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short'
  });

  // Function to get profile photo URL from various possible locations
  const getProfilePhotoUrl = () => {
    // Direct check for user profile in post object (common case)
    if (post?.userId && typeof post.userId === 'object') {
      // Check for profilePhoto as URL object
      if (post.userId.profilePhoto?.url) return post.userId.profilePhoto.url;
      // Check for profilePhoto as direct string URL
      if (typeof post.userId.profilePhoto === 'string') return post.userId.profilePhoto;
    }
    
    // Special handling for user photos when userId isn't populated
    if (typeof post?.userId === 'string') {
      if (post?.profilePhoto?.url) return post.profilePhoto.url;
      if (typeof post?.profilePhoto === 'string') return post.profilePhoto;
      if (post?.avatar) return post.avatar;
      if (post?.defaultAvatar) return post.defaultAvatar;
    }
    
    // Handle legacy or alternative data structures
    if (post?.author?.avatar) return post.author.avatar;
    
    // Custom default avatar - replace with actual path to your 3D avatar image
    return DEFAULT_AVATAR;
  };

  // Get the author name from various possible locations
  const getAuthorName = () => {
    // If userId is populated with firstname/lastname
    if (post?.userId && typeof post.userId === 'object' && post.userId.firstname) {
      return `${post.userId.firstname} ${post.userId.lastname || ''}`;
    }
    // If post has firstname/lastname directly
    else if (post?.firstname) {
      return `${post.firstname} ${post.lastname || ''}`;
    }
    // If userId is populated with username
    else if (post?.userId && typeof post.userId === 'object' && post.userId.username) {
      return post.userId.username;
    }
    // If post has username directly
    else if (post?.username) {
      return post.username;
    }
    // Default
    return "Anonymous";
  };

  // Get user initial for avatar fallback
  const getUserInitial = () => {
    // If userId is populated with firstname
    if (post?.userId && typeof post.userId === 'object' && post.userId.firstname) {
      return post.userId.firstname[0].toUpperCase();
    }
    // If post has firstname directly
    else if (post?.firstname) {
      return post.firstname[0].toUpperCase();
    }
    // If userId is populated with username
    else if (post?.userId && typeof post.userId === 'object' && post.userId.username) {
      const username = post.userId.username.replace(/^@/, ''); // Remove @ if present
      return username[0].toUpperCase();
    }
    // If post has username directly
    else if (post?.username) {
      const username = post.username.replace(/^@/, ''); // Remove @ if present
      return username[0].toUpperCase();
    }
    // Default
    return "U";
  };

  const profilePhotoUrl = getProfilePhotoUrl();
  const authorName = getAuthorName();
  const userInitial = getUserInitial();


  useEffect(() => {
  }, [post]);

  // Update the BlogCard component to include motion animations
  return (
    <motion.div 
      className={`h-full flex flex-col rounded-lg overflow-hidden transition-all transform
        ${theme 
          ? 'bg-black border border-gray-800/30 shadow-lg hover:shadow-gray-800/30 text-white' 
          : 'bg-white shadow-md hover:shadow-lg border border-gray-100'
        }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.2 }
      }}
    >
      {/* Image Section */}
      <div className="relative pt-[56.25%]">
        <img
          src={post?.photo?.url || post?.image?.url || "https://via.placeholder.com/800x450?text=Blog+Image"}
          alt={post?.title || "Blog post"}
          className="absolute top-0 left-0 w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/800x450?text=Blog+Image";
          }}
        />
      </div>
      
      {/* Content Section */}
      <div className={`p-4 flex-grow ${theme ? 'bg-black' : ''}`}>
        <h2 className={`text-xl font-semibold mb-2 line-clamp-2 ${
          theme ? 'text-white' : 'text-[#1e3a8a]'
        }`}>
          {post?.title || "Untitled Post"}
        </h2>
        
        <div className={`text-xs mb-3 ${theme ? 'text-gray-200' : 'text-gray-700'}`}>
          <p dangerouslySetInnerHTML={{ 
            __html: DOMPurify.sanitize((post?.description || "").slice(0, 100) + "...Read More") 
          }} />
        </div>
        
        <div className="flex justify-between items-center mt-auto">
          <div className="flex items-center">
            {/* Enhanced Profile Image with Better Fallback Strategy */}
            <div className="relative w-8 h-8 rounded-full mr-2 overflow-hidden">
              {profilePhotoUrl ? (
                <img 
                  src={profilePhotoUrl}
                  alt={authorName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop
                    
                    // Try to load from URL directly if possible
                    if (typeof post?.userId === 'string' && post?.profilePhoto) {
                      e.target.src = post.profilePhoto;
                      return;
                    }
                    
                    // Create a canvas element for a more reliable fallback
                    const canvas = document.createElement('canvas');
                    canvas.width = 32;
                    canvas.height = 32;
                    const ctx = canvas.getContext('2d');
                    
                    // Draw colored background
                    ctx.fillStyle = theme ? '#4f46e5' : '#3b82f6';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    
                    // Draw text
                    ctx.fillStyle = '#ffffff';
                    ctx.font = 'bold 16px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(userInitial, canvas.width/2, canvas.height/2);
                    
                    // Set the canvas as the image source
                    e.target.src = canvas.toDataURL('image/png');
                  }}
                />
              ) : (
                <div className={`w-full h-full flex items-center justify-center ${
                  theme ? 'bg-indigo-600' : 'bg-blue-500'
                }`}>
                  <span className="text-white text-sm font-semibold">
                    {userInitial}
                  </span>
                </div>
              )}
            </div>
            <div>
              <p className={`text-sm font-medium ${theme ? 'text-gray-200' : 'text-gray-800'}`}>
                {authorName}
              </p>
              <div className="flex items-center text-xs">
                <span className={`inline-block w-2 h-2 rounded-full mr-1 ${theme ? 'bg-green-400' : 'bg-green-500'}`}></span>
                <span className={`${theme ? 'text-gray-400' : 'text-gray-500'}`}>Writer</span>
              </div>
            </div>
          </div>
          <span className={`text-xs ${theme ? 'text-gray-300' : 'text-gray-500'}`}>{formattedDate}</span>
        </div>
      </div>
    </motion.div>
  );
};

// Add PropTypes validation
BlogCard.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
    photo: PropTypes.shape({
      url: PropTypes.string
    }),
    image: PropTypes.shape({
      url: PropTypes.string
    }),
    profilePhoto: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        url: PropTypes.string
      })
    ]),
    avatar: PropTypes.string,
    defaultAvatar: PropTypes.string,
    userId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        profilePhoto: PropTypes.shape({
          url: PropTypes.string
        }),
        firstname: PropTypes.string,
        lastname: PropTypes.string,
        username: PropTypes.string
      })
    ]),
    author: PropTypes.shape({
      avatar: PropTypes.string
    }),
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    username: PropTypes.string
  }),
  theme: PropTypes.bool
};

const Landing = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const { userInfo } = useSelector((state) => state.auth);
  const { data, isLoading } = useGetAllPostQuery();
  const [featuredPosts, setFeaturedPosts] = useState([]);
  
  useEffect(() => {
    // Get featured posts from API data
    if (data && data.allPost) {
      const postsWithImages = data.allPost.filter(post => post.photo?.url || post.image?.url);
      const posts = postsWithImages.length >= 6 ? postsWithImages.slice(0, 6) : data.allPost.slice(0, 6);
      setFeaturedPosts(posts);
    }
  }, [data]);

  // Theme toggle handler
  const handleThemeToggle = () => {
    dispatch(toggleDarkMode());
  };

  // Centralized authentication check function
  const checkAuthAndProceed = (destination) => {
    if (!userInfo?.token) {
      // Store the intended destination for redirect after login
      sessionStorage.setItem("redirectAfterLogin", destination);
      navigate("/login");
    } else {
      navigate(destination || '/home'); // Default to home if no destination provided
    }
  };
  
  // Handler for blog post clicks
  const handlePostClick = (postId) => {
    const destination = `/posts/post/${postId}`;
    checkAuthAndProceed(destination);
  };

  // Extract and count categories from all posts
  const getPopularCategories = () => {
    if (!data?.allPost || !Array.isArray(data.allPost)) return [];
    
    // Create a map to count category occurrences
    const categoryCount = {};
    
    // Loop through all posts and count categories
    data.allPost.forEach(post => {
      if (post.categories && Array.isArray(post.categories)) {
        post.categories.forEach(category => {
          if (category) {
            categoryCount[category] = (categoryCount[category] || 0) + 1;
          }
        });
      }
    });
    
    // Convert to array and sort by count (descending)
    const sortedCategories = Object.keys(categoryCount)
      .map(category => ({ name: category, count: categoryCount[category] }))
      .sort((a, b) => b.count - a.count);
    
    // Return top 5 categories (or fewer if there aren't 5)
    return sortedCategories.slice(0, 5);
  };

  // Get popular categories
  const popularCategories = getPopularCategories();

  return (
    <PageTransition type="fadeInUp">
      <>
        {/* Theme toggle button in top-right corner */}
        <div className="fixed top-6 right-6 z-50">
          <button 
            onClick={handleThemeToggle}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
              theme 
                ? 'bg-zinc-800 hover:bg-zinc-700 text-white' 
                : 'bg-white hover:bg-gray-100 text-[#1576D8] shadow-md'
            }`}
            aria-label="Toggle dark mode"
          >
            {theme ? 
              <BsMoonStarsFill className="text-lg" /> : 
              <MdSunny className="text-xl" />
            }
          </button>
        </div>

        <div className={`min-h-screen ${
          theme 
            ? "bg-gradient-to-b from-black to-gray-900 via-black text-white" 
            : "bg-gradient-to-b from-blue-50 to-white"
        }`}>
          
          {/* Hero Section */}
          <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row items-center">
              {/* Left Content Section */}
              <div className="w-full md:w-1/2 pr-0 md:pr-8 mb-10 md:mb-0">
                <h1 className={`text-4xl md:text-5xl font-bold ${theme ? 'text-white' : 'text-slate-800'} leading-tight mb-6`}>
                  Read the most <br className="hidden md:block" />interesting articles
                </h1>
                
                <p className={`${theme ? 'text-gray-300' : 'text-slate-600'} text-lg mb-8 max-w-xl`}>
                  Discover insightful perspectives, expert advice, and thought-provoking 
                  content from our community of passionate writers and industry experts.
                </p>
                
                {/* Updated Get Started Button with Gradient Style */}
                <div className="mb-8">
                  <button 
                    onClick={() => checkAuthAndProceed('/home')}
                    className="w-full md:w-auto px-8 py-3 rounded-lg font-medium transition flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                  >
                    <span>Get Started</span>
                    <FaArrowRight className="ml-2" />
                  </button>
                </div>
                
                {/* Popular Tags - Dynamic with Purple Styling */}
                <div>
                  {popularCategories.length > 0 && (
                    <>
                      <span className={`${theme ? 'text-gray-300' : 'text-slate-600'} font-medium mr-4`}>Popular Tags:</span>
                      <div className="inline-flex flex-wrap gap-3 mt-3">
                        {popularCategories.map((category, index) => (
                          <span 
                            key={index} 
                            className={`px-4 py-1.5 rounded-full text-base font-medium transition-colors ${
                              theme 
                                ? "bg-purple-900/50 text-purple-300 border border-purple-800/50 hover:bg-purple-800/40" 
                                : "bg-purple-100 text-purple-700 border border-purple-200 hover:bg-purple-50"
                            }`}
                            onClick={() => checkAuthAndProceed(`/?category=${encodeURIComponent(category.name)}`)}
                          >
                            {category.name}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {/* Right Image Section - Slider */}
              <div className="w-full md:w-1/2 flex justify-center">
                <ImageSlider theme={theme} />
              </div>
            </div>
          </div>

          {/* Blog Posts Section */}
          <div className={`py-16 ${
            theme 
              ? 'bg-gradient-to-b from-black via-black to-gray-900' 
              : 'bg-gray-50'
          }`}>
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
              <h2 className={`text-3xl font-bold mb-10 text-center ${theme ? 'text-white' : 'text-gray-600'}`}>
                Latest Articles
              </h2>
              
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className={`animate-pulse rounded-lg overflow-hidden ${theme ? 'bg-zinc-800' : 'bg-white'}`}>
                      <div className={`h-48 ${theme ? 'bg-zinc-700' : 'bg-gray-300'}`}></div>
                      <div className="p-4">
                        <div className={`h-6 w-3/4 mb-2 ${theme ? 'bg-zinc-700' : 'bg-gray-300'}`}></div>
                        <div className={`h-4 w-1/2 mb-4 ${theme ? 'bg-zinc-700' : 'bg-gray-300'}`}></div>
                        <div className="flex justify-between">
                          <div className="flex">
                            <div className={`h-8 w-8 rounded-full ${theme ? 'bg-zinc-700' : 'bg-gray-300'}`}></div>
                            <div className="ml-2">
                              <div className={`h-4 w-16 ${theme ? 'bg-zinc-700' : 'bg-gray-300'}`}></div>
                              <div className={`h-3 w-12 mt-1 ${theme ? 'bg-zinc-700' : 'bg-gray-300'}`}></div>
                            </div>
                          </div>
                          <div className={`h-4 w-12 ${theme ? 'bg-zinc-700' : 'bg-gray-300'}`}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredPosts.map((post) => (
                    <div 
                      key={post._id} 
                      onClick={() => handlePostClick(post._id)}
                      className="flex cursor-pointer"
                    >
                      <div className="w-full max-w-sm mx-auto">
                        <BlogCard post={post} theme={theme} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex justify-center mt-10">
                <button 
                  onClick={() => checkAuthAndProceed('/home')} 
                  className={`px-8 py-3 rounded-full flex items-center transition-colors
                    ${theme 
                      ? 'border border-indigo-600 text-indigo-400 hover:bg-indigo-900/20' 
                      : 'border border-[#2563EB] text-[#2563EB] hover:bg-blue-50'
                    }`}
                >
                  More articles
                  <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    </PageTransition>
  );
};

export default Landing;