/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { FaEyeSlash, FaRegEye } from "react-icons/fa";
import { MdSunny } from "react-icons/md";
import { BsMoonStarsFill } from "react-icons/bs";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../../slices/AuthSlice';
import { toggleDarkMode } from '../../slices/Theme';
import { toast } from 'react-toastify';
// Import both logo variants
import darkLogo from '../../assets/Bloggify white.png';  
import lightLogo from '../../assets/Bloggify.png';
import { useLoginMutation } from '../../api/auth';
import { LoaderCircle } from 'lucide-react';
import PageTransition from '../../components/PageTransition/PageTransition';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [login] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.theme);
  
  // Select the appropriate logo based on theme
  const currentLogo = theme ? darkLogo : lightLogo;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      navigate('/')
    }
  }, [navigate, setCredentials])

  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      console.log("Login response:", res);
      
      // Access the firstname and lastname from the user object
      let welcomeName = '';
      if (res?.user?.firstname && res?.user?.lastname) {
        welcomeName = `${res.user.firstname} ${res.user.lastname}`;
      } else if (res?.user?.username) {
        welcomeName = res.user.username;
      }
      
      toast.success(`Welcome back, ${welcomeName}!`);
      dispatch(setCredentials(res))
      setLoading(false)
      
      // Redirect to the path stored in sessionStorage or default to '/home'
      const redirectPath = sessionStorage.getItem("redirectAfterLogin") || "/home";
      sessionStorage.removeItem("redirectAfterLogin"); // Clear it after use
      navigate(redirectPath);
    } catch (err) {
      setLoading(false)
      toast.error(err?.data?.message)
      console.log(err?.data?.message || err)
    }
  }

  const handleShow = () => {
    setShowPassword((prev) => !prev)
  }

  const handleTheme = () => {
    dispatch(toggleDarkMode());
  };

  return (
    <PageTransition type="fadeInUp">
      <div className={`min-h-screen flex flex-col ${theme ? "bg-gradient-to-b from-black to-gray-900 via-black text-white" : "bg-white text-zinc-900"}`}>
        <div className='flex items-center justify-between px-6 md:px-[200px] py-4'>
          <Link to='/'>
            <img 
              src={currentLogo} 
              className='h-10 w-auto object-contain' 
              alt="Bloggify Logo" 
            />
          </Link>
          
          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button 
              onClick={handleTheme} 
              className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-opacity-80"
            >
              {theme ? <BsMoonStarsFill className='text-white text-lg' /> : <MdSunny className='text-[#1576D8] text-xl' />}
            </button>
            
            <h3 className={theme ? 'text-white' : 'text-[#1576D8]'}>
              <Link to='/register'>Register</Link>
            </h3>
          </div>
        </div>
        
        <div className="flex-grow pb-10 flex items-center justify-center">
          <div className={`rounded-lg border ${theme ? "border-slate-800 bg-black/70 text-white" : "border-gray-200 bg-white text-zinc-900"} shadow-md max-w-md w-full`}>
            <div className="flex h-full flex-col justify-center gap-4 p-6">
              <div className="left-0 right-0 inline-block border-gray-200 px-2 py-2.5 sm:px-4">
                <form className="flex flex-col gap-4 pb-4" onSubmit={handleSubmit}>
                  <h1 className="mb-4 text-2xl font-bold">Login</h1>

                  <div>
                    <div className="mb-2">
                      <label className={`text-sm font-medium ${theme ? "text-white" : "text-gray-700"}`} htmlFor="email">Email:</label>
                    </div>
                    <div className="flex w-full rounded-lg pt-1">
                      <div className="relative w-full">
                        <input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={`block w-full border ${
                            theme 
                              ? "bg-black border-slate-800 text-white" 
                              : "bg-white border-gray-300 text-gray-900"
                          } focus:border-cyan-500 placeholder-gray-400 focus:ring-cyan-500 p-2.5 text-sm rounded-lg`}
                          id="email" 
                          type="email" 
                          name="email" 
                          placeholder="email@example.com" 
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-2">
                      <label className={`text-sm font-medium ${theme ? "text-white" : "text-gray-700"}`} htmlFor="password">Password</label>
                    </div>
                    <div className="flex w-full rounded-lg pt-1">
                      <div className="relative w-full">
                        {showPassword ?
                          <FaRegEye onClick={handleShow} className='absolute right-4 top-3 cursor-pointer' /> :
                          <FaEyeSlash className='absolute right-4 top-3 cursor-pointer' onClick={handleShow} />
                        }
                        <input
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                          className={`block w-full border ${
                            theme 
                              ? "bg-black border-slate-800 text-white" 
                              : "bg-white border-gray-300 text-gray-900"
                          } focus:border-cyan-500 placeholder-gray-400 focus:ring-cyan-500 p-2.5 text-sm rounded-lg`}
                          id="password" 
                          type={showPassword ? "text" : "password"}
                          name="password" 
                          required
                        />
                      </div>
                    </div>
                    <Link to="/reset-password" className="mt-2 block cursor-pointer text-blue-500 hover:text-blue-600">Forgot password?</Link>
                  </div>

                  <div className="flex flex-col gap-2">
                    {/* Primary Login Button - Updated styling */}
                    <button 
                      type="submit"
                      className={`w-full rounded-full py-3 px-6 font-medium text-base ${
                        theme
                          ? "bg-slate-100 text-black hover:bg-slate-200"
                          : "bg-[#1576D8] text-white hover:bg-[#1465C0]"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {loading ? (
                          <LoaderCircle size={20} className="animate-spin" />
                        ) : (
                          "Sign In"
                        )}
                      </div>
                    </button>
                  </div>
                </form>

                {/* OR divider */}
                <div className="flex items-center my-4">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className={`px-4 text-sm ${theme ? "text-gray-400" : "text-gray-500"}`}>OR</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* Secondary Register Button */}
                <Link 
                  to="/register" 
                  className={`block w-full text-center rounded-full py-3 px-6 font-medium text-base border ${
                    theme
                      ? "border-slate-300 text-white hover:bg-slate-800"
                      : "border-[#1576D8] text-[#1576D8] hover:bg-gray-50"
                  }`}
                >
                  Create an account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Login;