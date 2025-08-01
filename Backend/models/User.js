import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^@[a-z0-9_-]+$/.test(v); // Make sure hyphen is included
        },
        message: (props) => `${props.value} is not a valid username!`,
      },
    },

    firstname: {
      type: String,
      required: true,
    },

    lastname: {
      type: String,
      required: true,
    },

    bio: {
      type: String,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    profilePhoto: {
      public_id: String,
      url: String,
    },

    otp: {
      type: String,
    },

    otpExpire: {
      type: Date,
    },

    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },

  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
