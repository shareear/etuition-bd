import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';
import { FaUserCircle, FaEnvelope, FaPhone, FaUserTag, FaChartLine, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, signOutUser } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.email) {
            axios.get(`http://localhost:3000/user-stats/${user.email}`)
                .then(res => setProfileData(res.data))
                .catch(err => console.log(err));
        }
    }, [user]);

    const handleLogOut = () => {
        signOutUser().then(() => {
            toast.success("Logged Out");
            navigate('/login');
        });
    };

    if (!profileData) return <div className="flex justify-center p-20"><span className="loading loading-spinner loading-lg"></span></div>;

    const { user: dbUser, stats } = profileData;

    return (
        <div className="max-w-5xl mx-auto p-4 lg:p-10">
            {/* Header / User Basic Info */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col md:flex-row items-center gap-8 mb-8">
                <div className="relative">
                    <img 
                        src={dbUser.image || user?.photoURL || "https://via.placeholder.com/150"} 
                        alt="Profile" 
                        className="w-32 h-32 rounded-3xl object-cover ring-4 ring-orange-50 shadow-lg"
                    />
                    <span className="absolute -bottom-2 -right-2 bg-green-500 text-white text-[10px] px-2 py-1 rounded-lg font-bold uppercase tracking-wider">
                        {dbUser.role}
                    </span>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-black text-slate-800 uppercase italic leading-none mb-2">{dbUser.name}</h1>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-500 text-sm">
                        <span className="flex items-center gap-1"><FaEnvelope className="text-orange-500"/> {dbUser.email}</span>
                        {dbUser.phone && <span className="flex items-center gap-1"><FaPhone className="text-orange-500"/> {dbUser.phone}</span>}
                    </div>
                </div>

                <button onClick={handleLogOut} className="btn btn-outline btn-error rounded-xl gap-2 font-bold uppercase text-xs">
                    <FaSignOutAlt /> Log Out
                </button>
            </div>

            {/* Role-Based Stats Cards */}
            <h3 className="text-xl font-black text-slate-800 mb-6 uppercase italic flex items-center gap-2">
                <FaChartLine className="text-orange-600"/> Platform Overview
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Admin View */}
                {dbUser.role === 'admin' && (
                    <>
                        <StatCard label="Total Platform Users" value={stats.totalUsers} desc="Registered Accounts" />
                        <StatCard label="Active Tuition Posts" value={stats.totalTuitions} desc="Approved & Pending" />
                        <StatCard label="Total Revenue" value={`$${stats.earnings}`} desc="Successful Transactions" />
                    </>
                )}

                {/* Tutor View */}
                {dbUser.role === 'tutor' && (
                    <>
                        <StatCard label="Applied Jobs" value={stats.totalApplied} desc="Total Applications Submitted" />
                        <StatCard label="Ongoing Tuitions" value={stats.ongoingTuitions} desc="Currently Teaching" />
                        <StatCard label="Total Earnings" value="$0" desc="Coming from Revenue History" />
                    </>
                )}

                {/* Student View */}
                {dbUser.role === 'student' && (
                    <>
                        <StatCard label="Tuitions Posted" value={stats.myPosts} desc="Jobs created by you" />
                        <StatCard label="Payments Made" value={stats.totalPayments} desc="Successful Transactions" />
                        <StatCard label="Hired Tutors" value={stats.totalPayments} desc="Verified Connections" />
                    </>
                )}
            </div>

            {/* Account Status / Challenges (Requirement: Unique Design) */}
            <div className="mt-8 bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold italic">Account Verification Status</h2>
                    <p className="text-slate-400 text-sm mt-2">Your account is currently <span className="text-green-400 font-bold uppercase underline">Verified</span> and compliant with eTuitionBd policies.</p>
                </div>
                <div className="absolute top-0 right-0 p-10 opacity-10">
                    <FaUserTag size={120} />
                </div>
            </div>
        </div>
    );
};

// Reusable Stats Component
const StatCard = ({ label, value, desc }) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
        <h2 className="text-4xl font-black text-orange-600">{value}</h2>
        <p className="text-slate-400 text-[10px] mt-2 font-medium">{desc}</p>
    </div>
);

export default Profile;