import React from 'react';
import { motion } from 'framer-motion';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaHeadset, FaClock, FaFacebook, FaLinkedin, FaWhatsapp, FaUserTie } from 'react-icons/fa';

const Contact = () => {
    
    // কন্টাক্ট ডিটেইলস ডাটা
    const contactMethods = [
        {
            title: "Customer Center",
            desc: "General inquiries & support",
            phones: ["+880 1700-000000", "+880 1800-000000"],
            emails: ["support@etuitionbd.com", "info@etuitionbd.com"],
            icon: <FaHeadset />,
            color: "bg-orange-600"
        },
        {
            title: "Tutor Relations",
            desc: "For tutor verification & issues",
            phones: ["+880 1900-111222"],
            emails: ["tutors@etuitionbd.com"],
            icon: <FaUserTie className="hidden" />, // fallback with standard icon
            iconAlt: <FaPhoneAlt />,
            color: "bg-slate-900"
        }
    ];

    return (
        <div className="bg-white min-h-screen pt-28 pb-20 overflow-hidden">
            
            {/* Header Section */}
            <section className="max-w-7xl mx-auto px-6 text-center mb-16">
                <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-5xl md:text-7xl font-black text-slate-900 uppercase italic mb-6"
                >
                    Get in <span className="text-orange-600">Touch</span>
                </motion.h1>
                <p className="max-w-2xl mx-auto text-slate-500 font-medium">
                    Have questions? Our team is here to help you find the perfect tutor or assist you with your teaching journey.
                </p>
            </section>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* 1. Contact Info Cards */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {contactMethods.map((method, idx) => (
                            <div key={idx} className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 hover:shadow-xl transition-all group">
                                <div className={`w-12 h-12 ${method.color} text-white rounded-2xl flex items-center justify-center text-xl mb-6 shadow-lg`}>
                                    {method.icon || method.iconAlt}
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 uppercase italic mb-2">{method.title}</h3>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">{method.desc}</p>
                                
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        {method.phones.map((phone, pIdx) => (
                                            <p key={pIdx} className="text-slate-700 font-bold flex items-center gap-2">
                                                <FaPhoneAlt className="text-orange-500 text-xs" /> {phone}
                                            </p>
                                        ))}
                                    </div>
                                    <div className="space-y-1">
                                        {method.emails.map((email, eIdx) => (
                                            <p key={eIdx} className="text-slate-500 text-sm font-medium flex items-center gap-2 break-all">
                                                <FaEnvelope className="text-orange-500 text-xs" /> {email}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Address & Office Hours */}
                    <div className="bg-slate-900 rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                            <div>
                                <h4 className="text-orange-500 font-black uppercase tracking-widest text-xs mb-4">Corporate Office</h4>
                                <div className="flex gap-4">
                                    <FaMapMarkerAlt className="text-3xl text-orange-500 shrink-0" />
                                    <p className="text-slate-300 font-medium leading-relaxed">
                                        Level 4, Suite 202, <br />
                                        Advanced Landmark Tower, <br />
                                        Banani, Dhaka-1213, Bangladesh.
                                    </p>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-orange-500 font-black uppercase tracking-widest text-xs mb-4">Office Hours</h4>
                                <div className="flex gap-4">
                                    <FaClock className="text-3xl text-orange-500 shrink-0" />
                                    <div className="text-slate-300 font-medium">
                                        <p>Saturday - Thursday</p>
                                        <p className="text-white font-black italic">10:00 AM - 08:00 PM</p>
                                        <p className="text-xs text-slate-500 mt-2">Closed on Fridays & Public Holidays</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Decor circle */}
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-600 rounded-full blur-[80px] opacity-20"></div>
                    </div>
                </div>

                {/* 2. Quick Connect & Reps */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-orange-50 rounded-[3rem] p-8 border-2 border-dashed border-orange-200">
                        <h3 className="text-xl font-black text-slate-900 uppercase italic mb-6">Regional Representatives</h3>
                        <div className="space-y-6">
                            <div className="pb-6 border-b border-orange-200">
                                <p className="text-xs font-black text-orange-600 uppercase tracking-widest">Chittagong Division</p>
                                <p className="font-bold text-slate-800">Mr. Rahman (Area Manager)</p>
                                <p className="text-sm text-slate-500">+880 1611-223344</p>
                            </div>
                            <div className="pb-6 border-b border-orange-200">
                                <p className="text-xs font-black text-orange-600 uppercase tracking-widest">Sylhet Division</p>
                                <p className="font-bold text-slate-800">Ms. Yasmin (Coordination)</p>
                                <p className="text-sm text-slate-500">+880 1511-556677</p>
                            </div>
                        </div>
                    </div>

                    {/* Social Connect */}
                    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm text-center">
                        <h4 className="font-black uppercase italic mb-6">Follow Our Community</h4>
                        <div className="flex justify-center gap-4">
                            <a href="#" className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-xl hover:bg-blue-600 hover:text-white transition-all">
                                <FaFacebook />
                            </a>
                            <a href="#" className="w-12 h-12 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center text-xl hover:bg-blue-700 hover:text-white transition-all">
                                <FaLinkedin />
                            </a>
                            <a href="#" className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-xl hover:bg-green-600 hover:text-white transition-all">
                                <FaWhatsapp />
                            </a>
                        </div>
                        <p className="mt-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Live Support Available</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Contact;