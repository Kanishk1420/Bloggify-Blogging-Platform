import { User } from "../models/User.js";

export const findUser = async (req, res) => {
  try {
    // Not show logged-in user profile
    let authUser = await User.findById(req.params.id);

    if (!authUser) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const user = await User.findById(req.userId);

    let following = user.following || [];
    following.push(user._id);

    const allUser = await User.find({ _id: { $nin: following } }).limit(10);

    return res.status(200).json({
      success: true,
      allUser,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const addFollower = async (req, res, next) => {
  try {
    const { id } = req.params;

    const authUser = await User.findById(id);

    if (!authUser) {
      res.status(400).json({
        success: false,
        message: "Auth user not found",
      });
      return;
    }

    const user = await User.findByIdAndUpdate(id, {
      $addToSet: { followers: { _id: req.userId } },
    });

    // Add the user to the follower's following list
    await User.findByIdAndUpdate(req.userId, {
      $addToSet: { following: { _id: id } },
    });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    return res.status(401).json({
      message: err.message,
    });
  }
};

// Show following list
export const userFollowing = async (req, res) => {
  try {
    // Check if the user exists
    const { id } = req.params;
    const user = await User.findById(id).populate("following");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Fetch the users that the current user is following

    res.status(200).json({
      success: true,
      following: user.following,
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Show followers list

export const userFollowers = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the id parameter is undefined or null
    if (!id) {
      return res.status(400).json({
        message: "ID parameter is missing",
      });
    }

    const user = await User.findById(id).populate("followers");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      followers: user.followers,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

//Remove follower
export const userUnfollow = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Remove follower
    const user = await User.findByIdAndUpdate(id, {
      $pull: { followers: req.userId },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Unfollow user
    const currentUser = await User.findByIdAndUpdate(
      req.userId,
      { $pull: { following: id } },
      { new: true }
    );

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: currentUser,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
