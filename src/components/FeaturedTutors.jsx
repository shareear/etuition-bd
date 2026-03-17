import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaStar, FaGraduationCap, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router';

const FeaturedTutors = () => {
    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetching from your existing /users API
        axios.get('https://etuition-bd-server.vercel.app/users')
            .then(res => {
                // Filter role 'tutor' and take the first 6
                const filtered = res.data
                    .filter(user => user.role === 'tutor')
                    .slice(0, 6);
                setTutors(filtered);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching tutors:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div className="flex justify-center py-20">
            <span className="loading loading-bars loading-lg text-orange-600"></span>
        </div>
    );

    return (
        <section className="bg-base-200 py-20 px-4 transition-colors duration-300">
            {/* Centered Container */}
            <div className="max-w-7xl mx-auto">
                
                {/* Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 border-b border-base-300 pb-8">
                    <div className="text-center md:text-left">
                        <h2 className="text-4xl font-black italic uppercase text-base-content">
                            Featured <span className="text-orange-600">Tutors</span>
                        </h2>
                        <p className="text-base-content/60 font-medium mt-2">Connect with the top-rated educators in our community</p>
                    </div>
                    <Link to="/tutors" className="mt-6 md:mt-0 flex items-center gap-2 font-bold text-orange-600 hover:gap-4 transition-all uppercase tracking-widest text-sm">
                        Find More Tutors <FaArrowRight />
                    </Link>
                </div>

                {/* Tutors Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tutors.map((tutor) => (
                        <div key={tutor._id} className="bg-base-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl transition-all duration-500 border border-base-300 group">
                            
                            <div className="flex flex-col items-center">
                                {/* Profile Photo */}
                                <div className="relative mb-6">
                                    <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-orange-50/10 group-hover:ring-orange-500 transition-all duration-500">
                                        <img 
                                            src={tutor.image || tutor.photoURL || "https://i.ibb.co/5GzXkwq/user.png"} 
                                            alt={tutor.name} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="absolute bottom-1 right-1 bg-green-500 text-white p-1.5 rounded-full border-4 border-base-100 shadow-sm">
                                        <FaCheckCircle size={12} />
                                    </div>
                                </div>

                                {/* Tutor Info */}
                                <h3 className="text-xl font-black text-base-content group-hover:text-orange-600 transition-colors uppercase italic">
                                    {tutor.name}
                                </h3>
                                
                                <div className="flex items-center gap-2 text-base-content/60 text-sm mt-2 mb-4">
                                    <FaGraduationCap className="text-orange-500 text-lg" />
                                    <span className="font-bold truncate max-w-50 text-center">
                                        {tutor.institution || "Expert Educator"}
                                    </span>
                                </div>

                                {/* Stats & Location Bar */}
                                <div className="flex items-center justify-between w-full pt-6 border-t border-base-300 mt-4">
                                    <div className="flex items-center gap-1">
                                        <FaStar className="text-orange-400" />
                                        <span className="font-black text-base-content">4.9</span>
                                    </div>
                                    <span className="text-[10px] font-black text-base-content/30 uppercase tracking-widest">
                                        {tutor.address || tutor.location || "Dhaka"}
                                    </span>
                                </div>

                                {/* The Fixed Link Button */}
                                <Link 
                                    to={`/tutor-details/${tutor._id}`}
                                    className="btn btn-block bg-slate-900 hover:bg-orange-600 text-white border-none rounded-2xl mt-8 font-black uppercase italic tracking-widest text-xs"
                                >
                                    View Profile
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

    );
};

export default FeaturedTutors;