import React from 'react';
import { motion } from 'framer-motion';
import { FaUserPlus, FaSearch, FaChalkboardTeacher, FaShieldAlt, FaClock, FaCheckCircle, FaUsers } from 'react-icons/fa';

const HowItWorks = () => {
    const steps = [
        {
            id: 1,
            title: "Create Account",
            desc: "Register as a student or tutor in minutes with your phone number.",
            icon: <FaUserPlus className="text-3xl" />,
            color: "bg-orange-100 text-orange-600"
        },
        {
            id: 2,
            title: "Search & Match",
            desc: "Browse expert tutors or tuition posts based on your subject and area.",
            icon: <FaSearch className="text-3xl" />,
            color: "bg-blue-100 text-blue-600"
        },
        {
            id: 3,
            title: "Start Learning",
            desc: "Connect instantly and start your journey towards excellence.",
            icon: <FaChalkboardTeacher className="text-3xl" />,
            color: "bg-green-100 text-green-600"
        }
    ];

    const features = [
        { title: "Verified Tutors", desc: "Every profile is manually checked for authenticity.", icon: <FaShieldAlt /> },
        { title: "Quick Response", desc: "Get matched with a tutor or student within 24 hours.", icon: <FaClock /> },
        { title: "Flexible Schedule", desc: "Learn at your own pace and your own preferred time.", icon: <FaCheckCircle /> },
        { title: "Huge Community", desc: "Join 10,000+ active users across Bangladesh.", icon: <FaUsers /> }
    ];

    return (
        <section className="bg-slate-50 py-24 px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto space-y-32">
                
                {/* --- SECTION 1: HOW IT WORKS --- */}
                <div className="text-center space-y-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-extrabold text-slate-900">
                            How the <span className="text-orange-600">Platform</span> Works
                        </h2>
                        <p className="text-slate-500 mt-4 max-w-xl mx-auto italic">
                            Simple, fast, and transparent process for everyone.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop Only) */}
                        <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10"></div>

                        {steps.map((step, index) => (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.2 }}
                                viewport={{ once: true }}
                                className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all group"
                            >
                                <div className={`w-20 h-20 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300`}>
                                    {step.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">{step.title}</h3>
                                <p className="text-slate-500 leading-relaxed">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* --- SECTION 2: WHY CHOOSE US --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <h2 className="text-4xl font-extrabold text-slate-900 leading-tight">
                            Why Thousands of Parents <br /> 
                            <span className="text-orange-600 underline underline-offset-8 decoration-orange-200">Trust eTuitionBd</span>
                        </h2>
                        <p className="text-slate-600 text-lg">
                            We aren't just a tuition media; we are a community dedicated to educational success in Bangladesh.
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {features.map((f, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="mt-1 text-orange-600 bg-orange-50 p-2 rounded-lg">
                                        {f.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800">{f.title}</h4>
                                        <p className="text-sm text-slate-500">{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Visual Element / Right Side Decoration */}
                    <motion.div 
                        initial={{ opacity: 0, rotate: 5 }}
                        whileInView={{ opacity: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="aspect-square bg-orange-600 rounded-3xl overflow-hidden shadow-2xl relative">
                            {/* Replace with your own image or an educational illustration */}
                            <img 
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                                alt="Students Group Study" 
                                className="w-full h-full object-cover opacity-80"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-8 left-8 text-white">
                                <p className="text-3xl font-bold">100%</p>
                                <p className="text-sm uppercase tracking-widest">Satisfaction Rate</p>
                            </div>
                        </div>
                        {/* Floating Badge */}
                        <div className="absolute -top-6 -right-6 bg-white p-6 rounded-2xl shadow-2xl border border-slate-100 hidden md:block">
                            <p className="text-orange-600 font-black text-2xl">BD #1</p>
                            <p className="text-xs text-slate-400 font-bold">Tuition Network</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;