import { Comment } from "../models/Comment.js";

export const writeComment = async (req, res) => {
  try {
    const newComment = await Comment.create(req.body);
    res.status(200).json({
      success: true,
      message: "Comment added",
      newComment,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { id } = req.body; 

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is required in the request body",
      });
    }

    const updateComment = await Comment.findByIdAndUpdate(
      id,
      { $set: req.body }, 
      { new: true }
    );

    if (!updateComment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    res.status(200).json({
      success: true,
      updateComment,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const deleteComment = async (req, res) => {
  const { id } = req.params;

  try {
    const comment = await Comment.findByIdAndDelete(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Comment deleted✅",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
export const getAllComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ postId });

    if (!comments || comments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Comments not found",
      });
    }
    res.status(200).json({
      success: true,
      comments,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Add these new controller functions

export const likeComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    const comment = await Comment.findById(id);
    
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    
    // Remove from dislikes if present
    if (comment.dislikes && comment.dislikes.includes(userId)) {
      comment.dislikes = comment.dislikes.filter(id => id.toString() !== userId.toString());
    }
    
    // Add to likes if not already liked
    if (!comment.likes || !comment.likes.includes(userId)) {
      if (!comment.likes) comment.likes = [];
      comment.likes.push(userId);
    }
    
    await comment.save();
    
    return res.status(200).json({ 
      success: true,
      message: "Comment liked successfully",
      comment
    });
  } catch (error) {
    console.error("Error liking comment:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const unlikeComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    const comment = await Comment.findById(id);
    
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    
    // Remove from likes
    if (comment.likes) {
      comment.likes = comment.likes.filter(id => id.toString() !== userId.toString());
    }
    
    await comment.save();
    
    return res.status(200).json({ 
      success: true,
      message: "Like removed successfully",
      comment
    });
  } catch (error) {
    console.error("Error unliking comment:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const dislikeComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    const comment = await Comment.findById(id);
    
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    
    // Remove from likes if present
    if (comment.likes && comment.likes.includes(userId)) {
      comment.likes = comment.likes.filter(id => id.toString() !== userId.toString());
    }
    
    // Add to dislikes if not already disliked
    if (!comment.dislikes || !comment.dislikes.includes(userId)) {
      if (!comment.dislikes) comment.dislikes = [];
      comment.dislikes.push(userId);
    }
    
    await comment.save();
    
    return res.status(200).json({ 
      success: true,
      message: "Comment disliked successfully",
      comment
    });
  } catch (error) {
    console.error("Error disliking comment:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const undislikeComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    const comment = await Comment.findById(id);
    
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    
    // Remove from dislikes
    if (comment.dislikes) {
      comment.dislikes = comment.dislikes.filter(id => id.toString() !== userId.toString());
    }
    
    await comment.save();
    
    return res.status(200).json({
      success: true,
      message: "Dislike removed successfully",
      comment
    });
  } catch (error) {
    console.error("Error removing dislike:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
