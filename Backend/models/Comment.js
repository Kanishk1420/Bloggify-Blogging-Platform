import mongoose from "mongoose";

const commentShema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      required: true,
    },

    postId: {
      type: String,
      required: true,
    },

    userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Comment = mongoose.model("Comment", commentShema);
