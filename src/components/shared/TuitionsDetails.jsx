import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import axios from 'axios';
import { FaMapMarkerAlt, FaUserGraduate, FaArrowLeft, FaInfoCircle, FaCalendarAlt } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';

const TuitionsDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [tuition, setTuition] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // ১. টিউশন ডাটা ফেচ করা
        axios.get(`http://localhost:3000/tuition/${id}`)
            .then(res => {
                setTuition(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });

        // ২. ইউজারের রোল চেক করা
        if (user?.email) {
            axios.get(`http://localhost:3000/users/role/${user.email}`)
                .then(res => setRole(res.data.role));
        }
    }, [id, user]);

    if (loading) return <div className="min-h-screen flex justify-center items-center"><span className="loading loading-spinner loading-lg text-orange-600"></span></div>;

    if (!tuition) return <div className="min-h-screen pt-40 text-center font-bold text-red-500 uppercase">Tuition Data Not Found!</div>;

    return (
        <div className="bg-slate-50 min-h-screen pt-32 pb-20 px-4">
            <div className="max-w-6xl mx-auto">
                <Link to="/tuitions" className="inline-flex items-center gap-2 text-slate-500 hover:text-orange-600 font-black uppercase text-xs mb-8 transition-all">
                    <FaArrowLeft /> Back to Listings
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left: Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100">
                            <div className="flex gap-4 mb-6">
                                <span className="badge badge-success text-white font-bold uppercase text-[10px] py-3 px-4">Active Post</span>
                                <span className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                    <FaCalendarAlt /> {new Date(tuition.postedDate).toLocaleDateString()}
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic mb-6 leading-tight">
                                {tuition.subject} <span className="text-orange-600">Teacher Required</span>
                            </h1>

                            <div className="bg-slate-50 p-6 rounded-3xl border-l-8 border-orange-500 mb-8">
                                <h4 className="flex items-center gap-2 font-black uppercase text-sm text-slate-700 mb-2">
                                    <FaInfoCircle /> Job Description
                                </h4>
                                <p className="text-slate-600 leading-relaxed font-medium">
                                    {tuition.description || "Looking for an experienced tutor who can guide the student effectively and improve their core concepts."}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-2xl">
                                    <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg"><FaUserGraduate size={20}/></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase">Student Class</p>
                                        <p className="font-black text-slate-800 text-lg uppercase italic">{tuition.class}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-2xl">
                                    <div className="w-12 h-12 bg-orange-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-orange-100"><FaMapMarkerAlt size={20}/></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase">Location</p>
                                        <p className="font-black text-slate-800 text-lg uppercase italic">{tuition.location}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Sidebar Action */}
                    <div className="lg:col-span-1">
                        <div className="bg-slate-900 rounded-[3rem] p-10 text-white sticky top-32 shadow-2xl overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                            
                            <div className="relative z-10">
                                <p className="text-orange-500 uppercase font-black tracking-[4px] text-[10px] mb-2">Monthly Budget</p>
                                <h2 className="text-5xl font-black italic mb-8">${tuition.salary}</h2>

                                <div className="space-y-4 mb-10 border-t border-slate-800 pt-8">
                                    <div className="flex justify-between text-xs font-bold uppercase opacity-60">
                                        <span>Student Email</span>
                                        <span className="text-white truncate max-w-30">{tuition.studentEmail}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold uppercase opacity-60">
                                        <span>Status</span>
                                        <span className="text-orange-500">{tuition.status}</span>
                                    </div>
                                </div>

                                {/* logic for buttons */}
                                {role === 'tutor' ? (
                                    <Link to={`/dashboard/my-applications`} className="btn btn-block bg-orange-600 hover:bg-orange-700 text-white border-none h-16 rounded-2xl font-black uppercase italic tracking-widest text-lg shadow-xl shadow-orange-900/20 transition-all">
                                        Apply Now
                                    </Link>
                                ) : !user ? (
                                    <Link to="/login" className="btn btn-block bg-slate-700 text-white border-none h-16 rounded-2xl font-black uppercase italic tracking-widest">
                                        Login to Apply
                                    </Link>
                                ) : (
                                    <div className="bg-slate-800 p-4 rounded-2xl text-center border border-slate-700">
                                        <p className="text-[10px] font-black uppercase text-slate-500 italic">Access restricted for {role}s</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TuitionsDetails;