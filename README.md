

# Bloggify - A Modern Platform for Developers to Write, Learn, and Share

![Bloggify Logo](Frontend/src/assets/Bloggify.png)

Bloggify is a full-stack blogging platform designed specifically for developers to share their knowledge, experiences, and insights. With a modern UI and robust features, it offers a seamless experience for both content creators and readers.

## ✨ Features

### 📝 Content Creation
- Rich text editor for creating and editing posts
- Image upload support via Cloudinary
- Tag-based categorization for better content discovery
- Draft saving and post scheduling

### 👥 User System
- Complete user authentication system
- Personalized user profiles with customizable images
- **Secure Profile Deletion**: Multi-step account deletion with data cleanup
- Follow/unfollow functionality to connect with other developers
- **Enhanced Analytics Dashboard**: Comprehensive tracking of likes, dislikes, bookmarks, and followers
- **Smart Authentication Flow**: Seamless redirection based on user login status

### 💡 Engagement Features
- Like/dislike posts and comments
- Bookmark posts for later reading
- Comment system with nested replies
- Real-time notifications for user interactions

### 🎨 User Experience
- Responsive design for all devices (mobile, tablet, desktop)
- Dark/light theme toggle for comfortable reading
- **Landing Page**: Professional introduction page with animated content carousel
- Modern card-based UI for content display
- **Smooth Page Transitions**: Framer Motion powered animations between routes
- Infinite scrolling for seamless content consumption
- **Interactive UI Elements**: Hover effects, loading states, and micro-interactions

### 🔍 Discovery
- Advanced search functionality
- **Dynamic Popular Tags**: Auto-generated tags based on actual post categories
- "Who to follow" recommendations
- Trending posts and popular tags sections
- **Professional Landing Page**: Showcases platform features for new users
- Feed filtering by following, popular, or recent

## 🛠️ Technologies Used

### Frontend
- **React** - Component-based UI library
- **Redux Toolkit** - State management with built-in best practices
- **RTK Query** - Data fetching and caching
- **Framer Motion** - Animation library for smooth page transitions
- **Tailwind CSS** - Utility-first CSS framework
- **DOMPurify** - Sanitization for user-generated content
- **React Router** - Declarative routing for React
- **React Toastify** - Toast notifications
- **React Icons** - Comprehensive icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework for Node.js
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Secure authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Image hosting and transformation
- **Multer** - File upload handling

## 🖥️ Recent Improvements (July 2025)

### ✨ New Major Features

#### 🎭 Landing Page Implementation
- **Professional Introduction Page**: Created a stunning landing page with hero section, image slider, and featured posts
- **Dynamic Content Carousel**: Auto-rotating SVG illustrations showcasing blogging concepts
- **Authentication Flow**: Smart redirection system - unauthenticated users see landing page, authenticated users access main feed
- **Popular Tags System**: Dynamic tag generation based on actual blog post categories with purple/violet styling
- **Smooth Page Transitions**: Implemented Framer Motion animations for seamless navigation between pages

#### 🎨 Enhanced User Experience
- **Page Transitions**: Added smooth fade, slide, and scale animations for all page navigations
- **Theme Integration**: Complete dark/light mode support across all new components
- **Responsive Design**: Mobile-first approach ensuring perfect display on all device sizes
- **Interactive Elements**: Hover effects, smooth transitions, and micro-interactions throughout

#### 🔐 Advanced Profile Management
- **Profile Deletion Feature**: Secure account deletion with confirmation dialog requiring typing "DELETE"
- **Data Cleanup**: Complete removal of user posts, comments, followers, and all associated data
- **Scroll Lock Modal**: Background scrolling prevention during critical operations
- **Enhanced Security**: Multi-step confirmation process for destructive actions

#### 📊 Improved Analytics Dashboard
- **Total Dislikes Tracking**: Added comprehensive dislike analytics alongside existing metrics
- **Four-Column Layout**: Redesigned dashboard with Followers, Likes, Dislikes, and Bookmarks in a single row
- **Real-time Updates**: Automatic refresh of analytics when user interactions occur
- **Consistent Styling**: Unified card design with gradients and icons for all metrics

### 🐛 Critical Bug Fixes

#### Authentication & Navigation
- **Logout Redirection**: Fixed logout to redirect to landing page instead of login page
- **Registration Flow**: Corrected new user registration to redirect to main feed (/home)
- **Navbar Logic**: Resolved infinite redirect loops and "Maximum update depth exceeded" errors
- **Mobile Dropdown**: Fixed navbar dropdown overflow and positioning issues on mobile devices

#### Content Management
- **Bookmark System**: Fixed 404 errors in bookmark add/remove operations by aligning frontend/backend routes
- **Comment Updates**: Resolved comment editing issues with proper state management and real-time updates
- **Profile Images**: Fixed profile picture loading in blog cards with intelligent fallback system
- **Search Functionality**: Corrected "Explore Posts" buttons to redirect to main feed instead of landing page

#### UI/UX Improvements
- **Button Consistency**: Standardized button styling across edit profile and other forms
- **Light Mode Fixes**: Resolved dark theme elements appearing incorrectly in light mode
- **Responsive Cards**: Fixed blog card layouts and image display across all screen sizes
- **Modal Interactions**: Enhanced modal dialogs with click-outside-to-close and proper focus management

### 🔧 Technical Enhancements

#### State Management
- **Redux Integration**: Improved state synchronization across components
- **RTK Query Optimization**: Enhanced data fetching with proper cache invalidation
- **Local Storage Management**: Better handling of user preferences and session data

#### Performance Optimization
- **Image Loading**: Implemented lazy loading and optimized image rendering
- **Bundle Optimization**: Reduced JavaScript bundle size through code splitting
- **Memory Management**: Prevented memory leaks in subscription-based components

