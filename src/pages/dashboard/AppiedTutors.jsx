import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router'; 
import { FaCreditCard, FaCheckCircle, FaClock, FaUserCheck, FaTrashAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const AppliedTutors = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchApplications = () => {
        if (user?.email) {
            const token = localStorage.getItem('access-token');
            axios.get(`http://localhost:3000/hiring-requests-by-student/${user.email}`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            })
                .then(res => {
                    setApplications(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Fetch Error:", err);
                    setLoading(false);
                });
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [user]);

    const handleApprove = async (id) => {
        try {
            const token = localStorage.getItem('access-token');
            const res = await axios.patch(`http://localhost:3000/applications/status/${id}`, 
                { status: 'approved' }, 
                { headers: { authorization: `Bearer ${token}` } }
            );

            if (res.data.modifiedCount > 0) {
                toast.success("Tutor Approved successfully!");
                setApplications(applications.map(app => 
                    app._id === id ? { ...app, status: 'approved' } : app
                ));
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to approve tutor.");
        }
    };

    // --- NEW DELETE FUNCTION ---
    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This application will be removed permanently!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ea580c",
            cancelButtonColor: "#1e293b",
            confirmButtonText: "Yes, delete it!",
            customClass: { popup: 'rounded-3xl' }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem('access-token');
                    const res = await axios.delete(`http://localhost:3000/applications/${id}`, {
                        headers: { authorization: `Bearer ${token}` }
                    });

                    if (res.data.deletedCount > 0) {
                        toast.success("Application deleted.");
                        setApplications(applications.filter(app => app._id !== id));
                    }
                } catch (err) {
                    toast.error("Failed to delete application.");
                }
            }
        });
    };

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
                                    const numericSalary = parseFloat(app.salary) || 0;

                                    return (
                                        <tr key={app._id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50">
                                            <td className="py-4 px-6">
                                                <div className="font-bold text-slate-800">{app.tutorName || "Anonymous Tutor"}</div>
                                                <div className="text-xs text-slate-400 font-medium">{app.tutorEmail}</div>
                                            </td>
                                            <td>
                                                <span className="font-black text-slate-600 uppercase italic text-sm">
                                                    {app.subject}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="font-bold text-slate-700">
                                                    {app.salary} BDT
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge badge-sm font-black uppercase text-[10px] px-3 py-3 border-none shadow-sm ${
                                                    app.status === 'approved' ? 'bg-amber-100 text-amber-700' : 
                                                    app.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 
                                                    'bg-slate-100 text-slate-500'
                                                }`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    {app.status === 'approved' ? (
                                                        <Link 
                                                            to={`/dashboard/payment/${app._id}`}
                                                            state={{ 
                                                                salary: numericSalary, 
                                                                tutorEmail: app.tutorEmail, 
                                                                subject: app.subject 
                                                            }}
                                                            className="btn btn-sm bg-orange-600 hover:bg-orange-700 text-white border-none rounded-xl gap-2 shadow-md px-4 transition-all"
                                                        >
                                                            <FaCreditCard className="text-xs" />
                                                            Pay Now
                                                        </Link>
                                                    ) : app.status === 'paid' ? (
                                                        <div className="flex items-center justify-center gap-1 text-emerald-600 font-black text-xs uppercase italic">
                                                            <FaCheckCircle />
                                                            Success
                                                        </div>
                                                    ) : (
                                                        <button 
                                                            onClick={() => handleApprove(app._id)}
                                                            className="btn btn-sm bg-slate-900 hover:bg-black text-white border-none rounded-xl gap-2 px-4 text-[10px] font-black uppercase italic transition-all"
                                                        >
                                                            <FaUserCheck className="text-xs text-orange-500" />
                                                            Approve
                                                        </button>
                                                    )}
                                                    
                                                    {/* Delete Button - Hidden if already paid */}
                                                    {app.status !== 'paid' && (
                                                        <button 
                                                            onClick={() => handleDelete(app._id)}
                                                            className="btn btn-sm btn-square bg-red-50 hover:bg-red-100 text-red-600 border-none rounded-xl transition-all"
                                                            title="Delete Request"
                                                        >
                                                            <FaTrashAlt />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AppliedTutors;