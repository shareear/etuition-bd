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
            axios.get(`https://etuition-bd-server.vercel.app/tuitions?email=${user.email}`)
                .then(res => setMyPosts(res.data));
        }
    }, [user]);

    const handleDelete = (id) => {
        // --- ADDED JWT TOKEN FOR VERIFICATION ---
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
                axios.delete(` http://localhost:3000/tuitions/${id}`, {
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
        // --- ADDED JWT TOKEN FOR VERIFICATION ---
        const token = localStorage.getItem('access-token');

        axios.patch(` http://localhost:3000/tuitions/${editingPost._id}`, formData, {
            headers: {
                authorization: `Bearer ${token}`
            }
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
                            <td>{post.status}</td>
                            <td>
                                <button onClick={() => handleEdit(post)} className="btn btn-sm btn-warning mr-2">
                                    <FaEdit />
                                </button>
                                <button onClick={() => handleDelete(post._id)} className="btn btn-sm btn-danger">
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editingPost && (
                <div className="mt-6">
                    <h3 className="text-xl font-bold mb-4">Edit Tuition Post</h3>
                    <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleFormChange}
                                placeholder="Subject"
                                className="input input-bordered"
                            />
                            <input
                                type="text"
                                name="class"
                                value={formData.class}
                                onChange={handleFormChange}
                                placeholder="Class"
                                className="input input-bordered"
                            />
                            <input
                                type="text"
                                name="salary"
                                value={formData.salary}
                                onChange={handleFormChange}
                                placeholder="Salary"
                                className="input input-bordered"
                            />
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleFormChange}
                                placeholder="Location"
                                className="input input-bordered"
                            />
                        </div>
                        <div className="mt-4">
                            <button type="submit" className="btn btn-primary mr-2">Update</button>
                            <button onClick={() => setEditingPost(null)} className="btn btn-secondary">Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default MyPosts;