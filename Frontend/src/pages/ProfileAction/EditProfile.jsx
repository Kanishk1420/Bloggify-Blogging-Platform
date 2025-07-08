/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import avatar from "../../assets/avatar.jpg";
import { userApi } from "../../api/user";
import { useGetUserQuery, useUpdateUserMutation } from "../../api/user";
import { setCredentials } from "../../slices/AuthSlice";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { FaCheck, FaTimes, FaEyeSlash, FaRegEye } from "react-icons/fa";
import { useCheckUsernameAvailabilityQuery } from "../../api/auth";

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
      console.log("Loading from API:", user);

      // Track username specifically
      console.log("USERNAME FROM API:", user.username);
      console.log("USERNAME FROM REDUX:", userInfo?.user?.username);
      console.log("CURRENT USERNAME STATE:", username);

      // Preserve form values with priority from:
      // 1. Form's current state if editing
      // 2. Redux state as backup
      // 3. API data as last resort

      setUserId(user._id || "");

      // For username, keep any changes in progress
      if (username && username !== user.username && isEditing) {
        console.log("Preserving edited username:", username);
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
      console.log("Loading from Redux:", user);

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

      // Add this detailed debugging
      console.log("DETAILED API RESPONSE:", {
        fullData: data,
        bioField: data.user.bio,
        bioType: typeof data.user.bio,
      });

      // Rest of your code...
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

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        console.log(
          "Username change detected:",
          originalUsername,
          "→",
          username
        );
        usernameUpdated = await handleUsernameUpdate(username);
        setLoading(30);

        if (!usernameUpdated) {
          console.log("Username update failed, continuing with other updates");
        }
      }

      // Create FormData for file upload
      const formData = new FormData();

      // Only add the file if one was selected
      if (file) {
        formData.append("profilePhoto", file); // CHANGE FROM 'profilePicture' to 'profilePhoto'
        console.log("Adding profile photo to request");
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

      console.log("Submitting profile data with FormData");
      setLoading(50);

      // Debug code to check FormData contents
      console.log("FormData field names:");
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      // Update user with FormData
      const updatedUserResponse = await updateUser(formData).unwrap();

      console.log("API Response:", updatedUserResponse);
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

      console.log("Updating Redux with:", updatedReduxData);

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

      console.log("File selected:", selectedFile.name);
      console.log("File type:", selectedFile.type);
      console.log(
        "File size:",
        (selectedFile.size / 1024 / 1024).toFixed(2) + "MB"
      );
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

  // In your component, add these console.logs
  console.log("Redux state userInfo:", userInfo);
  console.log("API data:", data);
  console.log("Current state values:", { bio, username, email });

  // Add this state variable at the top with your other state declarations:
  const [isEditing, setIsEditing] = useState(false);

  // Add this to track when user starts editing:
  const handleUsernameChange = (e) => {
    setIsEditing(true);

    let value = e.target.value.toLowerCase();
    value = value.replace(/[^a-z0-9_]/g, "");
    const newUsername = value.startsWith("@") ? value : `@${value}`;
    setUsername(newUsername);

    // Reset availability message if same as original
    if (newUsername === originalUsername) {
      setUsernameMessage("");
    }
  };

  // Add a dedicated username update function
  const handleUsernameUpdate = async (newUsername) => {
    try {
      console.log("SENDING USERNAME UPDATE REQUEST:", newUsername);

      // Send username directly without the user wrapper
      const usernameUpdateResponse = await updateUser({
        username: newUsername, // Changed from { user: { username: newUsername } }
      }).unwrap();

      console.log("USERNAME UPDATE RESPONSE:", usernameUpdateResponse);

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

    // Reset validation if returning to original email
    if (newEmail === originalEmail) {
      setIsEmailValid(true);
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(newEmail));
  };

  return (
    <>
      <Navbar />

      <span
        role="progressbar"
        aria-labelledby="ProgressLabel"
        aria-valuenow={loading}
        className="block rounded-full bg-slate-700 relative overflow-hidden"
        style={{ height: "3px" }}
      >
        <span
          className="block absolute inset-0 bg-indigo-600"
          style={{ width: `${loading}%`, transition: "width 0.3s ease-in-out" }}
        ></span>
      </span>

      <div
        className={` w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row ${
          theme
            ? " bg-gradient-to-b from-black to-gray-800 via-black text-white"
            : "bg-white"
        }`}
      >
        {/* Sidebar */}
        <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
          <div
            className={`sticky flex flex-col gap-2 p-4 text-sm border-r ${
              theme ? "border-slate-700" : "border-zinc-100"
            } top-12`}
          >
            <h2 className="pl-[2.8em] mb-4 text-2xl font-semibold">Settings</h2>
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4 ">
          <div className="p-2 md:p-4">
            <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
              <h2 className="pl-6 text-2xl font-bold sm:text-xl">
                Public Profile
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="grid max-w-2xl mx-auto mt-8">
                  {/* Profile Picture */}
                  <div className="flex flex-col space-y-5 sm:flex-row sm:space-y-0">
                    <img
                      className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-zinc-300 dark:ring-zinc-500"
                      src={
                        preview
                          ? preview
                          : data?.user?.profilePhoto
                          ? `${img}${data?.user?.profilePhoto}`
                          : avatar
                      }
                      alt="Profile Avatar"
                    />
                    <div className="flex flex-col space-y-5 sm:ml-8">
                      <label
                        htmlFor="profilePicInput"
                        className="cursor-pointer"
                      >
                        <input
                          type="file"
                          id="profilePicInput"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            document.getElementById("profilePicInput").click()
                          }
                          className="py-3.5 mt-10 px-7 text-base font-medium text-zinc-100 focus:outline-none bg-zinc-900 rounded-lg border border-zinc-200 hover:bg-zinc-800 focus:z-10 focus:ring-4 focus:ring-zinc-200"
                        >
                          Add Profile Picture
                        </button>
                      </label>
                      {/* 
                                                <button
                                                    type="button"
                                                    className="py-3.5 px-7 text-base font-medium text-black focus:outline-none bg-white rounded-lg border border-zinc-200 hover:bg-zinc-100 hover:text-black focus:z-10 focus:ring-4 focus:ring-zinc-200"
                                                    onClick={() => setFile(null)}
                                                >
                                                    Remove Picture
                                                </button> */}
                    </div>
                  </div>

                  {/* Other Form Fields */}
                  <div
                    className={`items-center mt-8 sm:mt-14 ${
                      theme ? "text-white" : "text-black"
                    } `}
                  >
                    <div className="flex space-x-6">
                      <div className="w-1/2">
                        <label className="block mb-2 text-sm font-medium">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={firstname}
                          onChange={(e) => setFirstname(e.target.value)}
                          className={`border font-semibold text-sm rounded-lg block w-full p-2.5 ${
                            theme
                              ? "border-slate-900 bg-black text-white"
                              : "bg-zinc-100 "
                          }`}
                          placeholder="First name"
                          required
                        />
                      </div>
                      <div className="w-1/2">
                        <label className="block mb-2 text-sm font-medium ">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={lastname}
                          onChange={(e) => setLastname(e.target.value)}
                          className={`border font-semibold  text-sm rounded-lg  block w-full p-2.5 ${
                            theme
                              ? "border-slate-900  bg-black text-white"
                              : "bg-zinc-100 "
                          }`}
                          placeholder="Last name"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-2 mt-2 sm:mb-6">
                      <label className="block mb-2 text-sm font-medium">
                        Your Username
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={username}
                          onChange={handleUsernameChange}
                          className={`border font-semibold text-sm rounded-lg block w-full p-2.5 
                                                        ${
                                                          theme
                                                            ? "border-slate-900 bg-black text-white"
                                                            : "bg-zinc-100"
                                                        }
                                                        ${
                                                          !isUsernameAvailable &&
                                                          username !==
                                                            originalUsername
                                                            ? "border-red-500"
                                                            : !validateUsername(
                                                                username
                                                              ).valid
                                                            ? "border-yellow-500"
                                                            : isUsernameAvailable &&
                                                              username !==
                                                                originalUsername
                                                            ? "border-green-500"
                                                            : ""
                                                        }`}
                          placeholder="@username"
                          required
                        />

                        {/* Username availability indicator */}
                        {username !== originalUsername && (
                          <div className="absolute right-4 top-3">
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
                                  d="M4 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8-8-3.582-8-8zm2 0a6 6 0 1012 0 6 6 0 00-12 0z"
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

                      {/* Username validation message */}
                      {username !== originalUsername && (
                        <p
                          className={`mt-1 text-xs ${
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

                    <div className="mb-2 sm:mb-6">
                      <label className="block mb-2 text-sm font-medium">
                        Your email
                      </label>
                      <input
                        type="email"
                        onChange={handleEmailChange}
                        className={`border font-semibold text-sm rounded-lg block w-full p-2.5 
                                                  ${
                                                    theme
                                                      ? "border-slate-900 bg-black text-white"
                                                      : "bg-zinc-100"
                                                  }
                                                  ${
                                                    !isEmailValid
                                                      ? "border-red-500"
                                                      : ""
                                                  }`}
                        value={email}
                        placeholder="Email"
                        required
                      />
                      {!isEmailValid && (
                        <p className="mt-1 text-xs text-red-500">
                          Please enter a valid email address
                        </p>
                      )}
                    </div>

                    <div className="mb-6">
                      <label
                        htmlFor="message"
                        className="block mb-2 text-sm font-medium "
                      >
                        Bio
                      </label>
                      <textarea
                        rows="4"
                        value={bio || ""}
                        required
                        onChange={(e) => {
                          const newBio = e.target.value;
                          console.log("Setting bio to:", newBio);
                          setBio(newBio);
                        }}
                        className={`border font-semibold text-sm rounded-lg block w-full p-2.5 ${
                          theme
                            ? "border-slate-900 bg-black text-white"
                            : "bg-zinc-100 "
                        }`}
                        placeholder="Write your bio..."
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-8">
                      <div>
                        <div className="mb-2">
                          <label
                            className={`text-sm font-medium ${
                              theme ? "text-white" : "text-gray-800"
                            }`}
                          >
                            New Password:
                          </label>
                        </div>
                        <div className="relative">
                          {showPassword ? (
                            <FaRegEye
                              onClick={() => setShowPassword(false)}
                              className="absolute right-4 top-3 cursor-pointer"
                            />
                          ) : (
                            <FaEyeSlash
                              onClick={() => setShowPassword(true)}
                              className="absolute right-4 top-3 cursor-pointer"
                            />
                          )}
                          <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`block w-full border ${
                              theme
                                ? "bg-black text-white border-slate-800"
                                : "bg-white text-gray-800 border-gray-300"
                            } focus:border-cyan-500 placeholder-gray-400 focus:ring-cyan-500 p-2.5 text-sm rounded-lg ${
                              passwordError ? "border-red-500" : ""
                            }`}
                            type={showPassword ? "text" : "password"}
                            placeholder="Leave blank to keep current password"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="mb-2">
                          <label
                            className={`text-sm font-medium ${
                              theme ? "text-white" : "text-gray-800"
                            }`}
                          >
                            Confirm Password:
                          </label>
                        </div>
                        <div className="relative">
                          {showConfirmPassword ? (
                            <FaRegEye
                              onClick={() => setShowConfirmPassword(false)}
                              className="absolute right-4 top-3 cursor-pointer"
                            />
                          ) : (
                            <FaEyeSlash
                              onClick={() => setShowConfirmPassword(true)}
                              className="absolute right-4 top-3 cursor-pointer"
                            />
                          )}
                          <input
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`block w-full border ${
                              theme
                                ? "bg-black text-white border-slate-800"
                                : "bg-white text-gray-800 border-gray-300"
                            } focus:border-cyan-500 placeholder-gray-400 focus:ring-cyan-500 p-2.5 text-sm rounded-lg ${
                              passwordError ? "border-red-500" : ""
                            }`}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>
                    </div>

                    {passwordError && (
                      <p className="text-red-500 text-sm mt-1 mb-6">
                        {passwordError}
                      </p>
                    )}

                    {/* Save button with consistent styling */}
                    <div className="flex justify-center mt-8">
                      <button
                        type="submit"
                        className="text-white bg-zinc-900 hover:bg-zinc-800 focus:ring-4 focus:outline-none focus:ring-zinc-300 font-medium rounded-lg text-sm px-12 py-3 text-center dark:bg-zinc-600 dark:hover:bg-zinc-700 transition-all duration-200"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default EditProfile;
