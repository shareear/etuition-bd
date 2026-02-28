import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash } from 'react-icons/fa';

const MyPosts = () => {
    const { user } = useAuth();
    const [myPosts, setMyPosts] = useState([]);
    const [editingPost, setEditingPost] = useState(null);
    const [formData, setFormData] = useState({ subject: '', class: '', salary: '', location: '' });

    useEffect(() => {
        if (user?.email) {
            axios.get(` https://etuition-bd-server.vercel.app/tuitions?email=${user.email}`)
                .then(res => setMyPosts(res.data));
        }
    }, [user]);

    const handleDelete = (id) => {
        const token = localStorage.getItem('access-token'); // Get Token
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(` https://etuition-bd-server.vercel.app/tuitions/${id}`, {
                    headers: { authorization: `Bearer ${token}` } // Send Token
                })
                .then(res => {
                    if (res.data.deletedCount > 0) {
                        Swal.fire("Deleted!", "Your post has been deleted.", "success");
                        setMyPosts(myPosts.filter(post => post._id !== id));
                    }
                });
            }
        });
    };

    const handleEdit = (post) => {
        setEditingPost(post);
        setFormData({
            subject: post.subject,
            class: post.class,
            salary: post.salary,
            location: post.location
        });
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleUpdate = () => {
        const token = localStorage.getItem('access-token'); // Get Token
        axios.patch(` https://etuition-bd-server.vercel.app/tuitions/${editingPost._id}`, formData, {
            headers: { authorization: `Bearer ${token}` } // Send Token
        })
        .then(res => {
            if (res.data.modifiedCount > 0) {
                Swal.fire("Updated!", "Your post has been updated.", "success");
                setMyPosts(myPosts.map(post => post._id === editingPost._id ? { ...post, ...formData } : post));
                setEditingPost(null);
            }
        });
    };

    return (
        <div className="overflow-x-auto bg-white p-6 rounded-2xl shadow">
            <h2 className="text-2xl font-bold mb-6 text-orange-600 uppercase italic">Tuition Posts To Manage</h2>
            <table className="table w-full">
                <thead className="bg-slate-100">
                    <tr className="uppercase text-xs text-slate-600">
                        <th>Subject</th>
                        <th>Class</th>
                        <th>Salary</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {myPosts.map(post => (
                        <tr key={post._id} className="hover:bg-slate-50 transition-colors">
                            <td className="font-bold">{post.subject}</td>
                            <td>{post.class}</td>
                            <td className="text-orange-600 font-bold">{post.salary} BDT</td>
                            <td>{post.location}</td>
                            <td>
                                <span className={`badge ${post.status === 'approved' ? 'badge-success' : 'badge-warning'} text-white`}>
                                    {post.status}
                                </span>
                            </td>
                            <td>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(post)} className="btn btn-sm bg-amber-400 hover:bg-amber-500 text-white border-none">
                                        <FaEdit />
                                    </button>
                                    <button onClick={() => handleDelete(post._id)} className="btn btn-sm bg-red-500 hover:bg-red-600 text-white border-none">
                                        <FaTrash />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editingPost && (
                <div className="mt-10 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                    <h3 className="text-xl font-black mb-4 uppercase italic">Edit Tuition Post</h3>
                    <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label text-xs font-bold uppercase">Subject</label>
                                <input type="text" name="subject" value={formData.subject} onChange={handleFormChange} className="input input-bordered focus:border-orange-500" />
                            </div>
                            <div className="form-control">
                                <label className="label text-xs font-bold uppercase">Class</label>
                                <input type="text" name="class" value={formData.class} onChange={handleFormChange} className="input input-bordered focus:border-orange-500" />
                            </div>
                            <div className="form-control">
                                <label className="label text-xs font-bold uppercase">Salary</label>
                                <input type="number" name="salary" value={formData.salary} onChange={handleFormChange} className="input input-bordered focus:border-orange-500" />
                            </div>
                            <div className="form-control">
                                <label className="label text-xs font-bold uppercase">Location</label>
                                <input type="text" name="location" value={formData.location} onChange={handleFormChange} className="input input-bordered focus:border-orange-500" />
                            </div>
                        </div>
                        <div className="mt-6 flex gap-3">
                            <button type="submit" className="btn bg-orange-600 hover:bg-orange-700 text-white border-none px-8">Update Post</button>
                            <button type="button" onClick={() => setEditingPost(null)} className="btn btn-outline border-slate-300">Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default MyPosts;