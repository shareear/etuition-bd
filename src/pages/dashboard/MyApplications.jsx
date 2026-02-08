import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { FaTrashAlt, FaClock, FaCheckCircle, FaTimesCircle, FaEdit } from 'react-icons/fa';

const MyApplications = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingApplication, setEditingApplication] = useState(null);
    const [formData, setFormData] = useState({ qualifications: '', experience: '', expectedSalary: '' });

    const fetchApplications = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('access-token'); // টোকেন সংগ্রহ
            
            const res = await axios.get(`http://localhost:3000/hiring-requests/${user?.email}`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            setApplications(res.data);
        } catch (error) {
            console.error("Error fetching applications:", error);
            toast.error("Failed to load applications");
        } finally {
            setLoading(false);
        }
    }, [user?.email]);

    useEffect(() => {
        if (user?.email) fetchApplications();
    }, [user?.email, fetchApplications]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to withdraw this application?")) {
            try {
                const token = localStorage.getItem('access-token'); // টোকেন সংগ্রহ
                
                const res = await axios.delete(`http://localhost:3000/cancel-tuition/${id}`, {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                });
                if (res.data.deletedCount > 0) {
                    toast.success("Application withdrawn successfully");
                    setApplications(applications.filter(app => app._id !== id));
                }
            } catch (error) {
                toast.error("Delete failed", error.message);
            }
        }
    };

    const handleEdit = (application) => {
        setEditingApplication(application);
        setFormData({
            qualifications: application.qualifications || '',
            experience: application.experience || '',
            expectedSalary: application.expectedSalary || ''
        });
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleUpdate = () => {
        const token = localStorage.getItem('access-token'); // টোকেন সংগ্রহ
        
        axios.patch(`http://localhost:3000/hiring-requests/${editingApplication._id}`, formData, {
            headers: {
                authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                if (res.data.modifiedCount > 0) {
                    toast.success("Application updated successfully");
                    setApplications(applications.map(app => app._id === editingApplication._id ? { ...app, ...formData } : app));
                    setEditingApplication(null);
                }
            })
            .catch(error => {
                console.error("Update error:", error);
                toast.error("Failed to update application");
            });
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
                                            {app.subject || "Not Specified"}
                                        </div>
                                        <div className="text-[10px] text-slate-400 font-bold italic">Student: {app.studentEmail}</div>
                                    </td>
                                    <td>
                                        <div className="font-bold text-orange-600">
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
                                            <div className="flex items-center">
                                                <button onClick={() => handleEdit(app)} className="btn btn-sm btn-warning mr-2">
                                                    <FaEdit />
                                                </button>
                                                <button onClick={() => handleDelete(app._id)} className="btn btn-sm btn-error text-white">
                                                    <FaTrashAlt />
                                                </button>
                                            </div>
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

            {editingApplication && (
                <div className="mt-10 p-6 bg-slate-50 rounded-3xl border border-slate-200">
                    <h3 className="text-xl font-black text-slate-800 uppercase italic mb-6">Edit Application</h3>
                    <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text font-bold text-[10px] uppercase">Qualifications</span></label>
                                <input
                                    type="text"
                                    name="qualifications"
                                    value={formData.qualifications}
                                    onChange={handleFormChange}
                                    placeholder="Qualifications"
                                    className="input input-bordered rounded-xl"
                                />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text font-bold text-[10px] uppercase">Experience</span></label>
                                <input
                                    type="text"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleFormChange}
                                    placeholder="Experience"
                                    className="input input-bordered rounded-xl"
                                />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text font-bold text-[10px] uppercase">Expected Salary</span></label>
                                <input
                                    type="text"
                                    name="expectedSalary"
                                    value={formData.expectedSalary}
                                    onChange={handleFormChange}
                                    placeholder="Expected Salary"
                                    className="input input-bordered rounded-xl"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex gap-3">
                            <button type="submit" className="btn btn-primary rounded-xl px-8 font-black uppercase italic">Update</button>
                            <button type="button" onClick={() => setEditingApplication(null)} className="btn btn-ghost rounded-xl font-black uppercase italic">Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default MyApplications;