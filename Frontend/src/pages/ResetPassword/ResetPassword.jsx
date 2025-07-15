/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { FaEyeSlash, FaRegEye } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
// Import both logo variants
import darkLogo from '../../assets/Bloggify white.png';  
import lightLogo from '../../assets/Bloggify.png';
import { LoaderCircle } from 'lucide-react';
import { useResetPasswordMutation, useSendOtpMutation } from '../../api/auth';
import { setCredentials } from '../../slices/AuthSlice';
import { BsMoonStarsFill } from 'react-icons/bs';
import { MdSunny } from 'react-icons/md';
import { toggleDarkMode } from '../../slices/Theme';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [timer, setTimer] = useState(0);
    const [resending, setResending] = useState(false);
    const [sendOtp] = useSendOtpMutation();
    const [resetPassword] = useResetPasswordMutation();
    
    // Theme from Redux store
    const { theme } = useSelector((state) => state.theme);
    
    // Select the appropriate logo based on theme
    const currentLogo = theme ? darkLogo : lightLogo;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Add theme toggle handler
    const handleTheme = () => {
        dispatch(toggleDarkMode());
    };

    // Handle timer for OTP resend
    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleSendOtp = async (e) => {
        e?.preventDefault();
        if (!email) {
            toast.error('Please enter your email');
            return;
        }

        setResending(true);
        try {

            const res = await sendOtp({ email }).unwrap();
            toast.success(res?.success || 'OTP sent successfully');
            setOtpSent(true);
            setTimer(30); // Set timer for 30 seconds
            setResending(false);
        } catch (err) {
            setResending(false);
            toast.error('Failed to send OTP. Please try again.');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!otp) {
            toast.error('Please enter the OTP');
            return;
        }
        if (!newPassword) {
            toast.error('Please enter a new password');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        // Add password strength validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            toast.error('Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character');
            return;
        }

        setLoading(true);
        try {
            const body = {
                email: email,
                otp: otp,
                password: newPassword,
            }

            const res = await resetPassword(body).unwrap();
            toast.success(res?.success || 'Password reset successfully');
            setLoading(false);
            dispatch(setCredentials(res?.user))
            navigate('/login');
        } catch (err) {
            setLoading(false);
            
            // Check specifically for password reuse error
            if (err?.data?.message === "New password cannot be the same as your old password") {
              toast.error("Please choose a new password different from your current one");
            } else {
              toast.error(err?.data?.message || 'Password reset failed');
            }
        }
    };

    return (
        <>
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
                            {theme ? <BsMoonStarsFill className='text-white text-lg' /> : <MdSunny className='text-xl' />}
                        </button>
                        
                        <h3 className={theme ? 'text-white' : 'text-zinc-900'}>
                            <Link to='/login'>Login</Link>
                        </h3>
                    </div>
                </div>

                <div className="flex-grow pb-10 flex items-center justify-center">
                    <div className={`rounded-lg border ${theme ? "border-slate-800 bg-black/70 text-white" : "border-gray-200 bg-white text-zinc-900"} shadow-md max-w-md w-full mx-auto p-6`}>
                        <div className="flex h-full flex-col justify-center gap-4">
                            <div className="left-0 right-0 inline-block border-gray-200 px-2 py-2.5 sm:px-4">
                                <h1 className="mb-6 text-2xl font-bold text-center">Reset Password</h1>

                                <form className="flex flex-col gap-4 pb-4" onSubmit={handleResetPassword}>
                                    {/* First row: Email and OTP */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <div className="mb-2">
                                                <label className={`text-sm font-medium ${theme ? "text-white" : "text-gray-800"}`} htmlFor="email">Email:</label>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className={`block w-full border ${theme ? "bg-black text-white border-slate-800" : "bg-white text-gray-800 border-gray-300"} focus:border-cyan-500 placeholder-gray-400 focus:ring-cyan-500 p-2.5 text-sm rounded-lg`}
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    placeholder="email@example.com"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <div className="mb-2 flex items-center justify-between">
                                                <label className={`text-sm font-medium ${theme ? "text-white" : "text-gray-800"}`} htmlFor="otp">OTP:</label>
                                                <button
                                                    type="button"
                                                    onClick={handleSendOtp}
                                                    disabled={resending || timer > 0}
                                                    className={`text-xs ${timer > 0 ? 'text-gray-500' : 'text-cyan-500 hover:text-cyan-400'}`}
                                                >
                                                    {resending ? 'Sending...' : timer > 0 ? `Resend (${timer}s)` : 'Send OTP'}
                                                </button>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value)}
                                                    className={`block w-full border ${theme ? "bg-black text-white border-slate-800" : "bg-white text-gray-800 border-gray-300"} focus:border-cyan-500 placeholder-gray-400 focus:ring-cyan-500 p-2.5 text-sm rounded-lg`}
                                                    id="otp"
                                                    type="text"
                                                    name="otp"
                                                    placeholder="Enter OTP"
                                                    maxLength={6}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Second row: New Password and Confirm Password */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                        <div>
                                            <div className="mb-2">
                                                <label className="text-sm font-medium" htmlFor="newPassword">New Password:</label>
                                            </div>
                                            <div className="relative">
                                                {showNewPassword ?
                                                    <FaRegEye className='absolute right-4 top-3 cursor-pointer' onClick={() => setShowNewPassword(false)} /> :
                                                    <FaEyeSlash className='absolute right-4 top-3 cursor-pointer' onClick={() => setShowNewPassword(true)} />
                                                }
                                                <input
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    className="block w-full border bg-black text-white border-slate-800 focus:border-cyan-500 placeholder-gray-400 focus:ring-cyan-500 p-2.5 text-sm rounded-lg"
                                                    id="newPassword"
                                                    type={showNewPassword ? "text" : "password"}
                                                    name="newPassword"
                                                    placeholder="Enter new password"
                                                    maxLength={16}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <div className="mb-2">
                                                <label className="text-sm font-medium" htmlFor="confirmPassword">Confirm Password:</label>
                                            </div>
                                            <div className="relative">
                                                {showConfirmPassword ?
                                                    <FaRegEye className='absolute right-4 top-3 cursor-pointer' onClick={() => setShowConfirmPassword(false)} /> :
                                                    <FaEyeSlash className='absolute right-4 top-3 cursor-pointer' onClick={() => setShowConfirmPassword(true)} />
                                                }
                                                <input
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="block w-full border bg-black text-white border-slate-800 focus:border-cyan-500 placeholder-gray-400 focus:ring-cyan-500 p-2.5 text-sm rounded-lg"
                                                    id="confirmPassword"
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    name="confirmPassword"
                                                    placeholder="Confirm your password"
                                                    maxLength={16}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex flex-col gap-2 mt-4">
                                        <button type="submit"
                                            className="border transition-colors focus:ring-2 p-0.5 border-transparent bg-slate-100 text-black hover:bg-slate-300 rounded-lg">
                                            <div className="flex items-center justify-center gap-1 font-medium py-1 px-2.5 text-base">
                                                <h2>Reset Password</h2>
                                                <LoaderCircle size={16} className={`animate-spin ${loading ? 'block' : 'hidden'}`} />
                                            </div>
                                        </button>
                                    </div>
                                </form>
                                
                                <div className="mt-4 text-center mx-10">
                                    <span className={theme ? "text-white" : "text-gray-800"}>Remember your password?</span>
                                    <Link className="text-gray-300 underline hover:text-gray-400 px-2" to="/login">Login here</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResetPassword;