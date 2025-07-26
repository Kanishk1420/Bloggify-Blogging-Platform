/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import avatar from "../../assets/avatar.jpg";
import { userApi } from "../../api/user";
import {
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "../../api/user";
import { setCredentials, logout } from "../../slices/AuthSlice";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { FaCheck, FaTimes, FaEyeSlash, FaRegEye } from "react-icons/fa";
import { useCheckUsernameAvailabilityQuery } from "../../api/auth";
import { validateEmailDomain } from "../../utils/emailValidator";

const EditProfile = () => {
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState(0);
  const [preview, setPreview] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [loading, setLoading] = useState(0);
  const [updateUser] = useUpdateUserMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const id = useParams().id;
  const navigate = useNavigate();
  const img = import.meta.env.VITE_IMG_URL;
  const dispatch = useDispatch();

  // Use refetch to force data reload and skip cache
  const { data, error, refetch } = useGetUserQuery(id, {
    refetchOnMountOrArgChange: true, // Force refetch when component mounts
  });

  const { theme } = useSelector((state) => state.theme);

  // State variables for username checking
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [usernameMessage, setUsernameMessage] = useState("");
  const [originalUsername, setOriginalUsername] = useState("");

  // Add a state for email validation
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [originalEmail, setOriginalEmail] = useState("");

  // Add this to your state variables at the top
  const [formChanged, setFormChanged] = useState(false);
  const [initialState, setInitialState] = useState({
    username: "",
    email: "",
    bio: "",
    firstname: "",
    lastname: "",
    profilePhotoUrl: "",
  });
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  // Use the username check RTK Query hook
  const { data: usernameData, isFetching: isCheckingUsername } =
    useCheckUsernameAvailabilityQuery(username, {
      skip: !username || username === originalUsername || username.length < 4,
      refetchOnMountOrArgChange: true,
    });

  // Update username availability state when the query returns data
  useEffect(() => {
    if (usernameData) {
      setIsUsernameAvailable(usernameData.available);
      setUsernameMessage(usernameData.message);
    }
  }, [usernameData]);

  // This effect will run whenever the data changes (including after a refetch)
  useEffect(() => {
    // First, check if we have API data
    if (data && data.user) {
      const user = data.user;

      setUserId(user._id || "");

      // For username, keep any changes in progress
      if (username && username !== user.username && isEditing) {
        // Don't override username if user is currently editing
      } else {
        // Otherwise use API/Redux data
        const redisUsername = userInfo?.user?.username;
        setUsername(user.username || redisUsername || "");
        setOriginalUsername(user.username || redisUsername || "");
      }

      // Similar approach for other fields
      setEmail(user.email || userInfo?.user?.email || "");
      setFirstname(user.firstname || userInfo?.user?.firstname || "");
      setLastname(user.lastname || userInfo?.user?.lastname || "");

      // Keep using bio from Redux
      const redisBio = userInfo?.user?.bio || "";
      setBio(redisBio);

      if (user.profilePhoto?.url) {
        setPreview(user.profilePhoto.url);
      }
    }
    // Fallback to Redux if API data isn't available
    else if (userInfo?.user) {
      const user = userInfo.user;

      setUserId(user._id || "");
      setUsername(user.username || "");
      setOriginalUsername(user.username || "");
      setEmail(user.email || "");
      setBio(user.bio || ""); // Use bio from Redux
      setFirstname(user.firstname || "");
      setLastname(user.lastname || "");

      if (user.profilePhoto?.url) {
        setPreview(user.profilePhoto.url);
      }
    }
  }, [data, userInfo, username]); // Add username to dependencies

  // Add these debug logs at the top of your useEffect:
  useEffect(() => {
    if (data && data.user) {
      const user = data.user;
    }
  }, [data, userInfo]);

  // Username validation function
  const validateUsername = (username) => {
    if (username.length < 4) {
      return {
        valid: false,
        message: "Username must be at least 3 characters (not including @)",
      };
    }

    const validCharsRegex = /^@[a-z0-9_]+$/;
    if (!validCharsRegex.test(username)) {
      return {
        valid: false,
        message: "Username can only contain letters, numbers and underscores",
      };
    }

    return { valid: true, message: "" };
  };

  // Add a state for password confirmation
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Add validation to check password before submission
  const validatePassword = () => {
    // Reset previous errors
    setPasswordError("");

    // Skip validation if no password change is being made
    if (!password) {
      return true;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match");
      toast.error("Passwords don't match");
      return false;
    }

    // Password strength validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
      );
      toast.error("Password must meet security requirements");
      return false;
    }

    return true;
  };

  // Add this effect to track initial state
  useEffect(() => {
    if (data?.user || userInfo?.user) {
      const user = data?.user || userInfo?.user;
      // Store initial values to compare later
      setInitialState({
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        profilePhotoUrl: user.profilePhoto?.url || "",
      });
    }
  }, [data, userInfo]);

  // Add a function to check if any changes were made
  const hasChanges = () => {
    // Check if file was added (new profile picture)
    if (file) {
      return true;
    }

    // Check if any text fields changed
    if (username !== initialState.username) return true;
    if (email !== initialState.email) return true;
    if (bio !== initialState.bio) return true;
    if (firstname !== initialState.firstname) return true;
    if (lastname !== initialState.lastname) return true;
    if (password) return true; // Any password input counts as a change

    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any changes were made
    if (!hasChanges()) {
      toast.info(
        "No changes detected. Please update some information before saving."
      );
      return;
    }

    // Validate the username first
    if (username !== originalUsername && !isUsernameAvailable) {
      toast.error("Username is not available. Please choose another one.");
      return;
    }

    // Validate password if one is provided
    if (password && !validatePassword()) {
      return;
    }

    try {
      setLoading(10);

      // Check if username is being updated
      let usernameUpdated = false;
      if (username !== originalUsername) {
        usernameUpdated = await handleUsernameUpdate(username);
        setLoading(30);
      }

      // Create FormData for file upload
      const formData = new FormData();

      // Only add the file if one was selected
      if (file) {
        formData.append("profilePhoto", file); // CHANGE FROM 'profilePicture' to 'profilePhoto'
      }

      // Add other user data to FormData
      formData.append("email", email);
      formData.append("bio", bio || "");
      formData.append("firstname", firstname);
      formData.append("lastname", lastname);

      // Only include username in this update if we didn't do it separately
      if (!usernameUpdated && username !== originalUsername) {
        formData.append("username", username);
      }

      if (password) {
        formData.append("password", password);
      }
      setLoading(50);

      // Update user with FormData
      const updatedUserResponse = await updateUser(formData).unwrap();
      setLoading(80);

      const userData = updatedUserResponse.user || updatedUserResponse;

      // Create proper Redux update
      const updatedReduxData = {
        ...userInfo,
        user: {
          ...userInfo.user,
          ...userData,
          username: username,
          bio: bio,
          email: email,
          firstname: firstname,
          lastname: lastname,
          profilePhoto: userData.profilePhoto || userInfo.user.profilePhoto,
        },
      };

      // Dispatch the update to Redux
      dispatch(setCredentials(updatedReduxData));

      // Force cache invalidation
      dispatch(userApi.util.invalidateTags(["User"]));

      toast.success("Profile updated successfully!");
      setLoading(100);

      // Navigate after a small delay
      setTimeout(() => {
        navigate(`/profile/${id}`);
      }, 500);
    } catch (err) {
      console.log("Update error:", err);

      // Handle specific error for same password
      if (
        err?.data?.message ===
        "New password cannot be the same as your old password"
      ) {
        toast.error("Please choose a password different from your current one");
        setPasswordError(
          "Please choose a password different from your current one"
        );
      } else {
        toast.error(err?.data?.message || "Failed to update profile");
      }

      setLoading(0);
    }
  };

  // Update the handleFileChange function with validation

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      // Check if file is an image
      const validImageTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/jpg",
        "image/webp",
        "image/svg+xml",
      ];

      if (!validImageTypes.includes(selectedFile.type)) {
        // Not a valid image type
        toast.error(
          "Please select a valid image file (PNG, JPG, GIF, WEBP, SVG)"
        );
        e.target.value = null; // Reset the input
        return;
      }

      // File size validation (optional) - limit to 5MB
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (selectedFile.size > maxSize) {
        toast.error("Image size should be less than 5MB");
        e.target.value = null; // Reset the input
        return;
      }

      setFile(selectedFile);

      // Create a preview URL for the selected image
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
    }
  };

  // Don't use an effect for refetch - it creates a race condition
  // Instead, call refetch directly after update in the handleSubmit
  // But make sure we have a safe refetch function

  const safeRefetch = () => {
    try {
      if (refetch) {
        return refetch();
      }
      return Promise.resolve();
    } catch (err) {
      console.error("Refetch error:", err);
      return Promise.resolve();
    }
  };

  // Add this state variable at the top with your other state declarations:
  const [isEditing, setIsEditing] = useState(false);

  // Add this to track when user starts editing:
  const handleUsernameChange = (e) => {
    setIsEditing(true);

    let value = e.target.value.toLowerCase();
    value = value.replace(/[^a-z0-9_]/g, "");
    const newUsername = value.startsWith("@") ? value : `@${value}`;
    setUsername(newUsername);
    setFormChanged(true);

    // Reset availability message if same as original
    if (newUsername === originalUsername) {
      setUsernameMessage("");
    }
  };

  // Add a dedicated username update function
  const handleUsernameUpdate = async (newUsername) => {
    try {

      // Send username directly without the user wrapper
      const usernameUpdateResponse = await updateUser({
        username: newUsername, // Changed from { user: { username: newUsername } }
      }).unwrap();

      // Force Redux update for username
      dispatch(
        setCredentials({
          ...userInfo,
          user: {
            ...userInfo.user,
            username: newUsername,
          },
        })
      );

      return true;
    } catch (err) {
      console.error("Username update failed:", err);
      toast.error("Failed to update username. Please try again.");
      return false;
    }
  };

  // Email validation function
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setFormChanged(true);

    // Reset validation if returning to original email
    if (newEmail === originalEmail) {
      setIsEmailValid(true);
      setEmailErrorMessage("");
      return;
    }

    // Use the advanced domain validation
    const validation = validateEmailDomain(newEmail);
    setIsEmailValid(validation.valid);
    setEmailErrorMessage(validation.message);
  };

  // Add these new states for the delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Add this RTK query hook for the delete operation
  const [deleteUser] = userApi.useDeleteUserMutation();

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") return;

    try {
      setIsDeleting(true);
      setLoading(20);

      // Make the API call to delete user
      const response = await deleteUser(userId).unwrap();
      setLoading(80);
      
      // Change this to navigate to /home instead of /
      navigate("/home");
      
      toast.success("Your account has been permanently deleted");
      dispatch(logout());
      
      setLoading(100);
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(
        err?.data?.message || "Failed to delete account. Please try again."
      );
      setIsDeleting(false);
      setShowDeleteModal(false);
      setLoading(0);
    }
  };

  // Add this effect to manage body scroll locking
  useEffect(() => {
    // When delete modal is shown, prevent background scrolling
    if (showDeleteModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    // Cleanup function to ensure scroll is restored when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showDeleteModal]);

  return (
    <>
      <Navbar />

      {/* Progress bar */}
      <span
        role="progressbar"
        aria-labelledby="ProgressLabel"
        aria-valuenow={loading}
        className={`block rounded-full relative overflow-hidden ${
          theme ? "bg-slate-800" : "bg-gray-100"
        }`}
        style={{ height: "3px" }}
      >
        <span
          className={`block absolute inset-0 ${
            theme ? "bg-indigo-600" : "bg-blue-500"
          }`}
          style={{ width: `${loading}%`, transition: "width 0.3s ease-in-out" }}
        ></span>
      </span>

      {/* Main Container */}
      <div
        className={`min-h-screen ${
          theme
            ? "bg-gradient-to-b from-black to-gray-800 via-black text-white"
            : "bg-gray-50"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar with Improved Sticky Behavior */}
            <aside className="w-full md:w-1/4 md:self-start">
              <div
                className={`md:sticky md:top-20 p-6 rounded-xl z-30 transition-all duration-200 ${
                  theme
                    ? "bg-zinc-900 text-white shadow-zinc-800/50"
                    : "bg-white shadow-lg"
                }`}
                style={{
                  maxHeight: "calc(100vh - 120px)",
                  overflow: "auto",
                }}
              >
                <h2 className="text-xl font-bold mb-6">Profile Settings</h2>

                <nav className="space-y-2">
                  <a
                    href="#personal-info"
                    className={`flex items-center px-4 py-2.5 rounded-lg ${
                      theme
                        ? "bg-blue-900/30 text-blue-200"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Personal Info
                  </a>
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <main className="w-full md:w-3/4">
              <div
                className={`p-8 rounded-xl ${
                  theme
                    ? "bg-zinc-900 shadow-zinc-800/50"
                    : "bg-white shadow-lg"
                }`}
              >
                <h1 className="text-2xl font-bold mb-8">Public Profile</h1>

                <form onSubmit={handleSubmit}>
                  {/* Profile Picture Section */}
                  <div className="mb-8 pb-8 border-b border-dashed border-gray-700/30">
                    <h2
                      className={`text-lg font-semibold mb-4 ${
                        theme ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      Profile Photo
                    </h2>

                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="relative">
                        <img
                          className="w-36 h-36 object-cover rounded-full ring-4 ring-offset-2 shadow-lg 
                          ${theme ? 'ring-blue-600 ring-offset-zinc-900' : 'ring-blue-500 ring-offset-white'}"
                          src={
                            preview ||
                            (data?.user?.profilePhoto
                              ? `${img}${data?.user?.profilePhoto}`
                              : avatar)
                          }
                          alt="Profile Avatar"
                        />

                        <div className="absolute bottom-0 right-0 transform translate-x-1/4">
                          <label
                            htmlFor="profilePicInput"
                            className={`flex items-center justify-center w-10 h-10 rounded-full cursor-pointer shadow-lg ${
                              theme
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-blue-500 hover:bg-blue-600"
                            }`}
                          >
                            <input
                              type="file"
                              id="profilePicInput"
                              className="hidden"
                              onChange={handleFileChange}
                            />
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          </label>
                        </div>
                      </div>

                      <div>
                        <h3
                          className={`text-md font-medium mb-2 ${
                            theme ? "text-gray-200" : "text-gray-700"
                          }`}
                        >
                          Profile photo
                        </h3>
                        <p
                          className={`text-sm mb-4 ${
                            theme ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Add a photo to personalize your profile. Recommended
                          size: 400x400px (max 5MB).
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            document.getElementById("profilePicInput").click()
                          }
                          className={`py-2 px-4 text-sm font-medium rounded-lg ${
                            theme
                              ? "bg-zinc-800 text-white hover:bg-zinc-700"
                              : "bg-gray-200 text-gray-800 hover:bg-[#1576D8] hover:text-white"
                          } transition-all duration-200`}
                        >
                          Change photo
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Personal Information Section */}
                  <div className="mb-8 pb-8 border-b border-dashed border-gray-700/30">
                    <h2
                      className={`text-lg font-semibold mb-4 ${
                        theme ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      Personal Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          className={`block mb-2 text-sm font-medium ${
                            theme ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          value={firstname}
                          onChange={(e) => {
                            setFirstname(e.target.value);
                            setFormChanged(true);
                          }}
                          className={`w-full px-4 py-3 rounded-lg ${
                            theme
                              ? "bg-zinc-800 border border-zinc-700 text-white focus:border-blue-500"
                              : "bg-gray-50 border border-gray-300 text-gray-900 focus:border-blue-500"
                          } focus:ring-blue-500 focus:ring-1 outline-none transition-colors`}
                          placeholder="First name"
                          required
                        />
                      </div>

                      <div>
                        <label
                          className={`block mb-2 text-sm font-medium ${
                            theme ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={lastname}
                          onChange={(e) => {
                            setLastname(e.target.value);
                            setFormChanged(true);
                          }}
                          className={`w-full px-4 py-3 rounded-lg ${
                            theme
                              ? "bg-zinc-800 border border-zinc-700 text-white focus:border-blue-500"
                              : "bg-gray-50 border border-gray-300 text-gray-900 focus:border-blue-500"
                          } focus:ring-blue-500 focus:ring-1 outline-none transition-colors`}
                          placeholder="Last name"
                          required
                        />
                      </div>

                      <div className="col-span-1 md:col-span-2">
                        <label
                          className={`block mb-2 text-sm font-medium ${
                            theme ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Username
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={username}
                            onChange={handleUsernameChange}
                            className={`w-full px-4 py-3 rounded-lg ${
                              theme
                                ? "bg-zinc-800 border text-white"
                                : "bg-gray-50 border text-gray-900"
                            } focus:ring-1 outline-none transition-colors ${
                              !isUsernameAvailable &&
                              username !== originalUsername
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                : !validateUsername(username).valid
                                ? "border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500"
                                : isUsernameAvailable &&
                                  username !== originalUsername
                                ? "border-green-500 focus:border-green-500 focus:ring-green-500"
                                : theme
                                ? "border-zinc-700 focus:border-blue-500 focus:ring-blue-500"
                                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            }`}
                            placeholder="@username"
                            required
                          />

                          {username !== originalUsername && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                              {isCheckingUsername ? (
                                <svg
                                  className="animate-spin h-5 w-5 text-gray-500"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014.708 14H2c0 4.418 3.582 8 8 8v-2c-3.314 0-6-2.686-6-6zM20 12c0-4.418-3.582-8-8-8v2c3.314 0 6 2.686 6 6 0 1.385-.468 2.657-1.25 3.682l1.562 1.562A7.962 7.962 0 0020 12z"
                                  ></path>
                                </svg>
                              ) : !validateUsername(username).valid ? (
                                <FaTimes className="text-yellow-500" />
                              ) : isUsernameAvailable ? (
                                <FaCheck className="text-green-500" />
                              ) : (
                                <FaTimes className="text-red-500" />
                              )}
                            </div>
                          )}
                        </div>

                        {username !== originalUsername && (
                          <p
                            className={`mt-2 text-sm ${
                              !validateUsername(username).valid
                                ? "text-yellow-500"
                                : isUsernameAvailable
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {!validateUsername(username).valid
                              ? validateUsername(username).message
                              : usernameMessage}
                          </p>
                        )}
                      </div>

                      <div className="col-span-1 md:col-span-2">
                        <label
                          className={`block mb-2 text-sm font-medium ${
                            theme ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={handleEmailChange}
                          className={`w-full px-4 py-3 rounded-lg ${
                            theme
                              ? "bg-zinc-800 border text-white"
                              : "bg-gray-50 border text-gray-900"
                          } focus:ring-1 outline-none transition-colors ${
                            !isEmailValid
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                              : theme
                              ? "border-zinc-700 focus:border-blue-500 focus:ring-blue-500"
                              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          }`}
                          placeholder="Your email address"
                          required
                        />

                        {!isEmailValid && (
                          <p className="mt-2 text-sm text-red-500">
                            {emailErrorMessage ||
                              "Please enter a valid email address"}
                          </p>
                        )}
                      </div>

                      <div className="col-span-1 md:col-span-2">
                        <label
                          className={`block mb-2 text-sm font-medium ${
                            theme ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Bio
                        </label>
                        <textarea
                          rows="4"
                          value={bio || ""}
                          onChange={(e) => {
                            setBio(e.target.value);
                            setFormChanged(true);
                          }}
                          className={`w-full px-4 py-3 rounded-lg ${
                            theme
                              ? "bg-zinc-800 border border-zinc-700 text-white focus:border-blue-500"
                              : "bg-gray-50 border border-gray-300 text-gray-900 focus:border-blue-500"
                          } focus:ring-blue-500 focus:ring-1 outline-none transition-colors`}
                          placeholder="Write a short bio about yourself..."
                          required
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Password Section */}
                  <div className="mb-8">
                    <h2
                      className={`text-lg font-semibold mb-4 ${
                        theme ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      Change Password
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          className={`block mb-2 text-sm font-medium ${
                            theme ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              setFormChanged(true);
                            }}
                            className={`w-full pl-4 pr-12 py-3 rounded-lg ${
                              theme
                                ? "bg-zinc-800 border text-white"
                                : "bg-gray-50 border text-gray-900"
                            } focus:ring-1 outline-none transition-colors ${
                              passwordError
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                : theme
                                ? "border-zinc-700 focus:border-blue-500 focus:ring-blue-500"
                                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            }`}
                            placeholder="Leave blank to keep current password"
                          />

                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500"
                          >
                            {showPassword ? (
                              <FaRegEye size={18} />
                            ) : (
                              <FaEyeSlash size={18} />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label
                          className={`block mb-2 text-sm font-medium ${
                            theme ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => {
                              setConfirmPassword(e.target.value);
                              setFormChanged(true);
                            }}
                            className={`w-full pl-4 pr-12 py-3 rounded-lg ${
                              theme
                                ? "bg-zinc-800 border text-white"
                                : "bg-gray-50 border text-gray-900"
                            } focus:ring-1 outline-none transition-colors ${
                              passwordError
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                : theme
                                ? "border-zinc-700 focus:border-blue-500 focus:ring-blue-500"
                                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            }`}
                            placeholder="Confirm your new password"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500"
                          >
                            {showConfirmPassword ? (
                              <FaRegEye size={18} />
                            ) : (
                              <FaEyeSlash size={18} />
                            )}
                          </button>
                        </div>
                      </div>

                      {passwordError && (
                        <p className="col-span-1 md:col-span-2 text-sm text-red-500 mt-0">
                          {passwordError}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Form Actions - Improved Layout */}
                  <div className="flex flex-wrap justify-between items-center gap-4 pt-6 border-t border-gray-700/30">
                    {/* Left: Cancel Button */}
                    <button
                      type="button"
                      onClick={() => navigate(`/profile/${id}`)}
                      className={`px-6 py-2.5 rounded-lg text-sm font-medium ${
                        theme
                          ? "bg-transparent text-white hover:bg-zinc-800"
                          : "bg-transparent text-gray-700 hover:bg-gray-100"
                      } transition-colors`}
                    >
                      Cancel
                    </button>

                    {/* Right: Action Buttons Container */}
                    <div className="flex gap-4">
                      {/* Delete Account Button */}
                      <button
                        type="button"
                        onClick={() => setShowDeleteModal(true)}
                        className={`px-6 py-2.5 rounded-lg text-sm font-medium ${
                          theme
                            ? "bg-red-900/40 text-red-200 hover:bg-red-900/60"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        } transition-colors`}
                      >
                        Delete Account
                      </button>

                      {/* Save Changes Button */}
                      <button
                        type="submit"
                        disabled={!formChanged && !hasChanges()}
                        className={`px-6 py-2.5 rounded-lg text-sm font-medium ${
                          !formChanged && !hasChanges()
                            ? "bg-gray-400 cursor-not-allowed text-white"
                            : theme
                            ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                            : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                        } transition-colors`}
                      >
                        {loading > 0 ? (
                          <span className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014.708 14H2c0 4.418 3.582 8 8 8v-2c-3.314 0-6-2.686-6-6zM20 12c0-4.418-3.582-8-8-8v2c3.314 0 6 2.686 6 6 0 1.385-.468 2.657-1.25 3.682l1.562 1.562A7.962 7.962 0 0020 12z"
                              ></path>
                            </svg>
                            Saving...
                          </span>
                        ) : !formChanged && !hasChanges() ? (
                          "No Changes"
                        ) : (
                          "Save Changes"
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </main>
          </div>
        </div>
      </div>

      <Footer />

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
            theme ? "bg-black/80" : "bg-gray-900/50"
          }`}
        >
          <div
            className={`w-full max-w-md p-6 rounded-lg shadow-lg ${
              theme ? "bg-zinc-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            {/* Warning Icon */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
              <svg
                className="h-8 w-8 text-red-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h3
              className={`text-xl font-bold mb-2 text-center ${
                theme ? "text-red-400" : "text-red-600"
              }`}
            >
              Delete Account Permanently
            </h3>

            <p
              className={`text-center mb-6 ${
                theme ? "text-gray-300" : "text-gray-600"
              }`}
            >
              This action <span className="font-bold">cannot be undone</span>.
              All your posts, comments, and profile data will be permanently
              deleted.
            </p>

            <div className="mb-6">
              <label
                className={`block mb-2 text-sm font-medium ${
                  theme ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Type <span className="font-mono font-bold">DELETE</span> to
                confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg ${
                  theme
                    ? "bg-zinc-800 border border-zinc-700 text-white focus:border-red-500"
                    : "bg-gray-50 border border-gray-300 text-gray-900 focus:border-red-500"
                } focus:ring-red-500 focus:ring-1 outline-none transition-colors`}
                placeholder="DELETE"
                autoComplete="off"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText("");
                }}
                className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium ${
                  theme
                    ? "bg-zinc-700 text-white hover:bg-zinc-600"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                } transition-all duration-200`}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== "DELETE" || isDeleting}
                className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium ${
                  deleteConfirmText !== "DELETE" || isDeleting
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : theme
                    ? "bg-red-600 text-white hover:bg-red-500"
                    : "bg-red-600 text-white hover:bg-red-500"
                } transition-all duration-200`}
              >
                {isDeleting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014.708 14H2c0 4.418 3.582 8 8 8v-2c-3.314 0-6-2.686-6-6zM20 12c0-4.418-3.582-8-8-8v2c3.314 0 6 2.686 6 6 0 1.385-.468 2.657-1.25 3.682l1.562 1.562A7.962 7.962 0 0020 12z"
                      ></path>
                    </svg>
                    Deleting...
                  </span>
                ) : (
                  "Delete Permanently"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
