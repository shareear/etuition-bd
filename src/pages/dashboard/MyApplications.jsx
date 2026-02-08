import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { FaTrashAlt, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const MyApplications = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:3000/hiring-requests/${user?.email}`);
            setApplications(res.data);
        } catch (error) {
            console.error("Error fetching applications:", error);
            toast.error("Failed to load applications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.email) fetchApplications();
    }, [user]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to withdraw this application?")) {
            try {
                const res = await axios.delete(`http://localhost:3000/cancel-tuition/${id}`);
                if (res.data.deletedCount > 0) {
                    toast.success("Application withdrawn successfully");
                    setApplications(applications.filter(app => app._id !== id));
                }
            } catch (error) {
                toast.error("Delete failed", error.message);
            }
        }
    };

    if (loading) return <div className="text-center p-20"><span className="loading loading-spinner loading-lg text-orange-600"></span></div>;

    return (
        <div className="bg-white p-6 lg:p-8 rounded-3xl shadow-sm border border-slate-100 max-w-6xl mx-auto">
            <h2 className="text-2xl font-black mb-6 text-slate-800 uppercase italic">
                My Applied Jobs ({applications.length})
            </h2>

            {applications.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No applications found!</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead className="bg-slate-100">
                            <tr className="text-slate-700 uppercase text-[10px] tracking-widest">
                                <th>Subject Info</th>
                                <th>Budget</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((app) => (
                                <tr key={app._id} className="hover:bg-slate-50 transition-colors">
                                    <td>
                                        <div className="font-black text-slate-700 uppercase tracking-tight">
                                            {/* Fix: Ensure the field name matches what is saved in DB */}
                                            {app.subject || "Not Specified"}
                                        </div>
                                        <div className="text-[10px] text-slate-400 font-bold italic">Student: {app.studentEmail}</div>
                                    </td>
                                    <td>
                                        <div className="font-bold text-orange-600">
                                            {/* Fix: Directly show the numeric salary saved from the tuition post */}
                                            {app.salary && app.salary !== "Negotiable" ? `$${app.salary}` : "Negotiable"}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge badge-sm font-black uppercase py-3 px-4 border-none shadow-sm ${
                                            app.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 
                                            app.status === 'paid' ? 'bg-blue-100 text-blue-700' : 
                                            app.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
                                            'bg-amber-100 text-amber-700'
                                        }`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td>
                                        {app.status === 'Pending' ? (
                                            <button onClick={() => handleDelete(app._id)} className="btn btn-ghost btn-xs text-red-500 hover:bg-red-50">
                                                <FaTrashAlt />
                                            </button>
                                        ) : (
                                            <span className="text-[10px] font-bold text-slate-300 uppercase italic">Locked</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyApplications;