import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaStar, FaCheckCircle, FaBook, FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';

const TutorsDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [tutor, setTutor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // সিঙ্গেল ইউজার/টিউটর ডাটা ফেচ করা
        axios.get(`http://localhost:3000/users`)
            .then(res => {
                const found = res.data.find(u => u._id === id);
                setTutor(found);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

const handleHireRequest = async () => {
    if (!user) {
        toast.error("Please login to hire a tutor!");
        return navigate("/login", { state: `/tutor-details/${id}` });
    }

    if (user?.email === tutor?.email) {
        return toast.error("You cannot hire yourself!");
    }

    const applicationData = {
        tutorId: tutor._id,
        tutorName: tutor.name,
        tutorEmail: tutor.email,
        studentName: user.displayName,
        studentEmail: user.email,
        studentPhoto: user.photoURL,
        salary: tutor.expectedSalary || "Negotiable",
        status: "Pending",
        appliedDate: new Date().toISOString()
    };

    const toastId = toast.loading("Sending application..."); // ইউজারকে ওয়েট করতে বলা

    try {
        const res = await axios.post('http://localhost:3000/applications', applicationData);
        
        if (res.data.insertedId) {
            toast.success(`Application sent to ${tutor.name}!`, { id: toastId });
        } 
    } catch (error) {
        // যদি ব্যাক-এন্ড থেকে 400 এরর (Already Applied) আসে
        const message = error.response?.data?.message || "Failed to send application";
        toast.error(message, { id: toastId });
        console.error("Apply Error:", error);
    }
};

    if (loading) return <div className="min-h-screen flex justify-center items-center"><span className="loading loading-spinner loading-lg text-orange-600"></span></div>;

    if (!tutor) return <div className="min-h-screen flex justify-center items-center font-bold uppercase italic">Tutor Not Found!</div>;

    return (
        <div className="bg-slate-50 min-h-screen pt-28 pb-20 px-4">
            <div className="max-w-6xl mx-auto">
                
                {/* Header Section: Profile Cover & Identity */}
                <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-slate-100 mb-10">
                    <div className="h-48 bg-linear-to-r from-slate-900 to-orange-600"></div>
                    <div className="px-10 pb-10 flex flex-col md:flex-row items-end gap-8 -mt-20">
                        <div className="relative">
                            <img 
                                src={tutor.photoURL || "https://i.ibb.co/rt969V5/avatar.jpg"} 
                                alt={tutor.name} 
                                className="w-44 h-44 rounded-[2.5rem] object-cover border-8 border-white shadow-2xl"
                            />
                            <div className="absolute bottom-4 right-0 bg-blue-500 text-white p-2 rounded-xl shadow-lg border-4 border-white">
                                <FaCheckCircle />
                            </div>
                        </div>
                        <div className="flex-1 mb-4">
                            <h1 className="text-4xl font-black text-slate-900 uppercase italic flex items-center gap-3">
                                {tutor.name} <span className="bg-orange-100 text-orange-600 text-[10px] px-3 py-1 rounded-full not-italic">Featured</span>
                            </h1>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2 mt-2">
                                <FaGraduationCap className="text-orange-600" /> {tutor.institution || "Professional Educator"}
                            </p>
                        </div>
                        <button 
                            onClick={handleHireRequest}
                            className="btn btn-primary h-16 px-10 rounded-2xl uppercase font-black italic shadow-xl shadow-orange-200 mb-4 w-full md:w-auto"
                        >
                            Hire {tutor.name.split(' ')[0]} Now
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    {/* Left Side: Stats & Details */}
                    <div className="lg:col-span-2 space-y-10">
                        
                        {/* About/Bio Section */}
                        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100">
                            <h3 className="text-xl font-black uppercase italic mb-6 border-l-4 border-orange-600 pl-4">Professional Bio</h3>
                            <p className="text-slate-500 leading-relaxed font-medium">
                                {tutor.bio || `${tutor.name} is a dedicated educator specializing in ${tutor.subject || 'various subjects'}. With a focus on concept-based learning, they help students achieve academic excellence through personalized guidance and modern teaching methods.`}
                            </p>
                        </div>

                        {/* Qualifications Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-900 text-white rounded-[2.5rem] p-8">
                                <FaBook className="text-orange-500 text-3xl mb-4" />
                                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Teaching Expertise</h4>
                                <p className="text-lg font-bold italic">{tutor.subject || "All Science Subjects"}</p>
                            </div>
                            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100">
                                <FaMoneyBillWave className="text-emerald-600 text-3xl mb-4" />
                                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Expected Salary</h4>
                                <p className="text-2xl font-black italic text-slate-900">৳{tutor.expectedSalary || "Negotiable"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Quick Info & Contact (Partial) */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100">
                            <h4 className="font-black uppercase italic mb-6 text-slate-400 text-xs tracking-widest">Quick Information</h4>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500"><FaMapMarkerAlt /></div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-slate-400">Location</p>
                                        <p className="font-bold text-slate-800 text-sm">{tutor.location || tutor.address || "Dhaka, BD"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500"><FaCalendarAlt /></div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-slate-400">Availability</p>
                                        <p className="font-bold text-slate-800 text-sm">3-4 Days Per Week</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500"><FaStar className="text-orange-500" /></div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-slate-400">Total Reviews</p>
                                        <p className="font-bold text-slate-800 text-sm">12 Students Helped</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Safe Hiring Note */}
                        <div className="bg-orange-50 rounded-[2.5rem] p-8 border-2 border-dashed border-orange-200">
                            <h5 className="font-black uppercase italic mb-2 text-orange-700">Safety Tip</h5>
                            <p className="text-xs text-orange-600 font-medium leading-relaxed">
                                Always verify the identity and credentials of the tutor before making any advance payments. eTuitionBD ensures initial background checks, but personal verification is recommended.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default TutorsDetails;