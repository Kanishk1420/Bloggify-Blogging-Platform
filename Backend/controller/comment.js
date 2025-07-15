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
    const { commentId, comment, userId } = req.body;
    
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { comment },
      { new: true } // Here we allow timestamps to update naturally
    );
    
    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    
    if (updatedComment.userId !== userId) {
      return res.status(403).json({ message: "You can only update your own comments" });
    }
    
    return res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      comment: updatedComment
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    return res.status(500).json({ message: "Server error" });
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
    
    // Use findByIdAndUpdate with timestamps option set to false
    const comment = await Comment.findByIdAndUpdate(
      id,
      {
        $pull: { dislikes: userId }, // Remove from dislikes if present
        $addToSet: { likes: userId }  // Add to likes if not already present
      },
      { 
        new: true,         // Return updated document
        timestamps: false  // Don't update timestamps
      }
    );
    
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    
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
    
    const comment = await Comment.findByIdAndUpdate(
      id,
      { $pull: { likes: userId } },
      { new: true, timestamps: false }
    );
    
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    
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
    
    const comment = await Comment.findByIdAndUpdate(
      id,
      {
        $pull: { likes: userId },
        $addToSet: { dislikes: userId }
      },
      { new: true, timestamps: false }
    );
    
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    
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
    
    const comment = await Comment.findByIdAndUpdate(
      id,
      { $pull: { dislikes: userId } },
      { new: true, timestamps: false }
    );
    
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    
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
