import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';
import Swal from 'sweetalert2'; // সুন্দর এলার্টের জন্য
import { FaEdit, FaTrash } from 'react-icons/fa';

const MyPosts = () => {
    const { user } = useAuth();
    const [myPosts, setMyPosts] = useState([]);

    useEffect(() => {
        if (user?.email) {
            axios.get(`http://localhost:3000/tuitions?email=${user.email}`)
                .then(res => setMyPosts(res.data));
        }
    }, [user]);

    // ডিলিট ফাংশন
    const handleDelete = (id) => {
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
                axios.delete(`http://localhost:3000/tuitions/${id}`)
                    .then(res => {
                        if (res.data.deletedCount > 0) {
                            Swal.fire("Deleted!", "Your post has been deleted.", "success");
                            setMyPosts(myPosts.filter(post => post._id !== id));
                        }
                    });
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
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {myPosts.map(post => (
                        <tr key={post._id}>
                            <td className="font-bold">{post.subject}</td>
                            <td>{post.class}</td>
                            <td>{post.salary} BDT</td>
                            <td>
                                <span className={`badge ${post.status === 'pending' ? 'badge-warning' : 'badge-success'}`}>
                                    {post.status}
                                </span>
                            </td>
                            <td className="flex gap-3">
                                <button className="btn btn-sm btn-info text-white"><FaEdit /></button>
                                <button onClick={() => handleDelete(post._id)} className="btn btn-sm btn-error text-white"><FaTrash /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MyPosts;