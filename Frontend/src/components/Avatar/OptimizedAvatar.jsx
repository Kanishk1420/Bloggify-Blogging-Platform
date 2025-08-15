import { useState, useRef, useEffect } from 'react';
import { preloadImage, isImageCached } from '../../utils/avatarUtil';
import PropTypes from 'prop-types';

const OptimizedAvatar = ({ 
  src, 
  alt = "Avatar", 
  className = "", 
  fallbackSrc = null,
  onClick = null,
  loading = "lazy",
  ...props 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // Check if image is already cached
  const isCached = isImageCached(src);

  useEffect(() => {
    // If image is cached, show immediately
    if (isCached) {
      setImageLoaded(true);
      setIsVisible(true);
      return;
    }

    // Set up intersection observer for lazy loading
    if (loading === "lazy" && imgRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              if (observerRef.current) {
                observerRef.current.disconnect();
              }
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '50px'
        }
      );

      observerRef.current.observe(imgRef.current);
    } else {
      setIsVisible(true);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [src, loading, isCached]);

  useEffect(() => {
    if (isVisible && src && !imageLoaded && !imageError) {
      // Preload image when it becomes visible
      preloadImage(src)
        .then(() => {
          setImageLoaded(true);
        })
        .catch(() => {
          setImageError(true);
        });
    }
  }, [isVisible, src, imageLoaded, imageError]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      onClick={onClick}
      {...props}
    >
      {/* Loading placeholder */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error fallback */}
      {imageError && fallbackSrc && (
        <img
          src={fallbackSrc}
          alt={alt}
          className="w-full h-full object-cover"
          onLoad={handleImageLoad}
        />
      )}

      {/* Main image */}
      {(isVisible || isCached) && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading={loading}
          decoding="async"
        />
      )}

      {/* Loading indicator overlay */}
      {!imageLoaded && !imageError && (
        <div className="absolute top-2 right-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  );
};

OptimizedAvatar.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  className: PropTypes.string,
  fallbackSrc: PropTypes.string,
  onClick: PropTypes.func,
  loading: PropTypes.oneOf(['lazy', 'eager'])
};

export default OptimizedAvatar;