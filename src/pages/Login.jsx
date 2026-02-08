import React, { useState } from 'react';
import loginanimation from "../assets/Login.json";
import Lottie from 'lottie-react';
import useAuth from '../hooks/useAuth';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { NavLink, useLocation, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";

const Login = () => {
    const { signInWithEmail, signInWithGoogle, resetPassword } = useAuth();
    const [eye, setEye] = useState(false);
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [userType, setUserType] = useState("tutor"); 
    const location = useLocation();
    const [forgotEmail, setForgotEmail] = useState(""); // Modal এর ইনপুট হ্যান্ডেল করার জন্য

    const adminEmail = "admin@etuitionbd.com";
    const adminPass = "Fg123456";

    const handleForgotPassword = (e) => {
        e.preventDefault();
        if (!forgotEmail) {
            return toast.error("Please enter your email address");
        }
        
        const toastId = toast.loading("Sending reset email...");
        resetPassword(forgotEmail)
            .then(() => {
                toast.success("Password Reset Mail Sent", { id: toastId });
                document.getElementById('forgot_password_modal').close();
                setForgotEmail("");
            })
            .catch((error) => {
                toast.error(error.message, { id: toastId });
            })
    }

    const hadnleLogin = (data) => {
        const toastId = toast.loading("Logging in...");
        
        signInWithEmail(data.email, data.password)
            .then((result) => {
                toast.success("Login Successful!", { id: toastId });
                
                if (userType === 'admin' || data.email === adminEmail) {
                    navigate("/dashboard/manage-tuitions");
                } else {
                    navigate(location?.state || "/");
                }
            })
            .catch((error) => {
                console.error(error);
                toast.error(error.message || "Login failed.", { id: toastId });
            });
    };

    const handleGoogleLogin = () => {
        const toastId = toast.loading("Connecting with Google...");
        signInWithGoogle()
            .then((result) => {
                toast.success("Google Login Successful!", { id: toastId });
                navigate(location?.state || "/");
            })
            .catch((error) => {
                toast.error(error.message || "Google Login failed.", { id: toastId });
            });
    };

    const handleToggle = (type) => {
        setUserType(type);
        reset();

        if (type === 'admin') {
            setValue("email", adminEmail);
            setValue("password", adminPass);
        }
    };

    const handleEye = () => {
        setEye(!eye);
    };

    return (
        <div className="bg-white p-8 lg:p-12 rounded-3xl shadow-xl border border-white/20 max-w-md lg:max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 mt-10">
            
            <div className="md:w-1/2 justify-center hidden lg:flex">
                <div className="w-full max-w-sm">
                    <Lottie animationData={loginanimation} loop={true} />
                </div>
            </div>

            <div className="md:w-1/2 w-full">
                
                <div className="flex bg-slate-100 p-1 rounded-xl mb-6 relative w-full shadow-inner overflow-hidden">
                    <motion.div 
                        animate={{ 
                            x: userType === 'tutor' ? 0 : userType === 'student' ? '100%' : '200%' 
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="absolute top-1 left-1 w-[calc(33.33%-4px)] h-[calc(100%-8px)] bg-primary rounded-lg shadow-md"
                    />
                    <button type="button" onClick={() => handleToggle('tutor')} className={`relative flex-1 py-2 z-10 font-bold text-[10px] uppercase transition-colors ${userType === 'tutor' ? 'text-white' : 'text-slate-500'}`}>Tutor</button>
                    <button type="button" onClick={() => handleToggle('student')} className={`relative flex-1 py-2 z-10 font-bold text-[10px] uppercase transition-colors ${userType === 'student' ? 'text-white' : 'text-slate-500'}`}>Student</button>
                    <button type="button" onClick={() => handleToggle('admin')} className={`relative flex-1 py-2 z-10 font-bold text-[10px] uppercase transition-colors ${userType === 'admin' ? 'text-white' : 'text-slate-500'}`}>Admin</button>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={userType}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <h1 className="font-bold text-2xl text-primary mb-5 uppercase italic">Login As a <span className='text-slate-800'>{userType}</span></h1>
                        
                        <form onSubmit={handleSubmit(hadnleLogin)} className="w-full">
                            <fieldset className="fieldset flex flex-col gap-4">
                                
                                {userType === 'student' && (
                                    <div className="space-y-4 mb-2">
                                        <button onClick={handleGoogleLogin} type="button" className="btn btn-outline w-full flex items-center justify-center gap-2 border-slate-200">
                                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                                            Continue with Google
                                        </button>
                                        <div className="divider text-[10px] uppercase font-bold text-slate-400">Or Email</div>
                                    </div>
                                )}

                                <div>
                                    <label className="label font-bold text-xs uppercase tracking-wide">Email</label>
                                    <input 
                                        type="email" 
                                        className={`input w-full ${errors.email ? 'border-red-500' : ''}`} 
                                        placeholder="Enter your email" 
                                        {...register("email", { required: "Email is required" })} 
                                    />
                                </div>

                                <div>
                                    <label className="label font-bold text-xs uppercase tracking-wide">Password</label>
                                    <div className="relative">
                                        <input 
                                            type={eye ? "text" : "password"} 
                                            className={`input w-full pr-10 ${errors.password ? 'border-red-500' : ''}`} 
                                            placeholder="Enter password" 
                                            {...register("password", { required: "Password is required" })} 
                                        />
                                        <button type="button" onClick={handleEye} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xl">
                                            {eye ? <IoMdEyeOff /> : <IoEye />}
                                        </button>
                                    </div>
                                    {/* Forgot Password Button */}
                                    {userType !== 'admin' && (
                                        <div className="mt-1 text-right">
                                            <button 
                                                type="button" 
                                                onClick={() => document.getElementById('forgot_password_modal').showModal()}
                                                className="text-[10px] font-bold text-primary uppercase hover:underline"
                                            >
                                                Forgot Password?
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <button type="submit" className="btn btn-primary mt-2 w-full uppercase font-black">
                                    {userType === 'admin' ? 'Enter Admin Panel' : 'Login'}
                                </button>
                            </fieldset>
                            
                        </form>

                        {userType !== 'admin' && (
                            <div className="mt-4">
                                <p>Don't have an account? <NavLink to="/register" state={location.state}><span className="text-primary font-bold text-[15px]">Register</span></NavLink></p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Forgot Password Modal */}
            <dialog id="forgot_password_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box bg-white rounded-2xl">
                    <h3 className="font-black text-xl text-primary uppercase italic">Reset Password</h3>
                    <p className="py-4 text-slate-500 text-sm">Enter your account email address and we'll send you a link to reset your password.</p>
                    
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-bold text-xs uppercase">Your Email</span>
                        </label>
                        <input 
                            type="email" 
                            placeholder="email@example.com" 
                            className="input input-bordered w-full" 
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="modal-action">
                        <form method="dialog" className="flex gap-2">
                            <button className="btn btn-ghost uppercase font-bold text-xs">Cancel</button>
                            <button 
                                onClick={handleForgotPassword}
                                className="btn btn-primary uppercase font-black text-xs"
                            >
                                Send Reset Link
                            </button>
                        </form>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

        </div>
    );
};

export default Login;