import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import { FaMapMarkerAlt, FaCalendarCheck, FaTrashAlt, FaEdit, FaInfoCircle, FaUserGraduate, FaUserTie } from 'react-icons/fa';
import Swal from 'sweetalert2';

const OngoingTuitions = () => {
    const { user } = useAuth();
    const [ongoingJobs, setOngoingJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);
    const [role, setRole] = useState('');

    // Fixed the dependency alignment to satisfy the React Compiler
    const fetchOngoingJobs = useCallback(() => {
        if (user?.email) {
            const token = localStorage.getItem('access-token');
            
            // Step 1: Detect user role
            axios.get(`http://localhost:3000/users/role/${user.email}`)
                .then(res => {
                    const userRole = res.data.role;
                    setRole(userRole);
                    
                    // Step 2: Determine correct endpoint based on role
                    const endpoint = userRole === 'tutor' 
                        ? `http://localhost:3000/tutor-ongoing/${user.email}`
                        : `http://localhost:3000/hiring-requests-by-student/${user.email}`;

                    return axios.get(endpoint, {
                        headers: { authorization: `Bearer ${token}` }
                    });
                })
                .then(res => {
                    // Step 3: Filter for active (paid) contracts only
                    const activeData = res.data.filter(job => job.status === 'paid');
                    setOngoingJobs(activeData);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Fetch Error:", err);
                    setLoading(false);
                });
        }
    }, [user]); // Matches the inferred dependency to fix the compiler warning

    useEffect(() => {
        fetchOngoingJobs();
    }, [fetchOngoingJobs]);

    const handleCancelJob = (id, job) => {
        Swal.fire({
            title: "Terminate Contract?",
            text: "This will permanently end this tuition session and notify the other party.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, terminate!",
            customClass: { popup: 'rounded-3xl' }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem('access-token');
                    const res = await axios.delete(`http://localhost:3000/terminate-contract/${id}`, {
                        data: { 
                            tutorEmail: job.tutorEmail, 
                            studentEmail: job.studentEmail, 
                            subject: job.subject 
                        },
                        headers: { authorization: `Bearer ${token}` }
                    });

                    if (res.data.deletedCount > 0) {
                        Swal.fire({
                            title: "Terminated!",
                            text: "The contract has been removed from both dashboards.",
                            icon: "success",
                            timer: 2000,
                            showConfirmButton: false
                        });
                        setOngoingJobs(ongoingJobs.filter(item => item._id !== id));
                        document.getElementById('job_modal').close();
                    }
                } catch (err) {
                    Swal.fire("Error!", "Failed to terminate the contract.", "error", err.message);
                }
            }
        });
    };

    const handleUpdateJob = async (id, updatedData) => {
        try {
            const token = localStorage.getItem('access-token');
            const res = await axios.patch(`http://localhost:3000/update-tuition/${id}`, updatedData, {
                headers: { authorization: `Bearer ${token}` }
            });
            if (res.data.modifiedCount > 0) {
                Swal.fire("Updated!", "Tuition details updated successfully.", "success");
                fetchOngoingJobs();
                document.getElementById('job_modal').close();
            }
        } catch {
            Swal.fire("Error!", "Update failed.", "error");
        }
    };

    const triggerUpdateModal = (job) => {
        Swal.fire({
            title: 'Update Tuition Terms',
            html:
                `<input id="swal-input1" class="swal2-input" placeholder="Subject" value="${job.subject}">` +
                `<input id="swal-input2" class="swal2-input" placeholder="Salary" value="${job.salary}">`,
            showCancelButton: true,
            confirmButtonText: 'Update Now',
            preConfirm: () => ({
                subject: document.getElementById('swal-input1').value,
                salary: document.getElementById('swal-input2').value
            })
        }).then((result) => {
            if (result.isConfirmed) handleUpdateJob(job._id, result.value);
        });
    };

    if (loading) return <div className="flex justify-center p-20"><span className="loading loading-spinner loading-lg text-orange-600"></span></div>;

    return (
        <div className="p-4 lg:p-8">
            <header className="mb-10">
                <h2 className="text-3xl font-black text-slate-800 uppercase italic">
                    {role === 'tutor' ? 'Ongoing Assignments' : 'My Hired Tutors'}
                </h2>
                <p className="text-slate-500 font-medium italic">Manage active contracts and collaboration details.</p>
            </header>

            {ongoingJobs.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center">
                    <FaCalendarCheck className="text-slate-300 text-5xl mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-700 uppercase">No Active Tuitions</h3>
                    <p className="text-slate-400 text-sm mt-1 italic">When payments are verified, your active sessions will appear here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ongoingJobs.map(job => (
                        <div 
                            key={job._id} 
                            onClick={() => {
                                setSelectedJob(job);
                                document.getElementById('job_modal').showModal();
                            }}
                            className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
                        >
                            <div className={`${role === 'tutor' ? 'bg-blue-600' : 'bg-orange-600'} p-6 text-white flex justify-between items-start transition-colors`}>
                                <div>
                                    <span className="bg-black/20 text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider italic">Active Session</span>
                                    <h3 className="text-2xl font-black uppercase mt-2 leading-none italic">{job.subject}</h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] uppercase font-bold opacity-80">Monthly</p>
                                    <p className="text-xl font-black">${job.salary}</p>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="flex items-center gap-3 text-slate-600">
                                    {role === 'tutor' ? <FaUserGraduate className="text-blue-600"/> : <FaUserTie className="text-orange-600"/>}
                                    <span className="text-sm font-bold uppercase truncate">
                                        {role === 'tutor' ? job.studentEmail : (job.tutorName || job.tutorEmail)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-400 text-xs font-bold uppercase italic">
                                    <FaInfoCircle /> Click to manage contract
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
                            <div className="bg-slate-900 p-8 text-white">
                                <h3 className="text-3xl font-black uppercase italic">{selectedJob.subject}</h3>
                                <p className="opacity-70 text-sm font-bold uppercase tracking-widest">Contract Details</p>
                            </div>
                            
                            <div className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 p-4 rounded-2xl">
                                        <p className="text-[10px] uppercase font-black text-slate-400">{role === 'tutor' ? 'Student' : 'Tutor'}</p>
                                        <p className="text-xs font-bold text-slate-700 truncate">{role === 'tutor' ? selectedJob.studentEmail : selectedJob.tutorEmail}</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-2xl">
                                        <p className="text-[10px] uppercase font-black text-slate-400">Status</p>
                                        <p className="text-xs font-bold text-green-600 uppercase italic">Paid & Verified</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {role === 'student' ? (
                                        <>
                                            <button onClick={() => triggerUpdateModal(selectedJob)} className="btn btn-block bg-slate-100 border-none text-slate-700 hover:bg-slate-200 rounded-2xl font-black uppercase italic">
                                                <FaEdit /> Update Terms
                                            </button>
                                            <button onClick={() => handleCancelJob(selectedJob._id, selectedJob)} className="btn btn-block bg-red-50 border-none text-red-600 hover:bg-red-100 rounded-2xl font-black uppercase italic">
                                                <FaTrashAlt /> Terminate Contract
                                            </button>
                                        </>
                                    ) : (
                                        <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex flex-col items-center gap-2 text-center">
                                            <p className="text-blue-600 text-xs font-black uppercase italic">Assignment In Progress</p>
                                            <p className="text-slate-500 text-[10px] font-medium">To modify salary or subject, please contact the student.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="modal-action p-4 bg-slate-50">
                                <form method="dialog" className="w-full">
                                    <button className="btn btn-ghost w-full font-bold uppercase italic text-slate-400">Close Details</button>
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