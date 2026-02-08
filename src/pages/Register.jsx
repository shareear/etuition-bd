import React, { useState } from 'react';
import registeranimation from '../assets/register.json';
import Lottie from 'lottie-react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion'; 
import useAuth from '../hooks/useAuth';
import toast from "react-hot-toast";
import { NavLink, useLocation, useNavigate } from 'react-router';
import { IoEye } from "react-icons/io5";
import axios from 'axios';
import { IoMdEyeOff } from "react-icons/io";

const Register = () => {
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
    const { signInWithGoogle, createUserWithEmail, updateUserProfile } = useAuth();
    const [userType, setUserType] = useState('tutor');
    const [showPass, setShowPass] = useState(false);
    const [showRePass, setShowRePass] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleTypeSwitch = (type) => {
        setUserType(type);
        reset(); 
    };

    const handleGoogleRegister = () => {
        const toastId = toast.loading("Connecting with Google...");
        signInWithGoogle()
            .then((result) => {
                console.log(result.user)
                const user = result.user;
                const userInfo = {
                    name: user?.displayName,
                    email: user?.email,
                    image: user?.photoURL,
                    role: userType
                }

                axios.post('http://localhost:3000/users', userInfo)
                    .then(() =>{
                        toast.success("Welcome! Registration Successful.", { id: toastId });
                        navigate(location?.state || "/");
                    })
                    .catch(err =>{
                        console.log(err.message);
                        toast.error(err.message)
                        return
                    });
                
                // navigate(location?.state || "/");
            })
            .catch((error) => {
                toast.error(error.message, { id: toastId });
                return
            });
    };
    
    const hadnleRegistration = (data) => {
        const profileImg = data.image[0];
        const toastId = toast.loading("Creating your account...");
        createUserWithEmail(data.email, data.password)
            .then((result) => {
                console.log(result.user);
                const formData = new FormData();
                formData.append('image', profileImg);
                const imageAPIURL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_BB}`
                axios.post(imageAPIURL, formData)
                    .then((res)=>{
                        console.log("After Image Upload", res.data.data.url);
                        const userProfile = {
                            displayName: data.name, photoURL: res.data.data.url
                        }
                        updateUserProfile(userProfile)
                            .then(()=>{
                                const userInfo ={
                                    name: data.name,
                                    email: data.email,
                                    image: res.data.data.url,
                                    role: userType,
                                    phone: data.phone,
                                    address: data.address,
                                    gender: data.gender,
                                    institution: data.institution,

                                    ...(userType === 'tutor' ? {occupation: data.occupation} : {class: data.class}),
                                    createdAt: new Date().toISOString()
                                };
                                axios.post('http://localhost:3000/users', userInfo)
                                    .then(data =>{
                                        if(data.data.insertedId){
                                            toast.success(`Registered as ${userType}`)
                                            navigate(location?.state || "/")
                                        }
                                    })
                                    .catch(err=>{
                                        toast.error(err.message);
                                        return;
                                    })
                                // toast.success("User profile created and updated")
                            })
                            .catch(error=>{
                                toast.error(error.message);
                                return;
                            })
                    })
                    .catch(error =>{
                        toast.error(error.message);
                        return
                    })

                toast.success(`Success! Registered as ${userType}`, { id: toastId });
                // navigate('/');
            })
            .catch((error) => {
                toast.error(error.message, { id: toastId });
                return
            })
    }

    return (
        <div className="bg-white p-8 lg:p-12 rounded-3xl shadow-xl border border-white/20 max-w-md lg:max-w-5xl mx-auto flex flex-col md:flex-row items-start gap-10">
            
            {/* Left Side: Animation */}
            <div className="md:w-1/2 flex justify-center sticky top-0 lg:flex">
                <div className="w-full max-w-sm">
                    <Lottie animationData={registeranimation} loop={true} />
                </div>
            </div>

            {/* Right Side: Form Content */}
            <div className="md:w-1/2 w-full">
                {/* Role Toggle */}
                <div className="flex bg-slate-100 p-1 rounded-xl mb-6 relative w-64 shadow-inner">
                    <motion.div 
                        animate={{ x: userType === 'tutor' ? 0 : '100%' }}
                        className="absolute top-1 left-1 w-[calc(50%-4px)] h-[calc(100%-8px)] bg-primary rounded-lg shadow-md"
                    />
                    <button type="button" onClick={() => handleTypeSwitch('tutor')} className={`relative flex-1 py-2 z-10 font-bold text-xs transition-colors ${userType === 'tutor' ? 'text-white' : 'text-slate-500'}`}>Tutor</button>
                    <button type="button" onClick={() => handleTypeSwitch('student')} className={`relative flex-1 py-2 z-10 font-bold text-xs transition-colors ${userType === 'student' ? 'text-white' : 'text-slate-500'}`}>Student</button>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={userType}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <h1 className="font-bold text-2xl text-primary mb-5">Register As a {userType === 'tutor' ? 'Tutor' : 'Student'}</h1>
                        
                        <form onSubmit={handleSubmit(hadnleRegistration)} className="w-full">
                            <fieldset className="fieldset grid grid-cols-1 md:grid-cols-2 gap-4">
                                
                                {userType === 'student' && (
                                    <div className="md:col-span-2 space-y-4 mb-2">
                                        <button 
                                            type="button"
                                            onClick={handleGoogleRegister}
                                            className="btn btn-outline w-full flex items-center justify-center gap-2 border-slate-200 hover:bg-slate-50 text-slate-600 font-bold"
                                        >
                                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                                            Continue with Google
                                        </button>
                                        
                                        <div className="relative flex items-center">
                                            <div className="grow border-t border-slate-200"></div>
                                            <span className="shrink mx-4 text-slate-400 text-[10px] font-bold uppercase">Or Email</span>
                                            <div className="grow border-t border-slate-200"></div>
                                        </div>
                                    </div>
                                )}

                                {/* Full Name */}
                                <div className="md:col-span-2">
                                    <label className="label font-bold text-xs uppercase tracking-wide">Full Name</label>
                                    <input type="text" className={`input w-full ${errors.name ? 'border-red-500' : ''}`} placeholder="Your Name" {...register("name", {required: "Name is required"})} />
                                    {errors.name && <p className="text-red-500 text-[10px] mt-1 font-bold italic">*{errors.name.message}</p>}
                                </div>

                                {/* Photo */}
                                <div className="md:col-span-2">
                                    <label className="label font-bold text-xs uppercase tracking-wide">Your Photo</label>
                                    <input type="file" className={`file-input w-full ${errors.image ? 'border-red-500' : ''}`} placeholder="Your Photo" {...register("image", {required: "Photo is required"})} />
                                    {errors.image && <p className="text-red-500 text-[10px] mt-1 font-bold italic">*{errors.image.message}</p>}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="label font-bold text-xs uppercase tracking-wide">Email</label>
                                    <input type="email" className={`input w-full ${errors.email ? 'border-red-500' : ''}`} placeholder="Email" {...register("email", {required: "Email is required"})} />
                                    {errors.email && <p className="text-red-500 text-[10px] mt-1 font-bold italic">*{errors.email.message}</p>}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="label font-bold text-xs uppercase tracking-wide">Phone</label>
                                    <input type="tel" className={`input w-full ${errors.phone ? 'border-red-500' : ''}`} placeholder="Phone Number" {...register("phone", {required: "Phone is required"})} />
                                    {errors.phone && <p className="text-red-500 text-[10px] mt-1 font-bold italic">*{errors.phone.message}</p>}
                                </div>

                                {/* Address */}
                                <div className="md:col-span-2">
                                    <label className="label font-bold text-xs uppercase tracking-wide">Address</label>
                                    <input type="text" className={`input w-full ${errors.address ? 'border-red-500' : ''}`} placeholder="Address" {...register("address", {required: "Address is required"})} />
                                    {errors.address && <p className="text-red-500 text-[10px] mt-1 font-bold italic">*{errors.address.message}</p>}
                                </div>

                                {userType === 'tutor' ? (
                                    <>
                                        <div>
                                            <label className="label font-bold text-xs uppercase tracking-wide">Occupation</label>
                                            <select defaultValue="" className={`select select-bordered w-full ${errors.occupation ? 'border-red-500' : ''}`} {...register("occupation", {required: "Select occupation"})}>
                                                <option disabled value="">Pick one</option>
                                                <option value="teacher">Teacher</option>
                                                <option value="student">Student</option>
                                            </select>
                                            {errors.occupation && <p className="text-red-500 text-[10px] mt-1 font-bold italic">*{errors.occupation.message}</p>}
                                        </div>
                                        <div>
                                            <label className="label font-bold text-xs uppercase tracking-wide">Institution Name</label>
                                            <input type="text" className={`input w-full ${errors.institution ? 'border-red-500' : ''}`} placeholder="Institution Name" {...register("institution", {required: "Institution is required"})} />
                                            {errors.institution && <p className="text-red-500 text-[10px] mt-1 font-bold italic">*{errors.institution.message}</p>}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <label className="label font-bold text-xs uppercase tracking-wide">Institution Name</label>
                                            <input type="text" className={`input w-full ${errors.institution ? 'border-red-500' : ''}`} placeholder="Institution Name" {...register("institution", {required: "Institution is required"})} />
                                            {errors.institution && <p className="text-red-500 text-[10px] mt-1 font-bold italic">*{errors.institution.message}</p>}
                                        </div>
                                        <div>
                                            <label className="label font-bold text-xs uppercase tracking-wide">Class</label>
                                            <select defaultValue="" className={`select select-bordered w-full ${errors.class ? 'border-red-500' : ''}`} {...register("class", {required: "Select class"})}>
                                                <option disabled value="">Pick one</option>
                                                <option value="9">Class 9</option>
                                                <option value="10">Class 10</option>
                                                <option value="11">H.S.C</option>
                                            </select>
                                            {errors.class && <p className="text-red-500 text-[10px] mt-1 font-bold italic">*{errors.class.message}</p>}
                                        </div>
                                    </>
                                )}

                                <div>
                                    <label className="label font-bold text-xs uppercase tracking-wide">Gender</label>
                                    <select defaultValue="" className={`select select-bordered w-full ${errors.gender ? 'border-red-500' : ''}`} {...register("gender", {required: "Select gender"})}>
                                        <option disabled value="">Pick one</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                    {errors.gender && <p className="text-red-500 text-[10px] mt-1 font-bold italic">*{errors.gender.message}</p>}
                                </div>

                                <div className="md:col-span-1 hidden md:block"></div> 

                                {/* Password Field */}
                                <div>
                                    <label className="label font-bold text-xs uppercase tracking-wide">Password</label>
                                    <div className="relative">
                                        <input 
                                            type={showPass ? "text" : "password"} 
                                            className={`input w-full pr-10 ${errors.password ? 'border-red-500' : ''}`} 
                                            placeholder="Password" 
                                            {...register("password", {required: "Password is required", minLength: {value: 6, message: "At least 6 chars"}})} 
                                        />
                                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                                            {showPass ? <IoMdEyeOff /> : <IoEye />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-red-500 text-[10px] mt-1 font-bold italic">*{errors.password.message}</p>}
                                </div>

                                {/* Re-Password Field */}
                                <div>
                                    <label className="label font-bold text-xs uppercase tracking-wide">Confirm Password</label>
                                    <div className="relative">
                                        <input 
                                            type={showRePass ? "text" : "password"} 
                                            className={`input w-full pr-10 ${errors.repassword ? 'border-red-500' : ''}`} 
                                            placeholder="Confirm Password" 
                                            {...register("repassword", {
                                                required: "Confirm password is required",
                                                validate: (value) => value === watch('password') || "Passwords do not match"
                                            })} 
                                        />
                                        <button type="button" onClick={() => setShowRePass(!showRePass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                                            {showRePass ? <IoMdEyeOff /> : <IoEye />}
                                        </button>
                                    </div>
                                    {errors.repassword && <p className="text-red-500 text-[10px] mt-1 font-bold italic">*{errors.repassword.message}</p>}
                                </div>

                                <button type="submit" className="btn btn-primary mt-6 md:col-span-2 w-full uppercase font-black">Submit & Register</button>
                            </fieldset>
                            <div>
                                <p>Don't have and Account Please <NavLink to="/login" state={location.state}><span className="text-primary font-bold text-[15px]">Log In</span></NavLink></p>
                            </div>
                        </form>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Register;