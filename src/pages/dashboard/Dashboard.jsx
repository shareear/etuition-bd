import { useEffect, useState } from "react";
import { Link, NavLink, Outlet } from "react-router";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
// Added FaFileAlt and FaClipboardList for a better visual fit
import { FaUser, FaUsers, FaBook, FaPlusCircle, FaHistory, FaChalkboardTeacher, FaDollarSign, FaHome, FaFileAlt, FaClipboardList } from "react-icons/fa";
import Logo from "../../components/shared/Logo";

const DashboardLayout = () => {
    const { user } = useAuth();
    const [role, setRole] = useState(null);

    useEffect(() => {
        if (user?.email) {
            axios.get(`http://localhost:3000/users/role/${user.email}`)
                .then(res => {
                    setRole(res.data.role);
                });
        }
    }, [user]);

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            {/* Sidebar - w-20 on mobile, w-72 on desktop */}
            <div className="w-20 lg:w-72 bg-slate-900 text-white p-4 lg:p-6 shadow-2xl transition-all duration-300 flex flex-col items-center lg:items-stretch shrink-0">
                
                {/* Logo Section - Now using shared component */}
                <div className="mb-10 lg:px-2 flex justify-center lg:justify-start overflow-hidden">
                    <Logo />
                </div>
                
                <ul className="space-y-2 w-full">
                    <li>
                        <NavLink to="/" className="flex items-center justify-center lg:justify-start gap-3 p-3 rounded-xl hover:bg-slate-800 transition-all text-slate-300" title="Home">
                            <FaHome className="text-orange-500 text-xl lg:text-base" /> 
                            <span className="hidden lg:block">Back to Home</span>
                        </NavLink>
                    </li>

                    <div className="divider opacity-20 my-4"></div>

                    {/* Admin Menu */}
                    {role === 'admin' && (
                        <>
                            <p className="hidden lg:block text-[10px] text-slate-500 uppercase font-black px-3 mb-2 tracking-widest">Administrator</p>
                            <li><NavLink to="/dashboard/manage-tuitions" title="Manage Tuitions" className={({isActive}) => `flex items-center justify-center lg:justify-start gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-orange-600 text-white font-bold' : 'hover:bg-slate-800'}`}><FaBook /> <span className="hidden lg:block">Manage Tuitions</span></NavLink></li>
                            <li><NavLink to="/dashboard/manage-users" title="Manage Users" className={({isActive}) => `flex items-center justify-center lg:justify-start gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-orange-600 text-white font-bold' : 'hover:bg-slate-800'}`}><FaUsers /> <span className="hidden lg:block">Manage Users</span></NavLink></li>
                            <li><NavLink to="/dashboard/analytics" title="Analytics" className={({isActive}) => `flex items-center justify-center lg:justify-start gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-orange-600 text-white font-bold' : 'hover:bg-slate-800'}`}><FaHistory /> <span className="hidden lg:block">Analytics</span></NavLink></li>
                        </>
                    )}

                    {/* Student Menu */}
                    {role === 'student' && (
                        <>
                            <p className="hidden lg:block text-[10px] text-slate-500 uppercase font-black px-3 mb-2 tracking-widest">Student Portal</p>
                            <li><NavLink to="/dashboard/post-tuition" title="Post Tuition" className={({isActive}) => `flex items-center justify-center lg:justify-start gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-orange-600 text-white font-bold' : 'hover:bg-slate-800'}`}><FaPlusCircle /> <span className="hidden lg:block">Post Tuition</span></NavLink></li>
                            <li><NavLink to="/dashboard/my-posts" title="My Tuitions" className={({isActive}) => `flex items-center justify-center lg:justify-start gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-orange-600 text-white font-bold' : 'hover:bg-slate-800'}`}><FaBook /> <span className="hidden lg:block">My Tuitions</span></NavLink></li>
                            <li><NavLink to="/dashboard/ongoing-tuitions" title="Ongoing Tuitions" className={({isActive}) => `flex items-center justify-center lg:justify-start gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-orange-600 text-white font-bold' : 'hover:bg-slate-800'}`}><FaBook /> <span className="hidden lg:block">Ongoing Tuitions</span></NavLink></li>
                            <li><NavLink to="/dashboard/applied-tutors" title="Applied Tutors" className={({isActive}) => `flex items-center justify-center lg:justify-start gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-orange-600 text-white font-bold' : 'hover:bg-slate-800'}`}><FaUsers /> <span className="hidden lg:block">Applied Tutors</span></NavLink></li>
                            <li><NavLink to="/dashboard/payment-history" title="Payment History" className={({isActive}) => `flex items-center justify-center lg:justify-start gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-orange-600 text-white font-bold' : 'hover:bg-slate-800'}`}><FaHistory /> <span className="hidden lg:block">Payment History</span></NavLink></li>
                        </>
                    )}

                    {/* Tutor Menu */}
                    {role === 'tutor' && (
                        <>
                            <p className="hidden lg:block text-[10px] text-slate-500 uppercase font-black px-3 mb-2 tracking-widest">Tutor Portal</p>
                            <li><NavLink to="/dashboard/my-applications" title="My Applications" className={({isActive}) => `flex items-center justify-center lg:justify-start gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-orange-600 text-white font-bold' : 'hover:bg-slate-800'}`}><FaFileAlt /> <span className="hidden lg:block">My Applications</span></NavLink></li>
                            <li><NavLink to="/dashboard/hiringrequest" title="Hiring Requests" className={({isActive}) => `flex items-center justify-center lg:justify-start gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-orange-600 text-white font-bold' : 'hover:bg-slate-800'}`}><FaClipboardList /> <span className="hidden lg:block">Hiring Requests</span></NavLink></li>
                            <li><NavLink to="/dashboard/ongoing-tuitions" title="Ongoing Tuitions" className={({isActive}) => `flex items-center justify-center lg:justify-start gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-orange-600 text-white font-bold' : 'hover:bg-slate-800'}`}><FaChalkboardTeacher /> <span className="hidden lg:block">Ongoing Tuitions</span></NavLink></li>
                            <li><NavLink to="/dashboard/revenue" title="Revenue History" className={({isActive}) => `flex items-center justify-center lg:justify-start gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-orange-600 text-white font-bold' : 'hover:bg-slate-800'}`}><FaDollarSign /> <span className="hidden lg:block">Revenue History</span></NavLink></li>
                        </>
                    )}

                    <div className="divider opacity-20 my-4"></div>
                    
                    {/* Common My Profile */}
                    <li><NavLink to="/dashboard/profile" title="My Profile" className={({isActive}) => `flex items-center justify-center lg:justify-start gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-slate-700 text-orange-400 font-bold' : 'hover:bg-slate-800'}`}><FaUser /> <span className="hidden lg:block">My Profile</span></NavLink></li>
                </ul>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto max-h-screen">
                <div className="p-4 lg:p-12">
                    <Outlet context={[role]} />
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;