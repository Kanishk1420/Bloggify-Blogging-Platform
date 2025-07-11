/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setCredentials } from '../../slices/AuthSlice';
import { toggleDarkMode } from '../../slices/Theme';
import { FaRegEye, FaEyeSlash, FaCheck, FaTimes } from "react-icons/fa";
import { MdSunny } from "react-icons/md";
import { BsMoonStarsFill } from "react-icons/bs";
import { LoaderCircle } from 'lucide-react';
import logo from '../../assets/logo.png';
import { useRegisterMutation } from '../../api/auth';
import axios from 'axios';
import { validateEmailDomain } from "../../utils/emailValidator";

const Register = () => {
  // Existing state variables
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Add states for username validation
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [usernameMessage, setUsernameMessage] = useState('');
  
  // Add states for email validation
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.theme);
  const [register, { isLoading, isError }] = useRegisterMutation();
  
  // Username check with debounce
  useEffect(() => {
    const checkUsernameAvailability = async () => {
      // Don't check if username doesn't meet minimum requirements
      if (!username || username === '@' || username.replace('@', '').length < 3) {
        setIsUsernameAvailable(true);
        setUsernameMessage('');
        return;
      }
      
      setIsCheckingUsername(true);
      try {
        console.log("Checking username availability for:", username);
        // Encode the username properly to handle special characters like hyphens
        const encodedUsername = encodeURIComponent(username);
        const response = await axios.get(`http://localhost:5000/api/auth/check-username?username=${encodedUsername}`);
        console.log("Username check response:", response.data);
        setIsUsernameAvailable(response.data.available);
        setUsernameMessage(response.data.message);
      } catch (error) {
        console.error("Error checking username:", error);
        // Check the specific error
        if (error.response) {
          // The server responded with a status code outside the 2xx range
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
        } else if (error.request) {
          // The request was made but no response was received
          console.error("No response received:", error.request);
        } else {
          // Something happened in setting up the request
          console.error("Error message:", error.message);
        }
        setIsUsernameAvailable(false);
        setUsernameMessage("Error checking username availability");
      } finally {
        setIsCheckingUsername(false);
      }
    };
    
    // Debounce the username check
    const timer = setTimeout(() => {
      if (username) checkUsernameAvailability();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [username]);

  useEffect(() => {
    if (userInfo) {
      navigate('/')
    }
  }, [setCredentials, navigate]);

  // Add the validateUsername function
  const validateUsername = (username) => {
    // Check if username is empty or just "@"
    if (!username || username === '@') {
      return { valid: false, message: "Username is required" };
    }
    
    // Remove @ from length calculation
    const nameWithoutAt = username.replace('@', '');
    if (nameWithoutAt.length < 3) {
      return { valid: false, message: "Username must be at least 3 characters (not including @)" };
    }
    
    // Check only allowed characters
    const validCharsRegex = /^@[a-z0-9_-]+$/;
    if (!validCharsRegex.test(username)) {
      return { valid: false, message: "Username can only contain lowercase letters, numbers, underscores and hyphens" };
    }
    
    return { valid: true, message: "" };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email before proceeding
    if (!isEmailValid) {
      toast.error(emailErrorMessage || "Please use a valid email address");
      return;
    }

    // Username validation
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
      toast.error(usernameValidation.message);
      return;
    }
    
    // Prevent submission if username is not available
    if (!isUsernameAvailable) {
      toast.error('Username is already taken');
      return;
    }
    
    setLoading(true);
    try {
      const res = await register({ email, password, username, firstname, lastname }).unwrap();
      dispatch(setCredentials(res));
      toast.success(res?.message || 'Registered successfully');
      setLoading(false);
      navigate('/');
    } catch (err) {
      setLoading(false);
      toast.error(err?.data?.message);
      console.log(err?.data?.message || err);
    }
  }

  const handleUsernameChange = (e) => {
    let value = e.target.value.toLowerCase();
    
    // Remove any characters that aren't allowed
    value = value.replace(/[^@a-z0-9_-]/g, '');
    
    // Always ensure @ is at the beginning
    if (value.length > 0) {
      if (value.startsWith('@')) {
        // Keep only one @ at the beginning
        value = '@' + value.substring(1).replace(/@/g, '');
      } else {
        // Add @ if missing
        value = '@' + value.replace(/@/g, '');
      }
    }
    
    setUsername(value);
    
    // Only show validation messages when the user has typed something meaningful
    if (value.length > 1) {
      const validation = validateUsername(value);
      if (!validation.valid) {
        // Don't set isUsernameAvailable here - that's for API checks
        setUsernameMessage(validation.message);
      } else {
        // Clear validation message if it's valid format
        setUsernameMessage('');
      }
    } else {
      // Clear validation message for very short inputs
      setUsernameMessage('');
    }
  }

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    const validation = validateEmailDomain(newEmail);
    setIsEmailValid(validation.valid);
    setEmailErrorMessage(validation.message);
  };

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev)
  }

  const handleTheme = () => {
    dispatch(toggleDarkMode());
  };

  console.log({
    inputUsername: username,
    validationResult: validateUsername(username),
    length: username.length,
    lengthWithoutAt: username.replace('@', '').length
  });

  return <>
    <div className={`min-h-screen flex flex-col ${theme ? "bg-gradient-to-b from-black to-gray-900 via-black text-white" : "bg-white text-zinc-900"}`}>
      <div className='flex items-center justify-between px-6 md:px-[200px] py-4'>
        <Link to='/'>
          <img src={logo} className='w-11 h-11 mt-1 rounded-full object-cover' alt="Logo" />
        </Link>
        
        <div className="flex items-center space-x-4">
          {/* Theme Toggle Button */}
          <button 
            onClick={handleTheme} 
            className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-opacity-80"
          >
            {theme ? <BsMoonStarsFill className='text-white text-lg' /> : <MdSunny className='text-xl' />}
          </button>
          
          <h3 className={theme ? 'text-white' : 'text-zinc-900'}>
            <Link to='/login'>Login</Link>
          </h3>
        </div>
      </div>
      
      <div className="flex-grow pb-10 flex items-center justify-center">
        <div className={`rounded-lg border ${theme ? "border-slate-800 bg-black/70 text-white" : "border-gray-200 bg-white text-zinc-900"} shadow-md max-w-md w-full`}>
          <div className="flex h-full flex-col justify-center gap-4 p-6">
            <div className="left-0 right-0 inline-block border-gray-200 px-2 py-2.5 sm:px-4">
              <form className="flex flex-col gap-4 pb-4" onSubmit={handleSubmit}>
                <h1 className="mb-4 text-2xl font-bold ">Register</h1>


                <div className="flex w-full">
                  {/* Left Div */}
                  <div className="w-1/2 pr-2">
                    <div className="mb-2">
                      <label className="text-sm font-medium text-white" htmlFor="firstname">Firstname:</label>
                    </div>
                    <div className="relative">
                      <input
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                        className="block w-full border bg-black border-slate-800 text-white focus:border-cyan-500 placeholder-gray-400 focus:ring-cyan-500 p-2.5 text-sm rounded-lg"
                        type="text"
                        name="firstname"
                        placeholder="Firstname"
                        maxLength={10}
                        required
                      />
                    </div>
                    <span className='text-xs float-end mt-2 text-gray-400'>{firstname.length}/10</span>
                  </div>

                  {/* Right Div */}
                  <div className="w-1/2 pl-2">
                    <div className="mb-2">
                      <label className="text-sm font-medium text-white" htmlFor="lastname">Lastname:</label>
                    </div>
                    <div className="relative">
                      <input
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                        className="block w-full border bg-black border-slate-800 text-white focus:border-cyan-500 placeholder-gray-400 focus:ring-cyan-500 p-2.5 text-sm rounded-lg"
                        type="text"
                        name="lastname"
                        placeholder="Lastname"
                        maxLength={10}
                        required
                      />
                      <span className='text-xs float-end mt-2 text-gray-400'>{lastname.length}/10</span>
                    </div>
                  </div>
                </div>



                <div>
                  <div className="mb-2">
                    <label className="text-sm font-medium text-white" htmlFor="username">Username:</label>
                  </div>
                  <div className="flex w-full rounded-lg pt-1">
                    <div className="relative w-full">
                      <input
                        value={username} 
                        onChange={handleUsernameChange} 
                        className={`block w-full border ${theme ? "bg-black border-slate-800 text-white" : "bg-white border-gray-300 text-gray-900"} focus:border-cyan-500 placeholder-gray-400 focus:ring-cyan-500 p-2.5 text-sm rounded-lg ${!isUsernameAvailable && username.length > 2 ? "border-red-500" : isUsernameAvailable && username.length > 2 ? "border-green-500" : ""}`}
                        type="text" 
                        name="username" 
                        placeholder='@exampleuser' 
                        required 
                        maxLength={15}
                      />
                      
                      {/* Username availability indicator */}
                      {username && (
                        <div className="absolute right-4 top-3">
                          {isCheckingUsername ? (
                            <LoaderCircle size={16} className="animate-spin" />
                          ) : !validateUsername(username).valid && username.length > 1 ? (
                            // Only show warning for invalid format when there's meaningful input
                            <FaTimes className="text-yellow-500" />
                          ) : isUsernameAvailable ? (
                            // Show green check for valid and available 
                            <FaCheck className="text-green-500" />
                          ) : (
                            // Show red X for taken
                            <FaTimes className="text-red-500" />
                          )}
                        </div>
                      )}
                      
                      <div className="flex justify-between mt-1">
                        <span className='text-xs text-gray-400'>{username.length}/15</span>
                        {usernameMessage && (
                          <span className={`text-xs ${isUsernameAvailable ? 'text-green-500' : 'text-red-500'}`}>
                            {usernameMessage}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-2">
                    <label className="text-sm font-medium text-white" htmlFor="email">Email:</label>
                  </div>
                  <div className="flex w-full rounded-lg pt-1">
                    <div className="relative w-full">
                      <input
                        value={email} onChange={handleEmailChange} className={`block w-full border ${theme ? "bg-black border-slate-800 text-white" : "bg-white border-gray-300 text-gray-900"} focus:border-cyan-500  placeholder-gray-400 focus:ring-cyan-500 p-2.5 text-sm rounded-lg ${!isEmailValid ? "border-red-500" : ""}`}
                        id="email" type="email" name="email" placeholder="email@example.com" required
                      />
                      {!isEmailValid && (
                        <p className="mt-1 text-xs text-red-500">
                          {emailErrorMessage}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div>

                  <div className="mb-2">
                    <label className="text-sm font-medium text-white" htmlFor="password">Password</label>
                  </div>
                  <div className="flex w-full rounded-lg pt-1">
                    <div className="relative w-full">
                      {showPassword ? <FaRegEye onClick={handleShowPassword} className='absolute right-4 top-3 cursor-pointer' /> : <FaEyeSlash className='absolute right-4 top-3 cursor-pointer' onClick={handleShowPassword} />}
                      <input
                        value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full border bg-black border-slate-800 text-white focus:border-cyan-500  placeholder-gray-400 focus:ring-cyan-500 p-2.5 text-sm rounded-lg"
                        id="password" type={showPassword ? "text" : "password"}
                        name="password" required maxLength={16}

                      />

                    </div>
                  </div>
                  {/* <p className="mt-2 cursor-pointer text-blue-500 hover:text-blue-600">Forgot password?</p> */}
                </div>
                <div className="flex flex-col gap-2">
                  <button type="submit"
                    className="border transition-colors focus:ring-2 p-0.5 border-transparent bg-slate-100 text-black hover:bg-slate-300  rounded-lg">
                    <div className="flex items-center justify-center gap-1 font-medium py-1 px-2.5 text-base">
                      <h2>Register</h2>
                      <LoaderCircle size={16} className={`animate-spin ${loading ? 'block' : 'hidden'}`} />
                    </div>
                  </button>
                  {/* <button type="button"
                    className="transition-colors focus:ring-2 p-0.5 bg-white hover:bg-gray-100 text-gray-900 border border-gray-200 rounded-lg">
                    <span className="flex items-center justify-center gap-1 font-medium py-1 px-2.5 text-base">
                      <span className='px-2'> <FaGoogle /></span>
                      Sign in with Google
                    </span>
                  </button> */}

                </div>
              </form>
              <div className="mt-4 text-center text-white mx-10">Have an account?
                <Link className="text-gray-300 underline hover:text-gray-400 px-2" to="/login">Login here</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
};


export default Register;