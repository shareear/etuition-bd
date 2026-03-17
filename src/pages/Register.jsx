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

                axios.post(' https://etuition-bd-server.vercel.app/users', userInfo)
                    .then(() =>{
                        // --- JWT Generation Start ---
                        const loggedUser = { email: user?.email };
                        axios.post(' https://etuition-bd-server.vercel.app/jwt', loggedUser)
                            .then(res => {
                                if (res.data.token) {
                                    localStorage.setItem('access-token', res.data.token);
                                    toast.success("Welcome! Registration Successful.", { id: toastId });
                                    navigate(location?.state || "/");
                                }
                            });
                        // --- JWT Generation End ---
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
                                axios.post(' https://etuition-bd-server.vercel.app/users', userInfo)
                                    .then(dataResponse =>{
                                        if(dataResponse.data.insertedId){
                                            // --- JWT Generation Start ---
                                            const loggedUser = { email: data.email };
                                            axios.post(' https://etuition-bd-server.vercel.app/jwt', loggedUser)
                                                .then(resJwt => {
                                                    if (resJwt.data.token) {
                                                        localStorage.setItem('access-token', resJwt.data.token);
                                                        toast.success(`Registered as ${userType}`, { id: toastId });
                                                        navigate(location?.state || "/");
                                                    }
                                                });
                                            // --- JWT Generation End ---
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

                // toast.success(`Success! Registered as ${userType}`, { id: toastId });
                // navigate('/');
            })
            .catch((error) => {
                toast.error(error.message, { id: toastId });
                return
            })
    }

    return (
        <div className="bg-base-100 p-8 lg:p-12 rounded-3xl shadow-xl border border-base-300 max-w-md lg:max-w-5xl mx-auto flex flex-col md:flex-row items-start gap-10 mt-10 transition-colors duration-300">
            
            {/* Left Side: Animation */}
            <div className="md:w-1/2 flex justify-center sticky top-0 lg:flex">
                <div className="w-full max-w-sm">
                    <Lottie animationData={registeranimation} loop={true} />
                </div>
            </div>

            {/* Right Side: Form Content */}
            <div className="md:w-1/2 w-full">
                {/* Role Toggle */}
                <div className="flex bg-base-200 p-1 rounded-xl mb-6 relative w-64 shadow-inner border border-base-300">
                    <motion.div 
                        animate={{ x: userType === 'tutor' ? 0 : '100%' }}
                        className="absolute top-1 left-1 w-[calc(50%-4px)] h-[calc(100%-8px)] bg-primary rounded-lg shadow-md"
                    />
                    <button type="button" onClick={() => handleTypeSwitch('tutor')} className={`relative flex-1 py-2 z-10 font-bold text-xs transition-colors ${userType === 'tutor' ? 'text-white' : 'text-base-content/50'}`}>Tutor</button>
                    <button type="button" onClick={() => handleTypeSwitch('student')} className={`relative flex-1 py-2 z-10 font-bold text-xs transition-colors ${userType === 'student' ? 'text-white' : 'text-base-content/50'}`}>Student</button>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={userType}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <h1 className="font-bold text-2xl text-primary mb-5 uppercase italic">Register As a <span className="text-base-content">{userType === 'tutor' ? 'Tutor' : 'Student'}</span></h1>
                        
                        <form onSubmit={handleSubmit(hadnleRegistration)} className="w-full">
                            <fieldset className="fieldset grid grid-cols-1 md:grid-cols-2 gap-4">
                                
                                {userType === 'student' && (
                                    <div className="md:col-span-2 space-y-4 mb-2">
                                        <button 
                                            type="button"
                                            onClick={handleGoogleRegister}
                                            className="btn btn-outline w-full flex items-center justify-center gap-2 border-base-300 hover:bg-base-200 text-base-content/70 font-bold"
                                        >
                                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                                            Continue with Google
                                        </button>
                                        
                                        <div className="relative flex items-center">
                                            <div className="grow border-t border-base-300"></div>
                                            <span className="shrink mx-4 text-base-content/20 text-[10px] font-black uppercase">Or Email</span>
                                            <div className="grow border-t border-base-300"></div>
                                        </div>
                                    </div>
                                )}

                                {/* Full Name */}
                                <div className="md:col-span-2">
                                    <label className="label font-bold text-xs uppercase tracking-wide text-base-content/60">Full Name</label>
                                    <input type="text" className={`input w-full bg-base-200 border-base-300 text-base-content ${errors.name ? 'border-red-500' : ''}`} placeholder="Your Name" {...register("name", {required: "Name is required"})} />
                                    {errors.name && <p className="text-red-500 text-[10px] mt-1 font-bold italic">*{errors.name.message}</p>}
                                </div>

                                {/* Photo */}
                                <div className="md:col-span-2">
                                    <label className="label font-bold text-xs uppercase tracking-wide text-base-content/60">Your Photo</label>
                                    <input type="file" className={`file-input w-full bg-base-200 border-base-300 text-base-content ${errors.image ? 'border-red-500' : ''}`} placeholder="Your Photo" {...register("image", {required: "Photo is required"})} />
                                    {errors.image && <p className="text-red-500 text-[10px] mt-1 font-bold italic">*{errors.image.message}</p>}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="label font-bold text-xs uppercase tracking-wide text-base-content/60">Email</label>
                                    <input type="email" className={`input w-full bg-base-200 border-base-300 text-base-content ${errors.email ? 'border-red-500' : ''}`} placeholder="Email" {...register("email", {required: "Email is required"})} />
                                    {errors.email && <p className="text-red-500 text-[10px] mt-1 font-bold italic">*{errors.email.message}</p>}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="label font-bold text-xs uppercase tracking-wide text-base-content/60">Phone</label>
                                    <input type="tel" className={`input w-full bg-base-200 border-base-300 text-base-content ${errors.phone ? 'border-red-500' : ''}`} placeholder="Phone Number" {...register("phone", {required: "Phone is required"})} />
                                    {errors.phone && <p className="text-red-500 text-[10px] mt-1 font-bold italic">*{errors.phone.message}</p>}
                                </div>

                                {/* Address */}
                                <div className="md:col-span-2">
                                    <label className="label font-bold text-xs uppercase tracking-wide text-base-content/60">Address</label>
                                    <input type="text" className={`input w-full bg-base-200 border-base-300 text-base-content ${errors.address ? 'border-red-500' : ''}`} placeholder="Address" {...register("address", {required: "Address is required"})} />
                                    {errors.address && <p className="text-red-500 text-[10px] mt-1 font-bold italic">*{errors.address.message}</p>}
                                </div>

                                {userType === 'tutor' ? (
                                    <>
                                        <div>
                                            <label className="label font-bold text-xs uppercase tracking-wide text-base-content/60">Occupation</label>
                                            <select defaultValue="" className={`select select-bordered w-full bg-base-200 border-base-300 text-base-content ${errors.occupation ? 'border-red-500' : ''}`} {...register("occupation", {required: "Select occupation"})}>
                                                <option disabled value="">Pick one</option>
                                                <option value="teacher">Teacher</option>
                                                <option value="student">Student</option>
                                            </select>
                                            {errors.occupation && <p className="text-red-500 text-[10px] mt-1 font-bold italic">*{errors.occupation.message}</p>}
                                        </div>
                                        <div>
                                            <label className="label font-bold text-xs uppercase tracking-wide text-base-content/60">Institution Name</label>
                                            <input type="text" className={`input w-full bg-base-200 border-base-300 text-base-content ${errors.institution ? 'border-red-500' : ''}`} placeholder="Institution Name" {...register("institution", {required: "Institution is required"})} />
                                            {errors.institution && <p className="text-red-500 text-[10px] mt-1 font-bold italic">*{errors.institution.message}</p>}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <label className="label font-bold text-xs uppercase tracking-wide text-base-content/60">Institution Name</label>
                                            <input type="text" className={`input w-full bg-base-200 border-base-300 text-base-content ${errors.institution ? 'border-red-500' : ''}`} placeholder="Institution Name" {...register("institution", {required: "Institution is required"})} />
                                            {errors.institution && <p className="text-red-500 text-[10px] mt-1 font-bold italic">*{errors.institution.message}</p>}
                                        </div>
                                        <div>
                                            <label className="label font-bold text-xs uppercase tracking-wide text-base-content/60">Class</label>
                                            <select defaultValue="" className={`select select-bordered w-full bg-base-200 border-base-300 text-base-content ${errors.class ? 'border-red-500' : ''}`} {...register("class", {required: "Select class"})}>
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
                                    <label className="label font-bold text-xs uppercase tracking-wide text-base-content/60">Gender</label>
                                    <select defaultValue="" className={`select select-bordered w-full bg-base-200 border-base-300 text-base-content ${errors.gender ? 'border-red-500' : ''}`} {...register("gender", {required: "Select gender"})}>
                                        <option disabled value="">Pick one</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                    {errors.gender && <p className="text-red-500 text-[10px] mt-1 font-bold italic">*{errors.gender.message}</p>}
                                </div>

                                <div className="md:col-span-1 hidden md:block"></div> 

                                {/* Password Field */}
                                <div>
                                    <label className="label font-bold text-xs uppercase tracking-wide text-base-content/60">Password</label>
                                    <div className="relative">
                                        <input 
                                            type={showPass ? "text" : "password"} 
                                            className={`input w-full pr-10 bg-base-200 border-base-300 text-base-content ${errors.password ? 'border-red-500' : ''}`} 
                                            placeholder="Password" 
                                            {...register("password", {required: "Password is required", minLength: {value: 6, message: "At least 6 chars"}})} 
                                        />
                                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/30 text-lg">
                                            {showPass ? <IoMdEyeOff /> : <IoEye />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-red-500 text-[10px] mt-1 font-bold italic">*{errors.password.message}</p>}
                                </div>

                                {/* Re-Password Field */}
                                <div>
                                    <label className="label font-bold text-xs uppercase tracking-wide text-base-content/60">Confirm Password</label>
                                    <div className="relative">
                                        <input 
                                            type={showRePass ? "text" : "password"} 
                                            className={`input w-full pr-10 bg-base-200 border-base-300 text-base-content ${errors.repassword ? 'border-red-500' : ''}`} 
                                            placeholder="Confirm Password" 
                                            {...register("repassword", {
                                                required: "Confirm password is required",
                                                validate: (value) => value === watch('password') || "Passwords do not match"
                                            })} 
                                        />
                                        <button type="button" onClick={() => setShowRePass(!showRePass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/30 text-lg">
                                            {showRePass ? <IoMdEyeOff /> : <IoEye />}
                                        </button>
                                    </div>
                                    {errors.repassword && <p className="text-red-500 text-[10px] mt-1 font-bold italic">*{errors.repassword.message}</p>}
                                </div>

                                <button type="submit" className="btn btn-primary mt-6 md:col-span-2 w-full uppercase font-black">Submit & Register</button>
                            </fieldset>
                            <div className="mt-4">
                                <p className="text-base-content/60">Already have an Account? <NavLink to="/login" state={location.state}><span className="text-primary font-black text-[15px] uppercase italic">Log In</span></NavLink></p>
                            </div>
                        </form>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Register;