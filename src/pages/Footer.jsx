import React from 'react';
import { NavLink } from 'react-router';
// New X logo is in fa6
import { FaXTwitter } from "react-icons/fa6";
// Other icons are in the standard fa set
import { 
    FaFacebookF, 
    FaLinkedinIn, 
    FaYoutube, 
    FaEnvelope, 
    FaPhoneAlt, 
    FaMapMarkerAlt 
} from "react-icons/fa";
import Logo from '../components/shared/Logo';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                
                {/* Column 1: Brand & Mission */}
                <div className="space-y-6">
                    <Logo /> 
                    <p className="text-sm leading-relaxed">
                        eTuitionBd is Bangladesh's premier platform connecting students with expert tutors. 
                        We simplify the search for quality education through verified and trusted connections.
                    </p>
                    {/* Social Media Icons */}
                    <div className="flex gap-4">
                        <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all duration-300">
                            <FaFacebookF />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all duration-300">
                            <FaLinkedinIn />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all duration-300">
                            <FaXTwitter />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all duration-300">
                            <FaYoutube />
                        </a>
                    </div>
                </div>

                {/* Column 2: Quick Navigation */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
                        Quick Links
                        <span className="absolute -bottom-2 left-0 w-12 h-1 bg-orange-600 rounded-full"></span>
                    </h3>
                    <ul className="space-y-4 text-sm">
                        <li><NavLink to="/tutors" className="hover:text-orange-500 transition-colors flex items-center gap-2">› Browse Tutors</NavLink></li>
                        <li><NavLink to="/tuitions" className="hover:text-orange-500 transition-colors flex items-center gap-2">› Tuition Jobs</NavLink></li>
                        <li><NavLink to="/about" className="hover:text-orange-500 transition-colors flex items-center gap-2">› Our Story</NavLink></li>
                        <li><NavLink to="/contact" className="hover:text-orange-500 transition-colors flex items-center gap-2">› Help Center</NavLink></li>
                    </ul>
                </div>

                {/* Column 3: Contact Info */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
                        Contact Us
                        <span className="absolute -bottom-2 left-0 w-12 h-1 bg-orange-600 rounded-full"></span>
                    </h3>
                    <ul className="space-y-4 text-sm">
                        <li className="flex items-start gap-3">
                            <FaMapMarkerAlt className="text-orange-500 mt-1 shrink-0" />
                            <span>Dhanmondi, Dhaka, Bangladesh</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <FaPhoneAlt className="text-orange-500 shrink-0" />
                            <span>+880 1234 567890</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <FaEnvelope className="text-orange-500 shrink-0" />
                            <span>support@etuitionbd.com</span>
                        </li>
                    </ul>
                </div>

                {/* Column 4: Newsletter */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
                        Newsletter
                        <span className="absolute -bottom-2 left-0 w-12 h-1 bg-orange-600 rounded-full"></span>
                    </h3>
                    <p className="text-sm mb-4">Subscribe for the latest tuition alerts and resources.</p>
                    <div className="flex flex-col gap-3">
                        <input 
                            type="email" 
                            placeholder="Your Email Address" 
                            className="input input-bordered bg-slate-800 border-slate-700 focus:border-orange-500 focus:outline-none text-white w-full" 
                        />
                        <button className="btn bg-orange-600 hover:bg-orange-700 border-none text-white w-full font-bold">
                            Subscribe Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-800 bg-slate-950/40">
                <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                    <p>© {new Date().getFullYear()} eTuitionBd. All rights reserved.</p>
                    <div className="flex gap-6 uppercase tracking-widest">
                        <a href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-orange-500 transition-colors">Terms of Use</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;