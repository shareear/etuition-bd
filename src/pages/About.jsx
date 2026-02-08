import React from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaUserTie, FaUsers, FaChartLine, FaQuoteLeft, FaCheckCircle } from 'react-icons/fa';

const About = () => {
    
    // হাইলাইট স্ট্যাটস
    const highlights = [
        { label: "Students Helped", value: "15K+", icon: <FaGraduationCap />, desc: "Connecting learners with mentors" },
        { label: "Jobs Provided", value: "8K+", icon: <FaUserTie />, desc: "Empowering passionate tutors" },
        { label: "Active Tutors", value: "4K+", icon: <FaUsers />, desc: "Expert educators across BD" },
        { label: "Success Rate", value: "98%", icon: <FaChartLine />, desc: "Ensuring quality education" },
    ];

    return (
        <div className="bg-white min-h-screen pt-28 pb-20 overflow-hidden">
            
            {/* 1. Minimal Hero Section */}
            <section className="max-w-4xl mx-auto px-6 text-center mb-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                        Since 2022
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 uppercase italic mt-6 mb-8 leading-tight">
                        We Bridge the Gap <br />
                        <span className="text-orange-600">to Knowledge</span>
                    </h1>
                    <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed italic border-l-4 border-orange-500 pl-6 text-left max-w-2xl mx-auto">
                        "Our journey started with a single goal: making quality home education accessible, reliable, and organized for every student in Bangladesh."
                    </p>
                </motion.div>
            </section>

            {/* 2. Stats Grid Section */}
            <section className="bg-slate-50 py-20 border-y border-slate-100 mb-24 relative">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {highlights.map((item, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200/50 hover:shadow-xl transition-all group"
                        >
                            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-xl mb-4 group-hover:bg-orange-600 transition-colors">
                                {item.icon}
                            </div>
                            <h2 className="text-4xl font-black text-slate-900 mb-1">{item.value}</h2>
                            <p className="text-orange-600 font-black uppercase text-[10px] tracking-widest mb-2">{item.label}</p>
                            <p className="text-slate-400 text-xs font-medium">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 3. Mission & Goal (Text-Only Layout) */}
            <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32">
                <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden">
                    <FaQuoteLeft className="absolute top-10 right-10 text-white/10 text-8xl" />
                    <h3 className="text-3xl font-black uppercase italic mb-6 text-orange-500">Our Mission</h3>
                    <p className="text-slate-300 text-lg leading-relaxed font-medium mb-8">
                        To build the largest community of educators where talent meets opportunity. We want to ensure that geography never limits a student's potential to learn.
                    </p>
                    <ul className="space-y-4">
                        {["Verified Profiles", "Secure Payments", "Proper Matching"].map((point, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest">
                                <FaCheckCircle className="text-orange-500" /> {point}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col justify-center py-10">
                    <h3 className="text-3xl font-black uppercase italic mb-6 text-slate-900">The Ultimate Goal</h3>
                    <p className="text-slate-500 text-lg leading-relaxed mb-8">
                        Our ultimate goal is to digitize the entire tutoring management system. From finding a tutor to managing attendance and monthly payments, eTuitionBD aims to be the all-in-one solution for guardians and tutors alike.
                    </p>
                    <div className="p-8 bg-orange-50 rounded-[2.5rem] border-2 border-dashed border-orange-200">
                        <p className="text-orange-700 font-black italic">
                            "Transparency and quality are the two pillars we stand upon. We are not just a listing site; we are your education partner."
                        </p>
                    </div>
                </div>
            </section>

            {/* 4. Footer Motto */}
            <section className="max-w-7xl mx-auto px-6 text-center">
                <div className="py-20 border-t border-slate-100">
                    <h2 className="text-2xl md:text-4xl font-black text-slate-300 uppercase italic tracking-tighter">
                        Quality Learning • Trusted Mentoring • Reliable Support
                    </h2>
                </div>
            </section>
        </div>
    );
};

export default About;