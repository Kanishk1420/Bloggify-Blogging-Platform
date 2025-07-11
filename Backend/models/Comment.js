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

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export const Comment = mongoose.model("Comment", commentShema);
