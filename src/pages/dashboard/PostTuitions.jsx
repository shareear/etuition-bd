import React from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';
import Swal from 'sweetalert2'; 

const PostTuition = () => {
    const { user } = useAuth();
    const { register, handleSubmit, reset } = useForm();

    const onSubmit = async (data) => {
        const tuitionInfo = {
            ...data,
            studentName: user?.displayName,
            studentEmail: user?.email,
            salary: parseFloat(data.salary), // Ensure salary is a number
            status: 'pending',
            postedDate: new Date().toISOString()
        };

        try {
            const token = localStorage.getItem('access-token');
            const res = await axios.post(' https://etuition-bd-server.vercel.app//tuitions', tuitionInfo, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            
            if (res.data.insertedId) {
                Swal.fire({
                    title: "Success!",
                    text: "Your tuition post has been submitted for review.",
                    icon: "success",
                    confirmButtonColor: "#ea580c", 
                    confirmButtonText: "Great!"
                });
                reset();
            }
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: "Something went wrong. Please try again.",
                icon: "error",
                confirmButtonColor: "#d33"
            });
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            {/* Added responsive padding and rounded corners */}
            <div className="bg-white p-5 sm:p-8 lg:p-10 rounded-3xl sm:rounded-[2.5rem] shadow-sm border border-slate-100">
                <header className="mb-8 text-center sm:text-left">
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-800 uppercase italic leading-none">
                        Post New Tuition
                    </h2>
                    <p className="text-slate-500 mt-2 font-medium text-sm sm:text-base">
                        Fill in the details to find the best tutor for your needs.
                    </p>
                </header>

                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="form-control w-full">
                        <label className="label font-bold text-[10px] sm:text-xs uppercase text-slate-400 tracking-widest">Subject</label>
                        <input {...register("subject")} placeholder="e.g. Physics" className="input input-bordered focus:border-orange-500 outline-none transition-all w-full" required />
                    </div>

                    <div className="form-control w-full">
                        <label className="label font-bold text-[10px] sm:text-xs uppercase text-slate-400 tracking-widest">Class/Level</label>
                        <input {...register("class")} placeholder="e.g. Class 10" className="input input-bordered focus:border-orange-500 outline-none transition-all w-full" required />
                    </div>

                    <div className="form-control w-full">
                        <label className="label font-bold text-[10px] sm:text-xs uppercase text-slate-400 tracking-widest">Budget/Salary ($)</label>
                        <input {...register("salary")} type="number" placeholder="e.g. 5000" className="input input-bordered focus:border-orange-500 outline-none transition-all w-full" required />
                    </div>

                    <div className="form-control w-full">
                        <label className="label font-bold text-[10px] sm:text-xs uppercase text-slate-400 tracking-widest">Location</label>
                        <input {...register("location")} placeholder="e.g. Mirpur, Dhaka" className="input input-bordered focus:border-orange-500 outline-none transition-all w-full" required />
                    </div>

                    <div className="form-control md:col-span-2 w-full">
                        <label className="label font-bold text-[10px] sm:text-xs uppercase text-slate-400 tracking-widest">Additional Details</label>
                        <textarea {...register("description")} className="textarea textarea-bordered h-24 sm:h-32 focus:border-orange-500 outline-none transition-all w-full" placeholder="Tell us about time, days per week, and tutor requirements..."></textarea>
                    </div>

                    <button className="btn bg-orange-600 hover:bg-orange-700 text-white md:col-span-2 border-none rounded-2xl uppercase font-black italic tracking-widest h-14 mt-2 transition-all shadow-lg shadow-orange-100">
                        Publish Tuition Post
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PostTuition;