# Stack Spot - Backend Server

Stack Spot is a full stack blog application that includes user system functionalities such as follow/unfollow, like post, bookmark post, and dark theme. It is built using React, Node.js, MongoDB, and Cloudinary. The application also incorporates real-time analytics and an auto-login feature.

## Frontend GitHub Repository

Access the source code and project files on the GitHub repository: [Stack Spot Frontend Repository](https://github.com/itsvanshchavda/StackSpot-Frontend)

## Deployment and Integration

The backend is deployable on various server platforms, including Vercel and Netlify. Once deployed, you can seamlessly integrate it into your frontend application, enabling users to register, create posts, interact with content, and establish connections on your social media platform.

### Starting the Server

To start the backend server, follow these steps:

1.  Install Dependencies: Run `npm install` to install the required dependencies for the backend.

2.  Start the Server: Run `npm start` to launch the server using Nodemon, which automatically restarts the server when changes are made. If you don't have Nodemon installed, you can do so globally by running `npm i -g nodemon`.

These steps will initiate the backend server, allowing you to access the APIs and services provided by the Stack Spot Backend. Ensure that your environment variables are correctly set to enable seamless server operation.

### Environment Variables

To run and deploy the backend successfully, you need to configure the following environment variables based on your deployment environment (Development, Preview, Production):

- `MONGO_URI`: Your MongoDB connection URI.
- `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_CLOUD_NAME`: Cloudinary credentials for handling image and video uploads.
- `NODE_ENV`: Set it to "Production" to indicate the production environment.
- `JWT_SECRET`: Secret key for generating JSON Web Tokens (JWTs) for user authentication and authorization.
- `PORT`: The port on which the backend server will listen for incoming requests.

These environment variables are crucial for the proper functioning and security of the backend. You should set them according to your deployment environment and the services you're using.

#### Installation Steps

1.  Clone the Repository:

    bashCopy code

    `git clone https://github.com/itsvanshchavda/StackSpot-Backend.git`

2.  Environment Configuration: Edit the environment variables in the `.env` file in the source code. For mongodb installation, use `mongodb://mongo_db:2717` as the local `MONGO_URI`.

3.  Access the Application: Once the containers are up and running, access the backend server at the port you have specified in the environment variables.

4.  API Documentation: Explore the API endpoints and services provided by the backend by referring to the API documentation or Postman collection.

5.  Install all the dependencies:

        bashCopy code

        `npm install`

6.  Start the server:
            bashCopy code

            `npm start`
            `npm run dev (for development)`




## API Documentation

For in-depth details and comprehensive documentation of the API endpoints, you can explore my Postman collection: Stack Spot Backend Postman Documentation.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- Cloudinary
- JWT
- Bcrypt

## API Endpoints

For detailed API endpoint descriptions, refer to the API documentation.\_

1.  Follow Routes:

    - Find User: `GET /api/alluser/:id`
    - User Following: `GET /api/alluser/following/:id`
    - User Followers: `GET /api/alluser/followers/:id`
    - Add Follower: `PUT /api/alluser/follow/:id`
    - Unfollow User: `PUT /api/alluser/unfollow/:id`

2.  Post Routes:

    - Analytics: `GET /api/post/analytics`
    - Get Following Post: `GET /api/post/followings`
    - Search Post: `GET /api/post/search`
    - Get Post by ID: `GET /api/post/:id`
    - Get All Posts: `GET /api/post/`
    - Get User Posts: `GET /api/post/user/:userID`
    - Create Post: `POST /api/post/create`
    - Update Post: `PUT /api/post/:id`
    - Delete Post: `DELETE /api/post/:id`
    - Like Post: `PUT /api/post/like/:id`
    - Unlike Post: `PUT /api/post/unlike/:id`
    - Add Bookmark: `PUT /api/post/addbookmark/:id`
    - Remove Bookmark: `PUT /api/post/removebookmark/:id`
    - Image Upload: `POST /api/post/upload`

3.  Comment Routes:

    - Write Comment: `POST /api/comment/add`
    - Update Comment: `PUT /api/comment/update`
    - Delete Comment: `DELETE /api/comment/:id`
    - Get All Comments for a Post: `GET /api/comment/post/:postId`

4.  User Routes:

    - Get User Profile: `GET /api/user/:id`
    - Update User Profile: `PUT /api/user/update/:id`
    - Delete User Profile: `DELETE /api/user/:id`
    - Search Users: `GET /api/user/search`
    - Get All Users: `GET /api/user/allUser`

5.  Authentication Routes:

    - Register User: `POST /api/auth/register`
    - Login User: `POST /api/auth/login`
    - Logout User: `GET /api/auth/logout`
    - Refetch User: `GET /api/auth/refetch`

---

Feel free to provide some suggestions and feedback on the project. If you liked the project, drop a star on the GitHub repository. Your appreciation means a lot to me. Thank you for giving this project your time. Have a great day! 😃

## License

MIT LICENSE [LICENSE](LICENSE)

## Developed By

👤 Kanishk
