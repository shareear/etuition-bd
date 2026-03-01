import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import { FaWallet, FaReceipt, FaRegCalendarAlt, FaUserGraduate } from 'react-icons/fa';

const ExpenseHistory = () => {
    const { user } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchExpenseData = useCallback(() => {
        if (user?.email) {
            const token = localStorage.getItem('access-token');
            axios.get(` https://etuition-bd-server.vercel.app/student-expenses/${user?.email}`, {
                headers: { authorization: `Bearer ${token}` }
            })
            .then(res => {
                setExpenses(Array.isArray(res.data) ? res.data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching expenses:", err);
                setLoading(false);
            });
        }
    }, [user]);

    useEffect(() => {
        fetchExpenseData();
    }, [fetchExpenseData]);

    const totalSpent = expenses.reduce((sum, item) => sum + parseFloat(item.salary || 0), 0);

    if (loading) return <div className="text-center p-20"><span className="loading loading-spinner loading-lg text-orange-600"></span></div>;

    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            <header className="mb-10">
                <h2 className="text-3xl font-black text-slate-800 uppercase italic">Expense History</h2>
                <p className="text-slate-500 font-medium">Review your investments in your education.</p>
            </header>

            {/* Total Spent Summary */}
            <div className="bg-slate-900 rounded-4xl p-8 lg:p-12 text-white mb-10 shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <p className="uppercase text-xs font-black tracking-[4px] opacity-60 mb-2">Total Investment</p>
                    <h1 className="text-5xl lg:text-7xl font-black italic flex items-center">
                        <span className="text-orange-500 mr-2">৳</span>
                        {totalSpent.toLocaleString()}
                    </h1>
                </div>
                <FaWallet className="absolute -bottom-5 -right-5 text-[12rem] opacity-10 -rotate-12" />
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead className="bg-slate-50">
                            <tr className="text-slate-500 uppercase text-[10px] tracking-widest">
                                <th className="py-5 px-6">Tutor Info</th>
                                <th>Subject</th>
                                <th>Date</th>
                                <th>Transaction ID</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-20 text-slate-400 font-black uppercase italic">No expenses recorded yet.</td>
                                </tr>
                            ) : (
                                expenses.map((exp) => (
                                    <tr key={exp._id} className="hover:bg-slate-50 transition-colors border-b border-slate-50">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-orange-100 p-2 rounded-xl text-orange-600">
                                                    <FaUserGraduate />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-700">{exp.tutorEmail}</div>
                                                    <div className="text-[10px] text-slate-400 uppercase font-black">Verified Tutor</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="font-black text-slate-600 uppercase italic text-sm">{exp.subject || 'N/A'}</span>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                                                <FaRegCalendarAlt className="opacity-30" />
                                                {new Date(exp.date).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td>
                                            <code className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-400">{exp.transactionId}</code>
                                        </td>
                                        <td>
                                            <div className="font-black text-slate-800">৳{exp.salary}</div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ExpenseHistory;