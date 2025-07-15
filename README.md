

# Bloggify - A Modern Platform for Developers to Write, Learn, and Share

![Bloggify Logo](Frontend/public/logo.svg)

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
- Follow/unfollow functionality to connect with other developers
- User analytics dashboard to track post performance

### 💡 Engagement Features
- Like/dislike posts and comments
- Bookmark posts for later reading
- Comment system with nested replies
- Real-time notifications for user interactions

### 🎨 User Experience
- Responsive design for all devices (mobile, tablet, desktop)
- Dark/light theme toggle for comfortable reading
- Modern card-based UI for content display
- Infinite scrolling for seamless content consumption

### 🔍 Discovery
- Advanced search functionality
- "Who to follow" recommendations
- Trending posts and popular tags sections
- Feed filtering by following, popular, or recent

## 🛠️ Technologies Used

### Frontend
- **React** - Component-based UI library
- **Redux Toolkit** - State management with built-in best practices
- **RTK Query** - Data fetching and caching
- **Tailwind CSS** - Utility-first CSS framework
- **DOMPurify** - Sanitization for user-generated content
- **React Router** - Declarative routing for React
- **React Toastify** - Toast notifications

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

### UI Enhancements
- Completely redesigned post cards with improved image display
- Fixed responsive layout issues for sidebar on mobile and tablet devices
- Enhanced user discovery page with better follow/unfollow button interactions
- Implemented consistent card UI across home, profile, and bookmarks pages
- Added loading skeletons for better UX during data fetching

### Bug Fixes
- Fixed following feed not displaying posts from followed users
- Corrected state management in follow/unfollow functionality
- Improved image handling with fallbacks for missing images
- Enhanced dark mode compatibility throughout the application

### Performance Optimization
- Reduced loading times with optimized image rendering
- Improved state updates to prevent unnecessary re-renders
- Enhanced API integration with proper error handling

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
  
- **Add Bookmark**: `PUT /api/post/addbookmark/:id`
  - Bookmarks a post for later reading
  
- **Remove Bookmark**: `PUT /api/post/removebookmark/:id`
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
