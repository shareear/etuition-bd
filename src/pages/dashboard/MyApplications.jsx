import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { FaTrashAlt, FaClock, FaEdit } from 'react-icons/fa';

const MyApplications = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingApp, setEditingApp] = useState(null);
    const [formData, setFormData] = useState({ subject: '', salary: '' });

    const fetchApplications = useCallback(async () => {
        if (!user?.email) return;
        try {
            setLoading(true);
            const token = localStorage.getItem('access-token');
            // FIX: Changed endpoint to match the TUTOR'S email lookup
            const res = await axios.get(`http://localhost:3000/hiring-requests-by-tutor/${user?.email}`, {
                headers: { authorization: `Bearer ${token}` }
            });
            setApplications(res.data);
        } catch (error) {
            console.error("Fetch Error:", error);
            toast.error("Failed to load applications");
        } finally {
            setLoading(false);
        }
    }, [user?.email]);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to withdraw this application?")) return;
        try {
            const token = localStorage.getItem('access-token');
            const res = await axios.delete(`http://localhost:3000/cancel-tuition/${id}`, {
                headers: { authorization: `Bearer ${token}` }
            });
            if (res.data.deletedCount > 0) {
                toast.success("Application withdrawn.");
                setApplications(applications.filter(app => app._id !== id));
            }
        } catch (err) {
            toast.error("Withdrawal failed.");
        }
    };

    const handleEdit = (app) => {
        setEditingApp(app);
        setFormData({ subject: app.subject, salary: app.salary });
    };

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem('access-token');
            const res = await axios.patch(`http://localhost:3000/update-tuition/${editingApp._id}`, formData, {
                headers: { authorization: `Bearer ${token}` }
            });
            if (res.data.modifiedCount > 0) {
                toast.success("Updated successfully!");
                setApplications(applications.map(a => a._id === editingApp._id ? { ...a, ...formData } : a));
                setEditingApp(null);
            }
        } catch (err) {
            toast.error("Update failed.");
        }
    };

    if (loading) return <div className="text-center p-20"><span className="loading loading-spinner loading-lg text-orange-600"></span></div>;

    return (
        <div className="bg-white p-6 lg:p-8 rounded-3xl shadow-sm border border-slate-100 max-w-6xl mx-auto">
            <header className="mb-6">
                <h2 className="text-2xl font-black text-slate-800 uppercase italic">My Applications ({applications.length})</h2>
            </header>

            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead className="bg-slate-50">
                        <tr className="text-slate-500 uppercase text-[10px] tracking-widest">
                            <th>Subject Info</th>
                            <th>Salary (BDT)</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.length > 0 ? (
                            applications.map((app) => (
                                <tr key={app._id} className="hover:bg-slate-50 transition-colors">
                                    <td>
                                        <div className="font-black text-slate-700 uppercase italic">{app.subject}</div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">ID: {app._id}</div>
                                    </td>
                                    <td className="font-bold text-orange-600">${app.salary}</td>
                                    <td>
                                        <span className={`badge font-black uppercase text-[10px] py-3 px-4 border-none shadow-sm ${app.status === 'paid' ? 'badge-success text-white' : 'badge-warning'}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td>
                                        {app.status !== 'paid' ? (
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEdit(app)} className="btn btn-sm btn-square btn-ghost text-slate-400 hover:text-orange-600"><FaEdit /></button>
                                                <button onClick={() => handleDelete(app._id)} className="btn btn-sm btn-square btn-ghost text-slate-400 hover:text-red-600"><FaTrashAlt /></button>
                                            </div>
                                        ) : <span className="text-[10px] font-bold text-slate-300 uppercase italic">Locked</span>}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-10 font-bold text-slate-400 uppercase italic">No applications found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {editingApp && (
                <div className="mt-10 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                    <h3 className="font-black uppercase italic text-sm mb-4">Edit Application Details</h3>
                    <div className="flex flex-wrap gap-4">
                        <input className="input input-bordered rounded-xl" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} />
                        <input className="input input-bordered rounded-xl" value={formData.salary} onChange={(e) => setFormData({...formData, salary: e.target.value})} />
                        <button onClick={handleUpdate} className="btn bg-slate-900 text-white hover:bg-black rounded-xl px-8 font-black uppercase italic">Save Changes</button>
                        <button onClick={() => setEditingApp(null)} className="btn btn-ghost font-black uppercase italic">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyApplications;