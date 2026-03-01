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
            // ✅ MATCHED TO BACKEND: app.get('/tutions', ...) using email query
            axios.get(`https://etuition-bd-server.vercel.app//tutions?email=${user.email}`)
                .then(res => setMyPosts(res.data));
        }
    }, [user]);

    const handleDelete = (id) => {
        const token = localStorage.getItem('access-token');
        
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
                // ✅ MATCHED TO BACKEND: app.delete('/tution/:id', ...)
                axios.delete(`https://etuition-bd-server.vercel.app//tution/${id}`, {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
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
        const token = localStorage.getItem('access-token');

        // ✅ MATCHED TO BACKEND: app.patch('/tution/:id', ...)
        axios.patch(`https://etuition-bd-server.vercel.app//tution/${editingPost._id}`, formData, {
            headers: {
                authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                if (res.data.modifiedCount > 0) {
                    Swal.fire("Updated!", "Your post has been updated.", "success");
                    // Sync the local state with updated data
                    setMyPosts(myPosts.map(post => post._id === editingPost._id ? { ...post, ...formData } : post));
                    setEditingPost(null);
                }
            })
            .catch(err => {
                console.error("Update error:", err);
                Swal.fire("Error", "Could not update the post.", "error");
            });
    };

    return (
        <div className="overflow-x-auto bg-white p-6 rounded-2xl shadow">
            <h2 className="text-2xl font-bold mb-6 text-orange-600 uppercase">My Tuition Posts</h2>
            <table className="table w-full">
                <thead className="bg-slate-100">
                    <tr>
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
                        <tr key={post._id}>
                            <td>{post.subject}</td>
                            <td>{post.class}</td>
                            <td>{post.salary}</td>
                            <td>{post.location}</td>
                            <td className="capitalize font-semibold">{post.status}</td>
                            <td>
                                <button onClick={() => handleEdit(post)} className="btn btn-sm btn-warning mr-2">
                                    <FaEdit />
                                </button>
                                <button onClick={() => handleDelete(post._id)} className="btn btn-sm btn-error">
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editingPost && (
                <div className="mt-6 p-6 border border-slate-200 rounded-xl bg-slate-50">
                    <h3 className="text-xl font-bold mb-4">Edit Tuition Post</h3>
                    <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label text-xs font-bold uppercase">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleFormChange}
                                    className="input input-bordered"
                                />
                            </div>
                            <div className="form-control">
                                <label className="label text-xs font-bold uppercase">Class</label>
                                <input
                                    type="text"
                                    name="class"
                                    value={formData.class}
                                    onChange={handleFormChange}
                                    className="input input-bordered"
                                />
                            </div>
                            <div className="form-control">
                                <label className="label text-xs font-bold uppercase">Salary</label>
                                <input
                                    type="number"
                                    name="salary"
                                    value={formData.salary}
                                    onChange={handleFormChange}
                                    className="input input-bordered"
                                />
                            </div>
                            <div className="form-control">
                                <label className="label text-xs font-bold uppercase">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleFormChange}
                                    className="input input-bordered"
                                />
                            </div>
                        </div>
                        <div className="mt-6">
                            <button type="submit" className="btn btn-primary mr-2">Update Post</button>
                            <button onClick={() => setEditingPost(null)} className="btn btn-ghost">Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default MyPosts;