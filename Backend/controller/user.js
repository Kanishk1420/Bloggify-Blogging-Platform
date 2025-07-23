import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";
import getDataUri from "../utils/dataUri.js";

// Update User
export const updateUser = async (req, res) => {
  try {
    console.log("Update request file:", req.file);
    console.log("Update request body fields:", Object.keys(req.body));

    const id = req.userId;
    const { password, username, firstname, lastname, email, bio } = req.body;
    const updateFields = {};

    // Check if the user exists
    const authUser = await User.findById(id);
    if (!authUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (password) {
      // Check if new password is same as current
      const isSamePassword = await bcrypt.compare(password, authUser.password);
      if (isSamePassword) {
        return res.status(400).json({ 
          success: false, 
          message: "New password cannot be the same as your old password" 
        });
      }
      
      // Hash the new password
      updateFields.password = await bcrypt.hash(password, 10);
    }

    if (username) {
      console.log("Updating username from:", authUser.username, "to:", username);
      updateFields.username = username;
    }
    if (firstname) updateFields.firstname = firstname;
    if (lastname) updateFields.lastname = lastname;
    if (email) updateFields.email = email;
    updateFields.bio = bio !== undefined ? bio : authUser.bio;

    const file = req.file;
    if (file) {
      const filUri = getDataUri(file);
      const result = await cloudinary.uploader.upload(filUri.content, {
        folder: "profile",
        resource_type: "auto",
        use_filename: true,
        public_id: file.originalname.split(".")[0],
      });

      updateFields.profilePhoto = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    // Update user in the database
    const updatedUser = await User.findByIdAndUpdate(id, updateFields, { new: true });

    // Send updated user data in the response
    res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    // Check if this is a duplicate key error
    if (err.code === 11000) {
      // Check if the duplicate key is for email
      if (err.message.includes('email')) {
        return res.status(400).json({ 
          success: false, 
          message: "This email address is already in use. Please try a different email."
        });
      } 
      // Check if it's a username duplicate
      else if (err.message.includes('username')) {
        return res.status(400).json({ 
          success: false, 
          message: "This username is already taken. Please choose a different one."
        });
      }
    }
    
    // Default error message for other errors
    console.error("Update user error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to update profile. Please try again." 
    });
  }
};

//delete user
// Delete user account
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate if the user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Authentication check - only allow users to delete their own account
    // or admins to delete any account
    if (req.userId.toString() !== id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this account"
      });
    }

    // Delete user's posts
    const { Post } = await import('../models/Post.js');
    await Post.deleteMany({ userId: id });
    
    // Delete user's comments
    const { Comment } = await import('../models/Comment.js');
    await Comment.deleteMany({ userId: id });
    
    // Remove user from other users' followers/following lists
    await User.updateMany(
      { followers: id },
      { $pull: { followers: id } }
    );
    
    await User.updateMany(
      { following: id },
      { $pull: { following: id } }
    );
    
    // Remove user's likes from posts
    await Post.updateMany(
      { likes: id },
      { $pull: { likes: id } }
    );
    
    // Remove user's bookmarks from posts
    await Post.updateMany(
      { bookmarks: id },
      { $pull: { bookmarks: id } }
    );
    
    // Finally delete the user
    await User.findByIdAndDelete(id);
    
    // Clear auth cookie
    res.clearCookie("token", {
      expires: new Date(0),
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      secure: process.env.NODE_ENV === "development" ? false : true,
    });
    
    return res.status(200).json({
      success: true,
      message: "Account deleted successfully"
    });
  } catch (err) {
    console.error("Delete user error:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting your account"
    });
  }
};

//get user
export const getUser = async (req, res) => {
  let { id } = req.params;
  try {
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// export const uploadProfilePhoto = async (req, res) => {
//   try {

//     if (!req.file) {
//       return res.status(400).json({ success: false, message: "No file uploaded" });
//     }

//     const file = req.file;
//     const filUri = getDataUri(file);


//     const result = await cloudinary.uploader.upload(filUri.content, {
//       folder: "profile",
//       resource_type: "auto",
//       use_filename: true,
//       public_id: file.originalname.split(".")[0],
//     });


//     return res.json({
//       success: true,
//       public_id: result.public_id,
//       secure_url: result.secure_url,
//     });
//   } catch (err) {

//     console.error("Error uploading profile photo:", err);
//     return res.status(500).json({ success: false, message: "Failed to upload profile photo" });
//   }
// };


export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({ _id: { $ne: req.userId } });

    if (allUsers.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({
      success: true,
      allUsers,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getSearchedUser = async (req, res) => {
  const { search } = req.query;

  try {
    // Check if search parameter exists
    if (!search) {
      return res.status(200).json({
        success: true,
        searchedUser: [] // Return empty array instead of error
      });
    }

    const searchedUser = await User.find({
      $or: [
        { firstname: { $regex: search, $options: "i" } },
        { lastname: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
      ],
    });

    if (!searchedUser || searchedUser.length === 0) {
      return res.status(404).json({ message: "No user found" });
    }

    res.status(200).json({
      success: true,
      searchedUser,
    });
  } catch (err) {
    console.error("Search error details:", err);
    res.status(500).json({
      message: err.message,
    });
  }
};



