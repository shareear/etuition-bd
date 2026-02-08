import React from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';
import Swal from 'sweetalert2'; // ১. SweetAlert2 ইমপোর্ট করুন

const PostTuition = () => {
    const { user } = useAuth();
    const { register, handleSubmit, reset } = useForm();

    const onSubmit = async (data) => {
        const tuitionInfo = {
            ...data,
            studentName: user?.displayName,
            studentEmail: user?.email,
            status: 'pending',
            postedDate: new Date().toISOString()
        };

        try {
            const res = await axios.post('http://localhost:3000/tuitions', tuitionInfo);
            
            if (res.data.insertedId) {
                // ২. SweetAlert2 কনফার্মেশন ডায়ালগ
                Swal.fire({
                    title: "Success!",
                    text: "Your tuition post has been submitted for review.",
                    icon: "success",
                    confirmButtonColor: "#ea580c", // orange-600
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
        <div className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100 max-w-3xl mx-auto">
            <header className="mb-8">
                <h2 className="text-3xl font-black text-slate-800 uppercase italic leading-none">Post New Tuition</h2>
                <p className="text-slate-500 mt-2 font-medium">Fill in the details to find the best tutor for your needs.</p>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="form-control">
                    <label className="label font-bold text-xs uppercase text-slate-500">Subject</label>
                    <input {...register("subject")} placeholder="e.g. Physics" className="input input-bordered focus:border-orange-500 outline-none transition-all" required />
                </div>

                <div className="form-control">
                    <label className="label font-bold text-xs uppercase text-slate-500">Class/Level</label>
                    <input {...register("class")} placeholder="e.g. Class 10" className="input input-bordered focus:border-orange-500 outline-none transition-all" required />
                </div>

                <div className="form-control">
                    <label className="label font-bold text-xs uppercase text-slate-500">Budget/Salary ($)</label>
                    <input {...register("salary")} type="number" placeholder="e.g. 5000" className="input input-bordered focus:border-orange-500 outline-none transition-all" required />
                </div>

                <div className="form-control">
                    <label className="label font-bold text-xs uppercase text-slate-500">Location</label>
                    <input {...register("location")} placeholder="e.g. Mirpur, Dhaka" className="input input-bordered focus:border-orange-500 outline-none transition-all" required />
                </div>

                <div className="form-control md:col-span-2">
                    <label className="label font-bold text-xs uppercase text-slate-500">Additional Details</label>
                    <textarea {...register("description")} className="textarea textarea-bordered h-32 focus:border-orange-500 outline-none transition-all" placeholder="Tell us about time, days per week, and tutor requirements..."></textarea>
                </div>

                <button className="btn bg-orange-600 hover:bg-orange-700 text-white md:col-span-2 border-none rounded-xl uppercase font-black italic tracking-widest h-14 mt-4 transition-all shadow-lg shadow-orange-200">
                    Publish Tuition Post
                </button>
            </form>
        </div>
    );
};

export default PostTuition;