#### Code Quality
- **PropTypes Validation**: Added comprehensive prop validation to prevent runtime errors
- **Error Boundaries**: Implemented proper error handling throughout the application

## 🚀 Setup Guide

### Prerequisites
- Node.js (v14 or later)
- MongoDB (local or Atlas)
- Cloudinary account for image hosting

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Kanishk1420/Bloggify-Blogging-Platform.git
   cd Bloggify-Blogging-Platform
   ```

2. Set up Backend:
   ```bash
   cd Backend
   npm install
   ```
   
   Create a `.env` file in the Backend directory with:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   PORT=5000
   ```

3. Set up Frontend:
   ```bash
   cd ../Frontend
   npm install
   npm install framer-motion
   ```
   
   Create a `.env` file in the Frontend directory with:
   ```
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. Start the application:
   
   For Backend:
   ```bash
   cd Backend
   npm run dev
   ```
   
   For Frontend:
   ```bash
   cd Frontend
   npm run dev
   ```

5. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api
   - Landing Page: http://localhost:5173/ (for new users)
   - Main Feed: http://localhost:5173/home (for authenticated users)

## 📚 API Documentation & Backend Details

The Bloggify backend is a robust Node.js server that provides comprehensive RESTful API endpoints for all functionalities.

### Backend Deployment

The backend is deployable on various server platforms, including Vercel and Netlify. Once deployed, you can seamlessly integrate it into your frontend application, enabling users to register, create posts, interact with content, and establish connections.

### Environment Variables for Backend

For the backend to run properly, configure these environment variables:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NODE_ENV=development/production
PORT=5000
```

### API Endpoints

#### Authentication Routes
- **Register User**: `POST /api/auth/register`
  - Creates a new user account
  - Body: `{ firstname, lastname, email, password, username }`
  
- **Login User**: `POST /api/auth/login`
  - Authenticates a user and returns JWT token
  - Body: `{ email, password }`
  
- **Logout User**: `GET /api/auth/logout`
  - Clears user session/cookies
  
- **Refetch User**: `GET /api/auth/refetch`
  - Re-authenticates user with existing token

#### User Routes
- **Get User Profile**: `GET /api/user/:id`
  - Retrieves a user's complete profile
  
- **Update User Profile**: `PUT /api/user/update/:id`
  - Updates user information
  - Body: `{ firstname, lastname, bio, etc. }`
  
- **Delete User Profile**: `DELETE /api/user/:id`
  - Permanently removes a user account
  
- **Search Users**: `GET /api/user/search?q=searchterm`
  - Searches for users by name or username
  
- **Get All Users**: `GET /api/user/allUser`
  - Returns a list of all registered users

#### Post Routes
- **Analytics**: `GET /api/post/analytics`
  - Returns post interaction statistics
  
- **Get Following Post**: `GET /api/post/followings`
  - Fetches posts from users the current user follows
  
- **Search Post**: `GET /api/post/search?q=searchterm`
  - Searches for posts by title or content
  
- **Get Post by ID**: `GET /api/post/:id`
  - Retrieves a specific post with all details
  
- **Get All Posts**: `GET /api/post/`
  - Returns all published posts
  
- **Get User Posts**: `GET /api/post/user/:userID`
  - Fetches all posts by a specific user
  
- **Create Post**: `POST /api/post/create`
  - Creates a new blog post
  - Body: `{ title, description, photo, tags }`
  
- **Update Post**: `PUT /api/post/:id`
  - Modifies an existing post
  
- **Delete Post**: `DELETE /api/post/:id`
  - Removes a post permanently
  
- **Like Post**: `PUT /api/post/like/:id`
  - Adds user's like to a post
  
- **Unlike Post**: `PUT /api/post/unlike/:id`
  - Removes user's like from a post
  
- **Add Bookmark**: `POST /api/post/bookmark/:id`
  - Bookmarks a post for later reading
  
- **Remove Bookmark**: `DELETE /api/post/bookmark/remove/:id`
  - Removes a post from bookmarks
  
- **Image Upload**: `POST /api/post/upload`
  - Uploads image to Cloudinary
  - Requires multipart/form-data

#### Comment Routes
- **Write Comment**: `POST /api/comment/add`
  - Adds a comment to a post
  - Body: `{ postId, text }`
  
- **Update Comment**: `PUT /api/comment/update`
  - Modifies an existing comment
  
- **Delete Comment**: `DELETE /api/comment/:id`
  - Removes a comment
  
- **Get All Comments for a Post**: `GET /api/comment/post/:postId`
  - Fetches all comments for a specific post

#### Follow Routes
- **Find User**: `GET /api/alluser/:id`
  - Gets a specific user's profile
  
- **User Following**: `GET /api/alluser/following/:id`
  - Lists users that a specific user follows
  
- **User Followers**: `GET /api/alluser/followers/:id`
  - Lists users who follow a specific user
  
- **Add Follower**: `PUT /api/alluser/follow/:id`
  - Follows a user
  
- **Unfollow User**: `PUT /api/alluser/unfollow/:id`
  - Unfollows a user

### Backend Architecture

The backend follows a structured MVC architecture:

- **Models**: Define data schemas for users, posts, and comments
- **Controllers**: Handle business logic and request processing
- **Routes**: Define API endpoints and connect to controllers
- **Middleware**: Implements authentication, file uploads, and request validation
- **Utils**: Contains helper functions for JWT, email services, and data formatting

## 🤝 Contributing

Contributions are welcome! If you find any issues or have suggestions for improvement, please open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👨‍💻 Developed By

Kanishk

Keep Coding! 🚀
