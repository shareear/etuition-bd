import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AdminPendingTuitions = () => {
    const [tuitions, setTuitions] = useState([]);
    const API_BASE = "http://localhost:3000"; 
    const token = localStorage.getItem('access-token');

    // 🔹 Fetch pending tuitions
    const fetchPending = useCallback(() => {
        // MATCHED TO BACKEND: app.get('/admin/pending-tuitions', ...)
        axios.get(`${API_BASE}/admin/pending-tuitions`, {
            headers: { authorization: `Bearer ${token}` }
        })
        .then(res => {
            setTuitions(Array.isArray(res.data) ? res.data : []);
        })
        .catch(err => {
            console.error("Fetch Error:", err);
        });
    }, [token]);

    useEffect(() => {
        fetchPending();
    }, [fetchPending]);
    
    // 🔹 Handle Approve / Reject
    const handleStatusChange = (id, status) => {
        // MATCHED TO BACKEND: app.patch('/tuitions/status/:id', ...)
        axios.patch(`${API_BASE}/tuitions/status/${id}`, 
            { status },
            { headers: { authorization: `Bearer ${token}` } }
        )
        .then(res => {
            if (res.data.modifiedCount > 0) {
                Swal.fire({
                    title: "Success!",
                    text: `Tuition has been ${status}`,
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });

                // Remove from the local list since it's no longer "pending"
                setTuitions(tuitions.filter(t => t._id !== id));
            }
        })
        .catch(err => {
            console.error("Update Error:", err);
            Swal.fire("Error", "Failed to update status", "error");
        });
    };

    return (
        <div className="p-6 bg-white rounded-2xl shadow">
            <h2 className="text-2xl font-bold mb-6 uppercase italic">Pending <span className="text-orange-600">Tuitions</span></h2>

            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr className="bg-slate-900 text-white">
                            <th className="rounded-tl-xl">Subject</th>
                            <th>Class</th>
                            <th>Salary</th>
                            <th>Student Email</th>
                            <th className="rounded-tr-xl">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tuitions.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-20 text-gray-400 font-bold uppercase italic">
                                    No pending tuitions available for approval.
                                </td>
                            </tr>
                        ) : (
                            tuitions.map(t => (
                                <tr key={t._id} className="hover:bg-gray-50 transition-colors border-b">
                                    <td className="font-bold text-slate-800 uppercase italic">{t.subject}</td>
                                    <td className="font-medium">{t.class}</td>
                                    <td className="text-orange-600 font-black">৳{t.salary}</td>
                                    <td className="text-slate-500 text-sm">{t.studentEmail}</td>

                                    <td className="flex gap-2">
                                        <button
                                            onClick={() => handleStatusChange(t._id, 'approved')}
                                            className="btn btn-sm bg-green-500 hover:bg-green-600 text-white border-none rounded-lg px-4"
                                        >
                                            Approve
                                        </button>

                                        <button
                                            onClick={() => handleStatusChange(t._id, 'rejected')}
                                            className="btn btn-sm bg-red-500 hover:bg-red-600 text-white border-none rounded-lg px-4"
                                        >
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPendingTuitions;