import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaTrashAlt, FaUserShield, FaUserGraduate } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';

const ManageUsers = () => {
    const { loading } = useAuth();
    const [users, setUsers] = useState([]);
    const [isFetching, setIsFetching] = useState(true);

    // সব ইউজারদের নিয়ে আসার ফাংশন
    const fetchUsers = async () => {
        try {
            setIsFetching(true);
            const res = await axios.get('http://localhost:3000/users');
            setUsers(res.data);
        } catch (error) {
            toast.error("Failed to load users", error.message);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        if (!loading) fetchUsers();
    }, [loading]);

    // ইউজারের রোল আপডেট করার ফাংশন
    const handleMakeRole = async (id, newRole) => {
        try {
            const res = await axios.patch(`http://localhost:3000/users/role/${id}`, { role: newRole });
            if (res.data.modifiedCount > 0) {
                toast.success(`User is now a ${newRole}!`);
                // লোকাল স্টেট আপডেট করা যাতে পেজ রিফ্রেশ ছাড়াই রোল পরিবর্তন দেখা যায়
                setUsers(users.map(user => user._id === id ? { ...user, role: newRole } : user));
            }
        } catch (error) {
            toast.error("Update failed", error.message);
        }
    };

    // ইউজার ডিলিট করার ফাংশন
    const handleDeleteUser = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const res = await axios.delete(`http://localhost:3000/users/${id}`);
                if (res.data.deletedCount > 0) {
                    toast.success("User deleted successfully");
                    setUsers(users.filter(user => user._id !== id));
                }
            } catch (error) {
                toast.error("Delete failed", error.message);
            }
        }
    };

    if (loading || isFetching) return <div className="text-center p-20"><span className="loading loading-spinner loading-lg"></span></div>;

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black mb-6 text-slate-800 uppercase italic">Manage All Users ({users.length})</h2>
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead className="bg-slate-100">
                        <tr className="text-slate-700">
                            <th>#</th>
                            <th>User Info</th>
                            <th>Current Role</th>
                            <th>Action (Make Role)</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user._id}>
                                <td>{index + 1}</td>
                                <td>
                                    <div className="font-bold">{user.name}</div>
                                    <div className="text-sm opacity-60">{user.email}</div>
                                </td>
                                <td>
                                    <span className={`badge badge-sm font-bold uppercase ${user.role === 'admin' ? 'badge-primary' : user.role === 'tutor' ? 'badge-secondary' : 'badge-ghost'}`}>
                                        {user.role || 'student'}
                                    </span>
                                </td>
                                <td>
                                    <div className="flex gap-2">
                                        {user.role !== 'admin' && (
                                            <button onClick={() => handleMakeRole(user._id, 'admin')} className="btn btn-xs btn-outline btn-primary" title="Make Admin">
                                                <FaUserShield /> Admin
                                            </button>
                                        )}
                                        {user.role !== 'tutor' && (
                                            <button onClick={() => handleMakeRole(user._id, 'tutor')} className="btn btn-xs btn-outline btn-secondary" title="Make Tutor">
                                                <FaUserGraduate /> Tutor
                                            </button>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <button onClick={() => handleDeleteUser(user._id)} className="btn btn-ghost btn-xs text-red-500 hover:bg-red-50">
                                        <FaTrashAlt />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;