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

    const fetchOngoingJobs = useCallback(() => {
        if (user?.email) {
            const token = localStorage.getItem('access-token');
            axios.get(` http://localhost:3000/users/role/${user.email}`)
                .then(res => {
                    const userRole = res.data.role;
                    setRole(userRole);
                    const endpoint = userRole === 'tutor' 
                        ? ` http://localhost:3000/tutor-ongoing/${user.email}`
                        : ` http://localhost:3000/hiring-requests-by-student/${user.email}`;

                    return axios.get(endpoint, {
                        headers: { authorization: `Bearer ${token}` }
                    });
                })
                .then(res => {
                    const activeData = res.data.filter(job => job.status === 'paid');
                    setOngoingJobs(activeData);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Fetch Error:", err);
                    setLoading(false);
                });
        }
    }, [user]);

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
                    const res = await axios.delete(` http://localhost:3000/terminate-contract/${id}`, {
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
            const res = await axios.patch(` http://localhost:3000/update-tuition/${id}`, updatedData, {
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
        <div className="p-4 lg:p-8 w-full">
            <header className="mb-10 text-center lg:text-left">
                <h2 className="text-2xl lg:text-3xl font-black text-slate-800 uppercase italic">
                    {role === 'tutor' ? 'Ongoing Assignments' : 'My Hired Tutors'}
                </h2>
                <p className="text-slate-500 font-medium italic text-sm">Manage active contracts and collaboration details.</p>
            </header>

            {ongoingJobs.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-8 lg:p-16 text-center max-w-2xl mx-auto">
                    <FaCalendarCheck className="text-slate-300 text-5xl mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-700 uppercase">No Active Tuitions</h3>
                    <p className="text-slate-400 text-sm mt-1 italic">When payments are verified, your active sessions will appear here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                    {ongoingJobs.map(job => (
                        <div 
                            key={job._id} 
                            onClick={() => {
                                setSelectedJob(job);
                                document.getElementById('job_modal').showModal();
                            }}
                            className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl transition-all cursor-pointer group flex flex-col"
                        >
                            {/* Card Header - Responsive Flex */}
                            <div className={`${role === 'tutor' ? 'bg-blue-600' : 'bg-orange-600'} p-5 lg:p-6 text-white flex flex-row justify-between items-center gap-2`}>
                                <div className="min-w-0 flex-1">
                                    <span className="bg-black/20 text-[9px] px-2 py-1 rounded-md font-bold uppercase tracking-wider italic">Active</span>
                                    <h3 className="text-lg lg:text-xl font-black uppercase mt-1 leading-tight italic truncate" title={job.subject}>
                                        {job.subject}
                                    </h3>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-[9px] uppercase font-bold opacity-80">Salary</p>
                                    <p className="text-lg font-black leading-none">${job.salary}</p>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-5 lg:p-6 space-y-4">
                                <div className="flex items-center gap-3 text-slate-600 overflow-hidden">
                                    <div className="shrink-0">
                                        {role === 'tutor' ? <FaUserGraduate className="text-blue-600"/> : <FaUserTie className="text-orange-600"/>}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">
                                            {role === 'tutor' ? 'Student Email' : 'Hired Tutor'}
                                        </p>
                                        <span className="text-xs font-bold uppercase truncate">
                                            {role === 'tutor' ? job.studentEmail : (job.tutorName || job.tutorEmail)}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="pt-2 border-t border-slate-50 flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase italic">
                                    <FaInfoCircle className="shrink-0" /> 
                                    <span>Details & Contract</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- Management Modal --- */}
            <dialog id="job_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box p-0 rounded-t-3xl sm:rounded-3xl overflow-hidden bg-white max-w-lg w-full">
                    {selectedJob && (
                        <>
                            <div className="bg-slate-900 p-6 lg:p-8 text-white">
                                <h3 className="text-2xl lg:text-3xl font-black uppercase italic leading-tight mb-1">{selectedJob.subject}</h3>
                                <p className="opacity-70 text-[10px] font-black uppercase tracking-[0.2em]">Contract Management</p>
                            </div>
                            
                            <div className="p-6 lg:p-8 space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <p className="text-[10px] uppercase font-black text-slate-400 mb-1">{role === 'tutor' ? 'Student' : 'Tutor'}</p>
                                        <p className="text-xs font-bold text-slate-700 break-all">{role === 'tutor' ? selectedJob.studentEmail : selectedJob.tutorEmail}</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <p className="text-[10px] uppercase font-black text-slate-400 mb-1">Payment Status</p>
                                        <p className="text-xs font-bold text-green-600 uppercase italic flex items-center gap-1">
                                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                            Verified
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {role === 'student' ? (
                                        <div className="grid grid-cols-1 gap-3">
                                            <button onClick={() => triggerUpdateModal(selectedJob)} className="btn btn-md bg-slate-900 border-none text-white hover:bg-slate-800 rounded-xl font-black uppercase italic text-xs">
                                                <FaEdit /> Update Terms
                                            </button>
                                            <button onClick={() => handleCancelJob(selectedJob._id, selectedJob)} className="btn btn-md bg-red-50 border-none text-red-600 hover:bg-red-100 rounded-xl font-black uppercase italic text-xs">
                                                <FaTrashAlt /> Terminate Session
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                                            <p className="text-blue-600 text-xs font-black uppercase italic mb-1">Assignment Locked</p>
                                            <p className="text-slate-500 text-[10px] leading-relaxed">Changes to salary or subjects must be initiated by the student.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="modal-action p-4 bg-slate-50 border-t border-slate-100">
                                <form method="dialog" className="w-full">
                                    <button className="btn btn-ghost btn-sm w-full font-bold uppercase italic text-slate-400">Dismiss</button>
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