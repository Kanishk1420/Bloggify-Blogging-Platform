/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { FaEyeSlash, FaRegEye } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import logo from '../../assets/logo.png';
import { LoaderCircle } from 'lucide-react';
import { useResetPasswordMutation, useSendOtpMutation } from '../../api/auth';
import { setCredentials } from '../../slices/AuthSlice';

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

    const dispatch = useDispatch();
    const navigate = useNavigate();

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
            toast.error(err?.data?.message || 'Password reset failed');
        }
    };

    return (
        <>
            <div className="min-h-screen bg-black flex flex-col">
                <div className='flex items-center justify-between px-6 md:px-[200px] py-4'>
                    <Link to='/login'>
                        <img src={logo} className='w-11 h-11 mt-1 rounded-full object-cover' alt="" />
                    </Link>
                    <h3 className='text-white'>
                        <Link to='/login'>Login</Link>
                    </h3>
                </div>

                <div className="flex-grow flex items-center justify-center py-8">
                    <div className="w-full max-w-2xl rounded-lg border border-slate-800 text-white bg-black shadow-md px-6 py-8">
                        <h1 className="text-2xl font-bold mb-6 text-center">Reset Password</h1>

                        <form >
                            {/* First row: Email and OTP */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <label className="text-sm font-medium text-white" htmlFor="email">Email:</label>
                                    </div>
                                    <div className="relative">
                                        <input
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full border bg-black text-white border-slate-800 focus:border-cyan-500 placeholder-gray-400 focus:ring-cyan-500 p-2.5 text-sm rounded-lg"
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
                                        <label className="text-sm font-medium text-white" htmlFor="otp">OTP:</label>
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
                                            className="block w-full border bg-black text-white border-slate-800 focus:border-cyan-500 placeholder-gray-400 focus:ring-cyan-500 p-2.5 text-sm rounded-lg"
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <div className="mb-2">
                                        <label className="text-sm font-medium text-white" htmlFor="newPassword">New Password:</label>
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
                                        <label className="text-sm font-medium text-white" htmlFor="confirmPassword">Confirm Password:</label>
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
                            <div className="flex flex-col items-center">
                                <button
                                    onClick={handleResetPassword}
                                    type="submit"
                                    className="w-full md:w-1/2 border transition-colors focus:ring-2 p-0.5 border-transparent bg-slate-100 text-black hover:bg-slate-300 rounded-lg"
                                >
                                    <div className="flex items-center justify-center gap-1 font-medium py-2 px-2.5 text-base">
                                        <h2>Reset Password</h2>
                                        {loading && <LoaderCircle size={16} className="animate-spin" />}
                                    </div>
                                </button>

                                <div className="mt-4 text-center text-white">
                                    <Link className="text-gray-300 hover:text-cyan-500" to="/login">
                                        Back to Login
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResetPassword;