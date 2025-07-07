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
