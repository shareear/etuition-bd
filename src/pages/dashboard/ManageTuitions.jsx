import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AdminPendingTuitions = () => {
    const [tuitions, setTuitions] = useState([]);
    const API_BASE = "https://etuition-bd-server.vercel.app";
    const token = localStorage.getItem('access-token');

    

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchPending = () => {
        axios.get(`${API_BASE}/admin/pending-tuitions`, {
            headers: { authorization: `Bearer ${token}` }
        })
        .then(res => setTuitions(res.data))
        .catch(err => console.error(err));
    };

    // 🔹 Fetch pending tuitions
    useEffect(() => {
        fetchPending();
    }, [fetchPending]);
    
    // 🔹 Handle Approve / Reject
    const handleStatusChange = (id, status) => {
        axios.patch(`${API_BASE}/tuitions/status/${id}`, 
            { status },
            { headers: { authorization: `Bearer ${token}` } }
        )
        .then(res => {
            if (res.data.modifiedCount > 0) {
                Swal.fire("Success!", `Tuition ${status}`, "success");

                // Remove from UI after update
                setTuitions(tuitions.filter(t => t._id !== id));
            }
        });
    };

    return (
        <div className="p-6 bg-white rounded-2xl shadow">
            <h2 className="text-2xl font-bold mb-6">Pending Tuitions</h2>

            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Subject</th>
                            <th>Class</th>
                            <th>Salary</th>
                            <th>Student Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tuitions.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-6">
                                    No pending tuitions
                                </td>
                            </tr>
                        ) : (
                            tuitions.map(t => (
                                <tr key={t._id}>
                                    <td>{t.subject}</td>
                                    <td>{t.class}</td>
                                    <td>${t.salary}</td>
                                    <td>{t.studentEmail}</td>

                                    <td className="flex gap-2">
                                        <button
                                            onClick={() => handleStatusChange(t._id, 'approved')}
                                            className="btn btn-sm bg-green-500 text-white"
                                        >
                                            Approve
                                        </button>

                                        <button
                                            onClick={() => handleStatusChange(t._id, 'rejected')}
                                            className="btn btn-sm bg-red-500 text-white"
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