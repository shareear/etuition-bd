import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import { FaMapMarkerAlt, FaCalendarCheck, FaPhoneAlt, FaEnvelope, FaTrashAlt, FaEdit, FaInfoCircle } from 'react-icons/fa';
import Swal from 'sweetalert2'; // SweetAlert2 ইমপোর্ট করা হয়েছে

const OngoingTuitions = () => {
    const { user } = useAuth();
    const [ongoingJobs, setOngoingJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);

    const fetchOngoingJobs = () => {
        if (user?.email) {
            axios.get(`http://localhost:3000/tutor-ongoing/${user?.email}`)
                .then(res => {
                    setOngoingJobs(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    };

    useEffect(() => {
        fetchOngoingJobs();
    }, [user]);

    // SweetAlert2 দিয়ে জব ক্যানসেল করার ফাংশন
    const handleCancelJob = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You are about to cancel this tuition. This will notify the student!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, cancel it!",
            background: "#fff",
            color: "#1e293b",
            customClass: {
                popup: 'rounded-3xl',
                confirmButton: 'rounded-xl px-6 py-3 font-bold',
                cancelButton: 'rounded-xl px-6 py-3 font-bold'
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.delete(`http://localhost:3000/cancel-tuition/${id}`);
                    if (res.data.deletedCount > 0) {
                        // Success Message
                        Swal.fire({
                            title: "Cancelled!",
                            text: "The tuition has been terminated.",
                            icon: "success",
                            timer: 2000,
                            showConfirmButton: false
                        });
                        
                        setOngoingJobs(ongoingJobs.filter(job => job._id !== id));
                        setSelectedJob(null);
                        document.getElementById('job_modal').close();
                    }
                } catch (err) {
                    // Error Message
                    Swal.fire({
                        title: "Error!",
                        text: "Something went wrong while cancelling.",
                        icon: "error"
                    });
                }
            }
        });
    };

    if (loading) return <div className="flex justify-center p-20"><span className="loading loading-spinner loading-lg"></span></div>;

    return (
        <div className="p-4 lg:p-8">
            <header className="mb-10">
                <h2 className="text-3xl font-black text-slate-800 uppercase italic">Ongoing Tuitions</h2>
                <p className="text-slate-500 font-medium">Manage your active teaching assignments and student contacts.</p>
            </header>

            {ongoingJobs.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center">
                    <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaCalendarCheck className="text-slate-400 text-2xl" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 uppercase">No Active Tuitions</h3>
                    <p className="text-slate-400 text-sm mt-1">Wait for students to approve your applications after payment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {ongoingJobs.map(job => (
                        <div 
                            key={job._id} 
                            onClick={() => {
                                setSelectedJob(job);
                                document.getElementById('job_modal').showModal();
                            }}
                            className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer group"
                        >
                            <div className="bg-green-600 p-6 text-white flex justify-between items-start group-hover:bg-green-700 transition-colors">
                                <div>
                                    <span className="bg-green-700/50 text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider">Active Job</span>
                                    <h3 className="text-2xl font-black uppercase mt-2 leading-none italic">{job.subject}</h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] uppercase font-bold opacity-80">Salary</p>
                                    <p className="text-xl font-black">${job.salary || job.expectedSalary}</p>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="flex items-center gap-3 text-slate-600">
                                    <FaMapMarkerAlt className="text-green-600"/>
                                    <span className="text-sm font-bold uppercase tracking-tight">{job.location || "Remote / Not Specified"}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-500 text-xs font-bold">
                                    <FaInfoCircle /> Click to manage details
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- Management Modal --- */}
            <dialog id="job_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box p-0 rounded-3xl overflow-hidden bg-white">
                    {selectedJob && (
                        <>
                            <div className="bg-slate-800 p-8 text-white">
                                <h3 className="text-3xl font-black uppercase italic">{selectedJob.subject}</h3>
                                <p className="opacity-70 text-sm font-bold">Manage Tuition Terms & Contact</p>
                            </div>
                            
                            <div className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 p-4 rounded-2xl">
                                        <p className="text-[10px] uppercase font-black text-slate-400">Student Email</p>
                                        <p className="text-sm font-bold text-slate-700 truncate">{selectedJob.studentEmail}</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-2xl">
                                        <p className="text-[10px] uppercase font-black text-slate-400">Salary Status</p>
                                        <p className="text-sm font-bold text-green-600 uppercase">Paid</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <button className="btn btn-block bg-slate-100 border-none text-slate-700 hover:bg-slate-200 rounded-2xl font-black uppercase italic">
                                        <FaEdit /> Update Terms (Coming Soon)
                                    </button>
                                    
                                    <button 
                                        onClick={() => handleCancelJob(selectedJob._id)}
                                        className="btn btn-block bg-red-50 border-none text-red-600 hover:bg-red-100 rounded-2xl font-black uppercase italic"
                                    >
                                        <FaTrashAlt /> Cancel This Tuition
                                    </button>
                                </div>
                            </div>
                            
                            <div className="modal-action p-4 bg-slate-50">
                                <form method="dialog" className="w-full">
                                    <button className="btn btn-ghost w-full font-bold uppercase">Close</button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </dialog>
        </div>
    );
};

export default OngoingTuitions;