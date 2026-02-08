import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGraduationCap, FaStar, FaMapMarkerAlt, FaSearch, FaMoneyBillWave, FaUniversity, FaUser, FaInfoCircle } from 'react-icons/fa';
import { Link } from 'react-router';
import axios from 'axios';

const Tutors = () => {
    const [tutors, setTutors] = useState([]);
    const [filteredTutors, setFilteredTutors] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // সার্চ এবং বাজেট স্টেট
    const [searchQuery, setSearchQuery] = useState("");
    const [maxBudget, setMaxBudget] = useState("");

    // ১. ডাটা ফেচিং
    useEffect(() => {
        axios.get('http://localhost:3000/users')
            .then(res => {
                // ডাটাবেজ থেকে শুধুমাত্র টিউটরদের আলাদা করা
                const tutorList = res.data.filter(user => user.role === 'tutor');
                setTutors(tutorList);
                setFilteredTutors(tutorList);
            })
            .catch(err => {
                console.error("Fetch Error:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // ২. শক্তিশালী সার্চ এবং ফিল্টার লজিক
    useEffect(() => {
        // ছোট ডিলে (Debounce) দেয়া হয়েছে যাতে পারফরম্যান্স ভালো থাকে
        const timeoutId = setTimeout(() => {
            const result = tutors.filter(tutor => {
                // সার্চ টেক্সট ফিল্টারিং (নাম, প্রতিষ্ঠান, ঠিকানা, বিষয়)
                const searchStr = searchQuery.toLowerCase();
                const matchesSearch = 
                    (tutor.name || "").toLowerCase().includes(searchStr) ||
                    (tutor.institution || "").toLowerCase().includes(searchStr) ||
                    (tutor.location || tutor.address || "").toLowerCase().includes(searchStr) ||
                    (tutor.subject || "").toLowerCase().includes(searchStr);

                // বাজেট ফিল্টারিং
                const tutorSalary = parseInt(tutor.expectedSalary || 0);
                const filterSalary = maxBudget === "" ? Infinity : parseInt(maxBudget);
                const matchesBudget = tutorSalary <= filterSalary;

                return matchesSearch && matchesBudget;
            });

            setFilteredTutors(result);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, maxBudget, tutors]);

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-white">
                <span className="loading loading-spinner loading-lg text-orange-600"></span>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen pt-28 pb-20 px-4">
            
            {/* --- Header & Filter Section --- */}
            <div className="max-w-7xl mx-auto mb-12">
                <div className="text-center mb-10">
                    <motion.h1 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black text-slate-900 uppercase italic mb-4"
                    >
                        Available <span className="text-orange-600">Mentors</span>
                    </motion.h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                        Showing {filteredTutors.length} verified educators from our community
                    </p>
                </div>

                {/* Search Bar & Budget Input */}
                <div className="bg-white p-4 md:p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 flex flex-col lg:flex-row gap-4 items-center border border-slate-100">
                    <div className="relative flex-1 w-full">
                        <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-600" />
                        <input 
                            type="text" 
                            placeholder="Search by Name, Institution, or Subject..." 
                            className="input w-full h-16 pl-14 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-orange-500/20 transition-all outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="relative w-full lg:w-72">
                        <FaMoneyBillWave className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-600" />
                        <input 
                            type="number" 
                            placeholder="Max Budget (BDT)" 
                            className="input w-full h-16 pl-14 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-orange-500/20 transition-all outline-none"
                            value={maxBudget}
                            onChange={(e) => setMaxBudget(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* --- Tutors Grid --- */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <AnimatePresence mode='popLayout'>
                    {filteredTutors.map((tutor) => (
                        <motion.div 
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4 }}
                            key={tutor._id}
                            className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col h-full"
                        >
                            {/* Tutor Image */}
                            <div className="relative h-60 overflow-hidden bg-slate-100">
                                <img 
                                    src={tutor.photoURL || "https://i.ibb.co/rt969V5/avatar.jpg"} 
                                    alt={tutor.name} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-sm border border-white">
                                    <FaStar className="text-orange-500 text-xs" />
                                    <span className="text-[10px] font-black italic">NEW</span>
                                </div>
                            </div>

                            {/* Content Details */}
                            <div className="p-7 flex flex-col grow">
                                <h3 className="text-xl font-black text-slate-800 uppercase italic truncate mb-4 flex items-center gap-2">
                                    {tutor.name}
                                </h3>
                                
                                <div className="space-y-3 mb-8 grow">
                                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
                                        <FaUniversity className="text-blue-600 shrink-0" /> 
                                        <span className="truncate">{tutor.institution || "Institution N/A"}</span>
                                    </p>
                                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
                                        <FaGraduationCap className="text-emerald-600 shrink-0" /> 
                                        <span className="truncate">{tutor.subject || "All Subjects"}</span>
                                    </p>
                                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-red-500 shrink-0" /> 
                                        <span className="truncate">{tutor.location || tutor.address || "Bangladesh"}</span>
                                    </p>
                                </div>

                                {/* Salary & Action */}
                                <div className="pt-5 border-t border-slate-50">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-[9px] font-black uppercase text-slate-300 tracking-tighter">Expected Salary</span>
                                        <span className="text-xl font-black text-slate-900 italic">
                                            {tutor.expectedSalary ? `৳${tutor.expectedSalary}` : 'Negotiable'}
                                        </span>
                                    </div>

                                    <Link 
                                        to={`/tutor-details/${tutor._id}`}
                                        className="btn btn-block bg-slate-900 hover:bg-orange-600 text-white border-none rounded-2xl h-14 uppercase font-black italic tracking-widest transition-all shadow-lg"
                                    >
                                        View Profile
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* --- Empty Result State --- */}
            {filteredTutors.length === 0 && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="max-w-7xl mx-auto text-center py-32 bg-white rounded-[4rem] border-4 border-dashed border-slate-100 mt-10"
                >
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaInfoCircle className="text-slate-200 text-4xl" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-300 uppercase italic">No Mentors Found</h3>
                    <p className="text-slate-400 text-sm mt-2 font-medium">Try adjusting your search keywords or budget range.</p>
                    <button 
                        onClick={() => {setSearchQuery(""); setMaxBudget("");}} 
                        className="mt-6 text-orange-600 font-black uppercase text-xs hover:underline"
                    >
                        Clear All Filters
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default Tutors;