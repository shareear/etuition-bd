import { useEffect, useState } from "react";
import { Link, NavLink, Outlet } from "react-router";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
// প্রয়োজনীয় নতুন আইকনগুলো ইমপোর্ট করে নিন
import { FaUser, FaUsers, FaBook, FaPlusCircle, FaHistory, FaChalkboardTeacher, FaDollarSign, FaHome } from "react-icons/fa";

const DashboardLayout = () => {
    const { user } = useAuth();
    const [role, setRole] = useState(null);

    useEffect(() => {
        if (user?.email) {
            axios.get(`http://localhost:3000/users/role/${user.email}`)
                .then(res => setRole(res.data.role));
        }
    }, [user]);

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            {/* Sidebar */}
            <div className="w-72 bg-slate-900 text-white p-6 shadow-2xl">
                <div className="mb-10 px-2">
                    <h1 className="text-2xl font-black text-orange-500 italic leading-none">ETUITION <span className="text-white">BD</span></h1>
                    <p className="text-[10px] text-slate-400 uppercase tracking-[3px] mt-1 font-bold">Control Panel</p>
                </div>
                
                <ul className="space-y-2">
                    {/* Common link for all logged in users */}
                    <li>
                        <NavLink to="/" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-all text-slate-300">
                            <FaHome className="text-orange-500" /> Back to Home
                        </NavLink>
                    </li>

                    <div className="divider opacity-20 my-4"></div>

                    {/* Admin Menu */}
                    {role === 'admin' && (
                        <>
                            <p className="text-[10px] text-slate-500 uppercase font-black px-3 mb-2 tracking-widest">Administrator</p>
                            <li><NavLink to="/dashboard/manage-tuitions" className={({isActive}) => `flex items-center gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-orange-600 text-white font-bold' : 'hover:bg-slate-800'}`}><FaBook /> Manage Tuitions</NavLink></li>
                            <li><NavLink to="/dashboard/manage-users" className={({isActive}) => `flex items-center gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-orange-600 text-white font-bold' : 'hover:bg-slate-800'}`}><FaUsers /> Manage Users</NavLink></li>
                            <li><NavLink to="/dashboard/analytics" className={({isActive}) => `flex items-center gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-orange-600 text-white font-bold' : 'hover:bg-slate-800'}`}><FaHistory /> Analytics</NavLink></li>
                        </>
                    )}

                    {/* Student Menu */}
                    {role === 'student' && (
                        <>
                            <p className="text-[10px] text-slate-500 uppercase font-black px-3 mb-2 tracking-widest">Student Portal</p>
                            <li><NavLink to="/dashboard/post-tuition" className={({isActive}) => `flex items-center gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-orange-600 text-white font-bold' : 'hover:bg-slate-800'}`}><FaPlusCircle /> Post Tuition</NavLink></li>
                            <li><NavLink to="/dashboard/my-posts" className={({isActive}) => `flex items-center gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-orange-600 text-white font-bold' : 'hover:bg-slate-800'}`}><FaBook /> My Tuitions</NavLink></li>
                            <li><NavLink to="/dashboard/applied-tutors" className={({isActive}) => `flex items-center gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-orange-600 text-white font-bold' : 'hover:bg-slate-800'}`}><FaUsers /> Applied Tutors</NavLink></li>
                        </>
                    )}

                    {/* Tutor Menu (আপনার রিকোয়ারমেন্ট অনুযায়ী নতুন মেনু) */}
                    {role === 'tutor' && (
                        <>
                            <p className="text-[10px] text-slate-500 uppercase font-black px-3 mb-2 tracking-widest">Tutor Portal</p>
                            <li><NavLink to="/dashboard/my-applications" className={({isActive}) => `flex items-center gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-orange-600 text-white font-bold' : 'hover:bg-slate-800'}`}><FaHistory /> My Applications</NavLink></li>
                            <li><NavLink to="/dashboard/hiringrequest" className={({isActive}) => `flex items-center gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-orange-600 text-white font-bold' : 'hover:bg-slate-800'}`}><FaHistory />Hiring Requests</NavLink></li>
                            <li><NavLink to="/dashboard/ongoing-tuitions" className={({isActive}) => `flex items-center gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-orange-600 text-white font-bold' : 'hover:bg-slate-800'}`}><FaChalkboardTeacher /> Ongoing Tuitions</NavLink></li>
                            <li><NavLink to="/dashboard/revenue" className={({isActive}) => `flex items-center gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-orange-600 text-white font-bold' : 'hover:bg-slate-800'}`}><FaDollarSign /> Revenue History</NavLink></li>
                        </>
                    )}

                    <div className="divider opacity-20 my-4"></div>
                    
                    {/* Common My Profile for everyone */}
                    <li><NavLink to="/dashboard/profile" className={({isActive}) => `flex items-center gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-slate-700 text-orange-400 font-bold' : 'hover:bg-slate-800'}`}><FaUser /> My Profile</NavLink></li>
                </ul>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto max-h-screen">
                <div className="p-8 lg:p-12">
                    <Outlet context={[role]} /> {/* role টা context হিসেবে পাঠালে দরকার হলে চাইল্ড পেজেও পাওয়া যাবে */}
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;