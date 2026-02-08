import React from 'react';
import Lottie from "lottie-react";
// Import your specific animation file here
import educationAnimation from "../../assets/teach.json"; 
import {NavLink} from "react-router";

const Banner = () => {
    return (
        <div className="relative w-full h-177 overflow-hidden">
            {/* Background Image Container */}
            <div className="absolute inset-0 bg-[url('/src/assets/background_banner.jpg')] bg-cover bg-center bg-no-repeat">
                
                {/* Overlay with Content */}
                <div className="w-full h-full bg-black/50 flex items-center justify-center">
                   <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between px-10 gap-10 -space-y-23">
                     
                     {/* Left Side: Text Content */}
                     <div className="text-white space-y-3 md:w-1/2 md:mt-10">
                        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                            Empower your <span className="text-orange-500">learning</span> Journey
                        </h1>
                        <p className="text-lg opacity-90">
                            Connect Students & Tutors, Anytime and Anywhere. The most trusted platform for education in Bangladesh.
                        </p>
                        <NavLink to="/tuitions">
                            <button className="btn bg-orange-600 hover:bg-orange-700 border-none text-white mr-5">
                            Find a Tutor
                        </button>
                        </NavLink>

                        <NavLink to="/register">
                            <button className="btn bg-orange-600 hover:bg-orange-700 border-none text-white">
                            Join As
                        </button>
                        </NavLink>
                    </div>

                    {/* Right Side: Lottie Animation */}
                    <div className="md:w-1/2 flex justify-center md:mt-20">
                        <div className="w-full max-w-100">
                            <Lottie 
                                animationData={educationAnimation} 
                                loop={true} 
                            />
                        </div>
                    </div>

                   </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;