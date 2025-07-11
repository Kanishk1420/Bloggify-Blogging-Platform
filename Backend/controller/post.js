import { Post } from "../models/Post.js";
import { Comment } from "../models/Comment.js";
import { User } from "../models/User.js";

import getDataUri from "../utils/dataUri.js";
import { v2 as cloudinary } from "cloudinary";

export const writePost = async (req, res) => {
  try {
    const newPost = await Post.create(req.body);

    if (!newPost) {
      return res.status(400).json({
        success: false,
        message: "Failed to create post",
      });
    }

    res.status(200).json({
      success: true,
      message: "Post created",
      newPost,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    let { id } = req.params;

    let post = await Post.findById(id);
    const { password } = req.body;
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashPass = bcrypt.hashSync(password, salt);
      password = hashPass;
    }

    let updateFieds = { ...req.body };

    if (req.file) {
      const file = req.file;
      const filUri = getDataUri(file);
      const result = await cloudinary.uploader.upload(filUri.content, {
        folder: "posts",
        public_id: file.originalname.split(".")[0],
        width: 800,
        height: 400,
        crop: 'fill',
        gravity: 'auto', 
      });

      updateFieds.photo = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $set: updateFieds },
      { new: true }
    );

    res.status(200).json({
      success: true,
      updatedPost,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    await Post.findByIdAndDelete(id);

    await Comment.deleteMany({ postId: id });

    res.status(200).json({
      success: true,
      message: "Post deleted✅",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const getPost = await Post.findById(postId).populate("likes bookmarks");

    res.status(200).json({
      success: true,
      getPost,
      likeCount: getPost.likeCount || 0,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const allPost = await Post.find().populate("likes bookmarks");

    if (!allPost || allPost.length === 0) {
      return res.status(404).json({ message: "No post found" });
    }

    res.status(200).json({
      success: true,
      allPost,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Post Like
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    const post = await Post.findById(id);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    // Remove from dislikes if present
    if (post.dislikes.includes(userId)) {
      post.dislikes = post.dislikes.filter(id => id.toString() !== userId.toString());
    }
    
    // Add to likes if not already liked
    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
    }
    
    await post.save();
    
    return res.status(200).json({ message: "Post liked successfully" });
  } catch (error) {
    console.error("Error liking post:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const unlikePost = async (req, res) => {
  try {
    let user = await User.findById(req.userId);
    const { id } = req.params;

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const unlike = await Post.findByIdAndUpdate(
      id,
      {
        $pull: { likes: user._id },
      },
      { new: true }
    );

    if (unlike) {
      return res.status(200).json({
        message: "Post Unliked",
        unlike,
      });
    }
  } catch (err) {
    console.error(err); // Log any errors that occur
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Post Bookmark
export const addBookmark = async (req, res) => {
  try {
    let user = await User.findById(req.userId);
    const { id } = req.params;

    if (!user) return res.status(400).json({ message: "User not found" });

    // Verify the existence of the post
    const existingPost = await Post.findById(id);
    if (!existingPost) {
      return res.status(400).json({
        success: false,
        message: "Post does not exist",
      });
    }

    const bookmark = await Post.findByIdAndUpdate(
      id,
      {
        $addToSet: { bookmarks: user._id },
      },
      { new: true }
    ).populate("bookmarks");

    if (!bookmark) {
      return res.status(400).json({
        success: false,
        message: "Failed to add bookmark",
      });
    }

    res.status(200).json({
      success: true,
      message: "Post Bookmarked",
      bookmark,
    });
  } catch (err) {
    console.error(err); // Log any errors that occur
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const removeBookmark = async (req, res) => {
  try {
    let user = await User.findById(req.userId);
    const { id } = req.params;

    if (!user) return res.status(400).json({ message: "User not found" });

    // Verify the existence of the post
    const post = await Post.findById(id);
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post does not exist",
      });
    }

    const bookmark = await Post.findByIdAndUpdate(
      id,
      {
        $pull: { bookmarks: user._id },
      },
      { new: true }
    ).populate("bookmarks");

    if (!bookmark) {
      return res.status(400).json({
        success: false,
        message: "Failed to add bookmark",
      });
    }

    res.status(200).json({
      success: true,
      message: "Bookmark removed",
      bookmark,
    });
  } catch (err) {
    console.error(err); // Log any errors that occur
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getSearchedPost = async (req, res) => {
  const { search } = req.query;

  try {
    const searchedPost = await Post.find({
      title: { $regex: search, $options: "i" },
    });

    if (!searchedPost || searchedPost.length === 0) {
      return res.status(404).json({ message: "No post found" });
    }

    res.status(200).json({
      success: true,
      searchedPost,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const userPost = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Fetching posts for user:", userId);

    const userpPost = await Post.find({ userId });

    if (!userpPost || userpPost.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User post not found",
      });
    }

    res.status(200).json({
      success: true,
      userPost: userpPost,
    });
  } catch (error) {
    console.error("Error in userPost:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a file" });
    }

    const file = req.file;
    const fileUri = getDataUri(file);
    const result = await cloudinary.uploader.upload(fileUri.content, {
      folder: "posts",
      public_id: file.originalname.split(".")[0],
      width: 800,
      height: 400,
      crop: 'fill',
      gravity: 'auto', 
    });

    res.status(200).json({
      success: true,
      message: "Image uploaded",
      public_id: result.public_id,
      secure_url: result.secure_url,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getFollowingPost = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    const post = await Post.find({
      userId: {
        $in: user.following,
      },
    });

    res.status(200).json({
      success: true,
      followingPost: post,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getAnalytics = async (req, res) => {
  try {

    const getUser = await User.findById(req.userId);

    if (!getUser) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    const userPosts = await Post.find({ userId: req.userId });

    if (!userPosts || userPosts.length === 0) {
      return res.status(401).json({
        success: false,
        message: "No posts found for this user"
      });
    }

    let likes = 0;
    let bookmarks = 0;

    userPosts.forEach(post => {
      likes += post.likes.length;
      bookmarks += post.bookmarks.length;
    });

    const analytics = {
      totalLikes: likes,
      totalBookmarks: bookmarks
    };

    res.status(200).json({
      success: true,
      analytics
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Post Dislike
export const dislikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    const post = await Post.findById(id);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    // Remove from likes if present
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter(id => id.toString() !== userId.toString());
    }
    
    // Add to dislikes if not already disliked
    if (!post.dislikes.includes(userId)) {
      post.dislikes.push(userId);
    }
    
    await post.save();
    
    return res.status(200).json({ message: "Post disliked successfully" });
  } catch (error) {
    console.error("Error disliking post:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const undislikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    const post = await Post.findById(id);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    // Remove from dislikes
    post.dislikes = post.dislikes.filter(id => id.toString() !== userId.toString());
    
    await post.save();
    
    return res.status(200).json({ message: "Dislike removed successfully" });
  } catch (error) {
    console.error("Error removing dislike:", error);
    return res.status(500).json({ message: "Server error" });
  }
};