/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import avatar from '../../assets/avatar.jpg';
import { userApi } from '../../api/user';
import { useGetUserQuery, useUpdateUserMutation } from '../../api/user';
import { setCredentials } from '../../slices/AuthSlice';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useCheckUsernameAvailabilityQuery } from '../../api/auth';

const EditProfile = () => {
    const [file, setFile] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [bio, setBio] = useState('');
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState(0);
    const [preview, setPreview] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [loading, setLoading] = useState(0);
    const [updateUser] = useUpdateUserMutation();
    const { userInfo } = useSelector((state) => state.auth);
    const id = useParams().id;
    const navigate = useNavigate();
    const img = import.meta.env.VITE_IMG_URL;
    const dispatch = useDispatch();
    
    // Use refetch to force data reload and skip cache
    const { data, error, refetch } = useGetUserQuery(id, {
        refetchOnMountOrArgChange: true // Force refetch when component mounts
    });
    
    const { theme } = useSelector((state) => state.theme);

    // State variables for username checking
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
    const [usernameMessage, setUsernameMessage] = useState('');
    const [originalUsername, setOriginalUsername] = useState('');

    // Use the username check RTK Query hook
    const { data: usernameData, isFetching: isCheckingUsername } = useCheckUsernameAvailabilityQuery(
        username, 
        { 
            skip: !username || username === originalUsername || username.length < 4,
            refetchOnMountOrArgChange: true
        }
    );

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
            
            // Get bio from Redux as backup since API doesn't return it
            const redisBio = userInfo?.user?.bio || '';
            
            // Set all values from API data
            setUserId(user._id || '');
            setUsername(user.username || '');
            setOriginalUsername(user.username || '');
            setEmail(user.email || '');
            setFirstname(user.firstname || '');
            setLastname(user.lastname || '');
            
            // CRITICAL FIX: Use bio from Redux, not API
            setBio(redisBio);
            console.log("Setting bio value:", redisBio);
            
            if (user.profilePhoto?.url) {
                setPreview(user.profilePhoto.url);
            }
        } 
        // Fallback to Redux if API data isn't available
        else if (userInfo?.user) {
            const user = userInfo.user;
            console.log("Loading from Redux:", user);
            
            setUserId(user._id || '');
            setUsername(user.username || '');
            setOriginalUsername(user.username || '');
            setEmail(user.email || '');
            setBio(user.bio || ''); // Use bio from Redux
            setFirstname(user.firstname || '');
            setLastname(user.lastname || '');

            if (user.profilePhoto?.url) {
                setPreview(user.profilePhoto.url);
            }
        }
    }, [data, userInfo]); // Add userInfo as dependency

    // Add these debug logs at the top of your useEffect:
    useEffect(() => {
        if (data && data.user) {
            const user = data.user;
            
            // Add this detailed debugging
            console.log("DETAILED API RESPONSE:", {
                fullData: data,
                bioField: data.user.bio,
                bioType: typeof data.user.bio
            });
            
            // Rest of your code...
        }
    }, [data, userInfo]);

    // Username validation function
    const validateUsername = (username) => {
        if (username.length < 4) {
            return { valid: false, message: "Username must be at least 3 characters (not including @)" };
        }
        
        const validCharsRegex = /^@[a-z0-9_]+$/;
        if (!validCharsRegex.test(username)) {
            return { valid: false, message: "Username can only contain letters, numbers and underscores" };
        }
        
        return { valid: true, message: "" };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(10);

            // Prepare user data - ensure bio is explicitly included
            let newUserInfo = {
                username: username,
                email: email,
                bio: bio || '', // Ensure bio is never undefined
                firstname: firstname,
                lastname: lastname,
            };

            console.log("Submitting data with bio:", bio); // Debug bio value on submit

            if (password) {
                newUserInfo.password = password;
            }

            // Upload profile photo if changed
            if (file) {
                const formData = new FormData();
                formData.append('profilePhoto', file);
                const photoRes = await updateUser(formData).unwrap();
                setLoading(50);

                if (photoRes?.secure_url) {
                    newUserInfo.profilePhoto = {
                        public_id: photoRes.public_id,
                        url: photoRes.secure_url
                    };
                }
            }

            // Update user information
            const updatedUserResponse = await updateUser({ user: newUserInfo }).unwrap();
            
            // Debug the response specifically checking bio
            console.log("API Response:", updatedUserResponse);
            
            // IMPORTANT CHANGE: Store the submitted bio regardless of API response
            const userData = updatedUserResponse.user || updatedUserResponse;
            
            // Create proper Redux update - FORCE the bio value from our form submission
            const updatedReduxData = {
                ...userInfo,
                user: {
                    ...userInfo.user,
                    ...userData,
                    bio: bio  // CRITICAL FIX: Use the form value directly instead of API response
                }
            };
            
            console.log("Updating Redux with:", updatedReduxData);
            
            // Dispatch the update to Redux
            dispatch(setCredentials(updatedReduxData));
            
            // Force bio to be set in local state
            setBio(bio || '');
            
            // Force refetch after a delay
            setTimeout(() => {
                safeRefetch();
                toast.success("Profile updated successfully!");
                navigate(`/profile/${id}`);
            }, 500);
            
            setLoading(100);
        } catch (err) {
            console.log("Update error:", err);
            toast.error(err?.data?.message || 'Failed to update user info');
            setLoading(0);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const imageUrl = URL.createObjectURL(selectedFile);
            setPreview(imageUrl);
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

    return (
        <>
            <Navbar />

            <span
                role="progressbar"
                aria-labelledby="ProgressLabel"
                aria-valuenow={loading}
                className="block rounded-full bg-slate-700 relative overflow-hidden"
                style={{ height: '3px' }}
            >
                <span className="block absolute inset-0 bg-indigo-600" style={{ width: `${loading}%`, transition: 'width 0.3s ease-in-out' }}></span>
            </span>



            <div className={` w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row ${theme ? " bg-gradient-to-b from-black to-gray-800 via-black text-white" : "bg-white"}`}>
                {/* Sidebar */}
                <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
                    <div className={`sticky flex flex-col gap-2 p-4 text-sm border-r ${theme ? "border-slate-700" : "border-zinc-100"} top-12`}>
                        <h2 className="pl-[2.8em] mb-4 text-2xl font-semibold">Settings</h2>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4 ">
                    <div className="p-2 md:p-4">
                        <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
                            <h2 className="pl-6 text-2xl font-bold sm:text-xl">Public Profile</h2>

                            <form onSubmit={handleSubmit}>
                                <div className="grid max-w-2xl mx-auto mt-8">
                                    {/* Profile Picture */}
                                    <div className="flex flex-col space-y-5 sm:flex-row sm:space-y-0">
                                        <img
                                            className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-zinc-300 dark:ring-zinc-500"
                                            src={preview ? preview : (data?.user?.profilePhoto ? `${img}${data?.user?.profilePhoto}` : avatar)} alt="Profile Avatar"
                                        />
                                        <div className="flex flex-col space-y-5 sm:ml-8">
                                            <label htmlFor="profilePicInput" className="cursor-pointer">
                                                <input
                                                    type="file"
                                                    id="profilePicInput"
                                                    className="hidden"
                                                    onChange={handleFileChange}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => document.getElementById('profilePicInput').click()}
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
                                    <div className={`items-center mt-8 sm:mt-14 ${theme ? "text-white" : "text-black"} `}>
                                        <div className="flex space-x-6">
                                            <div className="w-1/2">
                                                <label className="block mb-2 text-sm font-medium">First Name</label>
                                                <input
                                                    type="text"
                                                    value={firstname}
                                                    onChange={(e) => setFirstname(e.target.value)}
                                                    className={`border font-semibold text-sm rounded-lg block w-full p-2.5 ${theme ? "border-slate-900 bg-black text-white" : "bg-zinc-100 "}`}
                                                    placeholder="First name"
                                                    required
                                                />
                                            </div>
                                            <div className="w-1/2">
                                                <label className="block mb-2 text-sm font-medium ">Last Name</label>
                                                <input
                                                    type="text"
                                                    value={lastname}
                                                    onChange={(e) => setLastname(e.target.value)}
                                                    className={`border font-semibold  text-sm rounded-lg  block w-full p-2.5 ${theme ? "border-slate-900  bg-black text-white" : "bg-zinc-100 "}`}
                                                    placeholder="Last name"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-2 mt-2 sm:mb-6">
                                            <label className="block mb-2 text-sm font-medium">Your Username</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={username}
                                                    onChange={(e) => {
                                                        let value = e.target.value.toLowerCase();
                                                        value = value.replace(/[^a-z0-9_]/g, '');
                                                        const newUsername = value.startsWith('@') ? value : `@${value}`;
                                                        setUsername(newUsername);
                                                        
                                                        // Reset availability message if same as original
                                                        if (newUsername === originalUsername) {
                                                          setUsernameMessage('');
                                                        }
                                                      }}
                                                    className={`border font-semibold text-sm rounded-lg block w-full p-2.5 
                                                        ${theme ? "border-slate-900 bg-black text-white" : "bg-zinc-100"}
                                                        ${!isUsernameAvailable && username !== originalUsername ? "border-red-500" :
                                                          !validateUsername(username).valid ? "border-yellow-500" :
                                                          isUsernameAvailable && username !== originalUsername ? "border-green-500" : ""}`}
                                                    placeholder="@username"
                                                    required
                                                />

                                                {/* Username availability indicator */}
                                                {username !== originalUsername && (
                                                  <div className="absolute right-4 top-3">
                                                    {isCheckingUsername ? (
                                                      <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8-8-3.582-8-8zm2 0a6 6 0 1012 0 6 6 0 00-12 0z"></path>
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
                                              <p className={`mt-1 text-xs ${
                                                !validateUsername(username).valid ? 'text-yellow-500' :
                                                isUsernameAvailable ? 'text-green-500' : 'text-red-500'}`}
                                              >
                                                {!validateUsername(username).valid ? 
                                                  validateUsername(username).message : 
                                                  usernameMessage}
                                              </p>
                                            )}
                                        </div>

                                        <div className="mb-2 sm:mb-6">
                                            <label className="block mb-2 text-sm font-medium ">Your email</label>
                                            <input
                                                type="email"
                                                onChange={(e) => setEmail(e.target.value)}
                                                className={`border font-semibold  text-sm rounded-lg  block w-full p-2.5 ${theme ? "border-slate-900  bg-black text-white" : "bg-zinc-100 "}`}
                                                value={email}
                                                placeholder="Email"
                                                required
                                            />
                                        </div>

                                        <div className="mb-6">
                                            <label htmlFor="message" className="block mb-2 text-sm font-medium ">Bio</label>
                                            <textarea
                                                rows="4"
                                                value={bio || ''} 
                                                required
                                                onChange={(e) => {
                                                    const newBio = e.target.value;
                                                    console.log("Setting bio to:", newBio);
                                                    setBio(newBio);
                                                }}
                                                className={`border font-semibold text-sm rounded-lg block w-full p-2.5 ${theme ? "border-slate-900 bg-black text-white" : "bg-zinc-100 "}`}

                                                placeholder="Write your bio..."
                                            ></textarea>
                                        </div>

                                        <div className="mb-6">
                                            <label htmlFor="message" className="block mb-2 text-sm font-medium ">New Password</label>
                                            <input
                                                id="message"
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className={`border font-semibold  text-sm rounded-lg  block w-full p-2.5 ${theme ? "border-slate-900  bg-black text-white" : "bg-zinc-100 "}`}
                                                placeholder="Password"
                                            ></input>
                                        </div>

                                        <div className="flex justify-end md:justify-center">
                                            <button
                                                type="submit"
                                                className={`text-white bg-zinc-900 hover:bg-zinc-800 focus:ring-4 focus:outline-none focus:ring-zinc-300 font-medium rounded-lg text-sm w-full sm:w-auto px-10 py-2.5 text-center dark:bg-zinc-600 dark:hover:bg-zinc-700 dark:focus:ring-zinc-800`}
                                            >
                                                Save
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

}

export default EditProfile;
