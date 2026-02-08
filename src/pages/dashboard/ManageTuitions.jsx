import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaCheck, FaTimes } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';

const ManageTuitions = () => {
    const { loading } = useAuth(); // চেক করবে ইউজার লগইন অবস্থায় আছে কি না
    const [pendingTuitions, setPendingTuitions] = useState([]);
    const [isDataLoading, setIsDataLoading] = useState(true);

    // ১. সার্ভার থেকে পেন্ডিং টিউটোরিয়ালগুলো নিয়ে আসার ফাংশন
    const fetchPendingTuitions = async () => {
        try {
            setIsDataLoading(true);
            const res = await axios.get('http://localhost:3000/admin/pending-tuitions');
            setPendingTuitions(res.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Could not load pending tuitions");
        } finally {
            setIsDataLoading(false);
        }
    };

    // ২. পেজ লোড হওয়ার সময় ডাটা ফেচ করা
    useEffect(() => {
        if (!loading) {
            fetchPendingTuitions();
        }
    }, [loading]);

    // ৩. স্ট্যাটাস আপডেট (Approve বা Reject) করার ফাংশন
    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const res = await axios.patch(`http://localhost:3000/tuitions/status/${id}`, { status: newStatus });
            if (res.data.modifiedCount > 0) {
                toast.success(`Post has been ${newStatus}!`);
                
                // টেবিল থেকে ওই আইটেমটি রিমুভ করে দেওয়া যাতে পেজ রিফ্রেশ করতে না হয়
                const remaining = pendingTuitions.filter(tuition => tuition._id !== id);
                setPendingTuitions(remaining);
            }
        } catch (error) {
            toast.error("Something went wrong while updating status", error.message);
        }
    };

    // যদি ইউজার বা ডাটা লোড হতে থাকে তবে স্পিনার দেখাবে
    if (loading || isDataLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg text-orange-600"></span>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black mb-6 text-slate-800 uppercase tracking-tight italic">
                Pending Approval <span className="text-orange-600">({pendingTuitions.length})</span>
            </h2>

            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    {/* Table Head */}
                    <thead className="bg-slate-50">
                        <tr className="text-slate-700">
                            <th>Student Info</th>
                            <th>Tuition Details</th>
                            <th>Salary</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    
                    {/* Table Body */}
                    <tbody>
                        {pendingTuitions.map((tuition) => (
                            <tr key={tuition._id} className="hover:bg-slate-50 transition-colors">
                                <td>
                                    <div className="font-bold text-slate-800">{tuition.studentName}</div>
                                    <div className="text-sm opacity-60">{tuition.studentEmail}</div>
                                </td>
                                <td>
                                    <span className="badge badge-ghost font-semibold mb-1">{tuition.subject}</span>
                                    <div className="text-sm">Class: {tuition.class}</div>
                                    <div className="text-xs text-slate-400">{tuition.location}</div>
                                </td>
                                <td className="font-bold text-orange-600">
                                    {tuition.salary} BDT
                                </td>
                                <td>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleStatusUpdate(tuition._id, 'approved')}
                                            className="btn btn-sm btn-success text-white px-4"
                                            title="Approve"
                                        >
                                            <FaCheck />
                                        </button>
                                        <button 
                                            onClick={() => handleStatusUpdate(tuition._id, 'rejected')}
                                            className="btn btn-sm btn-error text-white px-4"
                                            title="Reject"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* যদি কোনো পেন্ডিং ডাটা না থাকে */}
                {pendingTuitions.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-slate-400 text-lg">No pending tuitions to review! 🎉</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageTuitions;