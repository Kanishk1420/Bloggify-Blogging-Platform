/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setCredentials } from '../../slices/AuthSlice';
import { toggleDarkMode } from '../../slices/Theme';
import { FaRegEye, FaEyeSlash } from "react-icons/fa";
import { MdSunny } from "react-icons/md";
import { BsMoonStarsFill } from "react-icons/bs";
import logo from '../../assets/logo.png';
import { useRegisterMutation } from '../../api/auth';
import { LoaderCircle } from 'lucide-react';



const Register = () => {
  // Existing state variables
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.theme);
  const [register, { isLoading, isError }] = useRegisterMutation();

  useEffect(() => {
    if (userInfo) {
      navigate('/')
    }
  }, [setCredentials, navigate]);

  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();
    try {
      const res = await register({ email, password, username, firstname, lastname }).unwrap();
      dispatch(setCredentials(res))
      toast.success(res?.message || 'Registered successfully')
      setLoading(false)
      navigate('/')
    } catch (err) {
      setLoading(false)
      toast.error(err?.data?.message)
      console.log(err?.data?.message || err)
    }
  }

  const handleUsernameChange = (e) => {
    let value = e.target.value.toLowerCase();
    value = value.replace(/[^a-z]/g, '');
    setUsername(value.startsWith('@') ? value : `@${value}`);
  }

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev)
  }

  const handleTheme = () => {
    dispatch(toggleDarkMode());
  };

  return <>
    <div className={`min-h-screen flex flex-col ${theme ? "bg-zinc-950 text-white" : "bg-white text-zinc-900"}`}>
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
        <div className={`rounded-lg border ${theme ? "border-slate-800 bg-zinc-950 text-white" : "border-gray-200 bg-white text-zinc-900"} shadow-md max-w-md w-full`}>
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
                    <label className="text-sm font-medium text-white" htmlFor="email">Username:</label>
                  </div>
                  <div className="flex w-full rounded-lg pt-1">
                    <div className="relative w-full">
                      <input
                        value={username} onChange={handleUsernameChange} className="block w-full border bg-black border-slate-800 text-white focus:border-cyan-500  placeholder-gray-400 focus:ring-cyan-500 p-2.5 text-sm rounded-lg"
                        type="text" name="username" placeholder='@exampleuser' required maxLength={15}
                      />
                      <span className='text-xs float-end mt-2 text-gray-400'>{username.length}/15</span>
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
                        value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full border bg-black border-slate-800 text-white focus:border-cyan-500  placeholder-gray-400 focus:ring-cyan-500 p-2.5 text-sm rounded-lg"
                        id="email" type="email" name="email" placeholder="email@example.com" required
                      />
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