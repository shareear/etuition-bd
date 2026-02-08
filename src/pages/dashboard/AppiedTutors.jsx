import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router'; 
import { FaCreditCard, FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa';

const AppliedTutors = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.email) {
            axios.get(`http://localhost:3000/hiring-requests-by-student/${user.email}`)
                .then(res => {
                    setApplications(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Fetch Error:", err);
                    setLoading(false);
                });
        }
    }, [user]);

    if (loading) return (
        <div className="flex justify-center items-center min-h-100">
            <span className="loading loading-spinner loading-lg text-orange-600"></span>
        </div>
    );

    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            <header className="mb-10">
                <h2 className="text-3xl font-black text-slate-800 uppercase italic tracking-tight">
                    Applied Tutors
                </h2>
                <p className="text-slate-500 font-medium mt-1">
                    Manage your applications and complete payments for approved tutors.
                </p>
            </header>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table w-full border-collapse">
                        <thead className="bg-slate-50">
                            <tr className="text-slate-500 uppercase text-[10px] tracking-widest border-b border-slate-100">
                                <th className="py-5 px-6">Tutor Details</th>
                                <th>Subject</th>
                                <th>Salary</th>
                                <th>Status</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-20">
                                        <div className="flex flex-col items-center opacity-30">
                                            <FaClock className="text-5xl mb-4" />
                                            <p className="font-black uppercase italic text-xl">No applications found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                applications.map((app) => {
                                    // SAFETY LOGIC: Convert string salary like "$1000" or "Negotiable" to number
                                    const rawSalary = app.salary ? app.salary.toString().replace(/[$,]/g, '') : "0";
                                    const isNegotiable = isNaN(parseFloat(rawSalary)) || parseFloat(rawSalary) <= 0;
                                    const numericSalary = isNegotiable ? 0 : parseFloat(rawSalary);

                                    return (
                                        <tr key={app._id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50">
                                            <td className="py-4 px-6">
                                                <div className="font-bold text-slate-800">{app.tutorName || "Anonymous Tutor"}</div>
                                                <div className="text-xs text-slate-400 font-medium">{app.tutorEmail}</div>
                                            </td>
                                            <td>
                                                <span className="font-black text-slate-600 uppercase italic text-sm">
                                                    {app.subject || "Not Specified"}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="font-bold text-slate-700">
                                                    {isNegotiable ? (
                                                        <span className="text-orange-500 flex items-center gap-1 text-xs">
                                                            <FaExclamationTriangle /> Negotiable
                                                        </span>
                                                    ) : (
                                                        `$${numericSalary}`
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge badge-sm font-black uppercase text-[10px] px-3 py-3 border-none shadow-sm ${
                                                    app.status === 'Approved' ? 'bg-amber-100 text-amber-700' : 
                                                    app.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 
                                                    'bg-slate-100 text-slate-500'
                                                }`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                {/* ACTION BUTTONS */}
                                                {app.status === 'Approved' ? (
                                                    isNegotiable ? (
                                                        <button 
                                                            disabled
                                                            className="btn btn-sm opacity-50 cursor-not-allowed rounded-xl text-[10px] font-bold uppercase"
                                                            title="Salary must be fixed before payment"
                                                        >
                                                            Wait for Price
                                                        </button>
                                                    ) : (
                                                        <Link 
                                                            to={`/dashboard/payment/${app._id}`}
                                                            state={{ 
                                                                salary: numericSalary, 
                                                                tutorEmail: app.tutorEmail, 
                                                                subject: app.subject || "Tuition Fee" 
                                                            }}
                                                            className="btn btn-sm bg-orange-600 hover:bg-orange-700 text-white border-none rounded-xl gap-2 shadow-md shadow-orange-100 px-4"
                                                        >
                                                            <FaCreditCard className="text-xs" />
                                                            Pay Now
                                                        </Link>
                                                    )
                                                ) : app.status === 'paid' ? (
                                                    <div className="flex items-center justify-center gap-1 text-emerald-600 font-black text-xs uppercase italic">
                                                        <FaCheckCircle />
                                                        Success
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center gap-1 text-slate-400 font-bold text-[10px] uppercase italic">
                                                        <FaClock />
                                                        Pending
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <p className="mt-6 text-slate-400 text-xs text-center font-medium">
                * If salary is "Negotiable", please contact the tutor to fix a price before payment.
            </p>
        </div>
    );
};

export default AppliedTutors;