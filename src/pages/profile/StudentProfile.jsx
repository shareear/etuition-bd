import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import axios from 'axios';
import { FaPhoneAlt, FaMapMarkerAlt, FaSchool, FaUserCircle, FaEnvelope, FaGraduationCap, FaArrowLeft } from 'react-icons/fa';
import MessagingSystem from '../../components/shared/MessagingSystem';

const StudentProfile = () => {
    const { studentId } = useParams(); // This is the email in your routing
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const token = localStorage.getItem('access-token');
                // Note: Using your existing user-stats or a specific profile route
                const response = await axios.get(` https://etuition-bd-server.vercel.app/user-stats/${studentId}`, {
                    headers: { authorization: `Bearer ${token}` }
                });
                // Your backend returns { user, stats }. We need the user object.
                setStudent(response.data.user);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching student profile:', error);
                setLoading(false);
            }
        };
        fetchStudent();
    }, [studentId]);

    if (loading) return <div className="min-h-screen flex justify-center items-center"><span className="loading loading-spinner loading-lg text-orange-600"></span></div>;

    if (!student) return <div className="min-h-screen flex flex-col items-center justify-center font-bold text-red-500 uppercase italic">Student Not Found!</div>;

    return (
        <div className="bg-slate-50 min-h-screen pt-32 pb-20 px-4">
            <div className="max-w-5xl mx-auto">
                <Link to={-1} className="inline-flex items-center gap-2 text-slate-500 hover:text-orange-600 font-black uppercase text-xs mb-8 transition-all">
                    <FaArrowLeft /> Go Back
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT SIDE: Avatar & Quick Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 text-center">
                            <div className="relative inline-block mb-6">
                                {student.image ? (
                                    <img 
                                        src={student.image} 
                                        alt={student.name} 
                                        className="w-40 h-40 rounded-[2rem] object-cover ring-8 ring-slate-50 shadow-xl mx-auto"
                                    />
                                ) : (
                                    <div className="w-40 h-40 rounded-[2rem] bg-orange-100 text-orange-600 flex items-center justify-center mx-auto shadow-xl">
                                        <FaUserCircle size={80} />
                                    </div>
                                )}
                                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase border-4 border-white">Online</div>
                            </div>
                            
                            <h2 className="text-2xl font-black text-slate-900 uppercase italic leading-tight">{student.name}</h2>
                            <p className="text-orange-600 font-bold uppercase text-[10px] tracking-widest mt-1">Student Member</p>

                            <div className="mt-8 space-y-4 text-left">
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                    <div className="text-orange-600"><FaEnvelope /></div>
                                    <div className="overflow-hidden">
                                        <p className="text-[9px] font-black text-slate-400 uppercase">Email Address</p>
                                        <p className="text-xs font-bold text-slate-700 truncate">{student.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                    <div className="text-orange-600"><FaPhoneAlt /></div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase">Contact Number</p>
                                        <p className="text-xs font-bold text-slate-700">{student.phone || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Academic Details & Messaging */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                            <h3 className="text-lg font-black text-slate-900 uppercase italic mb-8 border-b border-slate-100 pb-4">Academic & Personal Info</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shrink-0"><FaSchool /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Institution</p>
                                        <p className="font-black text-slate-800 uppercase italic text-lg">{student.institution || 'Private Candidate'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shrink-0"><FaGraduationCap /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Class</p>
                                        <p className="font-black text-slate-800 uppercase italic text-lg">{student.class ? `Class ${student.class}` : 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shrink-0"><FaMapMarkerAlt /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Address</p>
                                        <p className="font-bold text-slate-600 uppercase text-sm">{student.address || 'Location Hidden'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shrink-0"><FaUserCircle /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gender</p>
                                        <p className="font-black text-slate-800 uppercase italic text-lg">{student.gender || 'Not Specified'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Messaging Section */}
                        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-600/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                            <h3 className="text-xl font-black italic uppercase mb-6 relative z-10">Direct Message to <span className="text-orange-500">{student.name}</span></h3>
                            <div className="relative z-10 text-slate-800 bg-white p-6 rounded-3xl">
                                <MessagingSystem tutorId={null} studentId={studentId} />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default StudentProfile;