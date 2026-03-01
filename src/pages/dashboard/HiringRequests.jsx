import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaCheck, FaTimes } from 'react-icons/fa';

const HiringRequests = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.email) {
            // লোকাল স্টোরেজ থেকে টোকেন সংগ্রহ
            const token = localStorage.getItem('access-token');

            axios.get(` https://etuition-bd-server.vercel.app//hiring-requests/${user?.email}`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            })
                .then(res => {
                    setRequests(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching requests:", err);
                    setLoading(false);
                });
        }
    }, [user?.email]);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            // আপডেট করার সময়ও টোকেন প্রয়োজন
            const token = localStorage.getItem('access-token');

            const res = await axios.patch(` https://etuition-bd-server.vercel.app//hiring-requests/status/${id}`, 
                { status: newStatus },
                {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                }
            );

            if (res.data.modifiedCount > 0) {
                toast.success(`Request ${newStatus} successfully!`);
                // লোকাল স্টেট আপডেট করা যাতে পেজ রিফ্রেশ না লাগে
                setRequests(requests.map(req => req._id === id ? { ...req, status: newStatus } : req));
            }
        } catch (error) {
            toast.error("Failed to update status");
            console.error(error);
        }
    };

    if (loading) return <div className="text-center py-20"><span className="loading loading-spinner loading-lg"></span></div>;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <h2 className="text-2xl font-bold mb-6">Student Hiring Requests ({requests.length})</h2>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th>Student</th>
                            <th>Applied Date</th>
                            <th>Subject</th>
                            <th>Salary</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request) => (
                            <tr key={request._id}>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle w-12 h-12">
                                                <img src={request.studentPhoto} alt="Student" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold">{request.studentName}</div>
                                            <div className="text-sm opacity-50">{request.studentEmail}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{new Date(request.appliedDate).toLocaleDateString()}</td>
                                <td>{request.subject || "Not Specified"}</td>
                                <td>${request.salary || "0"}</td>
                                <td>
                                    <span className={`badge font-semibold ${
                                        request.status === 'Approved' ? 'badge-success text-white' : 
                                        request.status === 'Rejected' ? 'badge-error text-white' : 'badge-ghost'
                                    }`}>
                                        {request.status}
                                    </span>
                                </td>
                                <td>
                                    {request.status === 'Pending' ? (
                                        <div className="flex gap-2">
                                            <button onClick={() => handleStatusUpdate(request._id, 'Approved')} className="btn btn-sm btn-success text-white"><FaCheck /></button>
                                            <button onClick={() => handleStatusUpdate(request._id, 'Rejected')} className="btn btn-sm btn-error text-white"><FaTimes /></button>
                                        </div>
                                    ) : (
                                        <span className="text-xs italic text-gray-400">Processed</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {requests.length === 0 && <p className="text-center py-10 text-gray-400">No requests found yet.</p>}
            </div>
        </div>
    );
};

export default HiringRequests;