import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import { FaDollarSign, FaFileInvoiceDollar, FaRegCalendarAlt } from 'react-icons/fa';

const RevenueHistory = () => {
    const { user } = useAuth();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.email) {
            axios.get(`http://localhost:3000/tutor-revenue/${user?.email}`)
                .then(res => {
                    // ফিক্স: ব্যাক-এন্ড থেকে আসা অবজেক্টের ভেতর থেকে পেমেন্ট অ্যারেটি নেওয়া হয়েছে
                    setPayments(res.data.payments || []);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [user]);

    // মোট আয় ক্যালকুলেশন (ফিক্স: payments অ্যারে কি না তা নিশ্চিত করা হয়েছে)
    const totalEarnings = Array.isArray(payments) 
        ? payments.reduce((sum, payment) => sum + parseFloat(payment.salary || 0), 0) 
        : 0;

    if (loading) return <div className="text-center p-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

    return (
        <div className="p-4 lg:p-8">
            <header className="mb-10">
                <h2 className="text-3xl font-black text-slate-800 uppercase italic">Revenue History</h2>
                <p className="text-slate-500 font-medium">Track all your earnings and payment transactions here.</p>
            </header>

            {/* Total Earnings Card */}
            <div className="bg-linear-to-r from-orange-500 to-orange-600 rounded-4xl p-8 lg:p-12 text-white mb-10 shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <p className="uppercase text-xs font-black tracking-[4px] opacity-80 mb-2">Net Income</p>
                    <h1 className="text-5xl lg:text-7xl font-black italic flex items-center">
                        <FaDollarSign className="text-4xl mr-1" />
                        {totalEarnings.toLocaleString()}
                    </h1>
                    <p className="mt-4 text-sm font-bold bg-white/20 inline-block px-4 py-1 rounded-full backdrop-blur-md">
                        Total {payments.length} Transactions
                    </p>
                </div>
                {/* Decorative Icon */}
                <FaFileInvoiceDollar className="absolute -bottom-5 -right-5 text-[12rem] opacity-10 rotate-12" />
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                    <h3 className="font-black uppercase text-slate-700 italic">Recent Transactions</h3>
                    <button className="btn btn-ghost btn-xs text-orange-600 font-black">Export PDF</button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead className="bg-slate-50">
                            <tr className="text-slate-500 uppercase text-[10px] tracking-widest">
                                <th>Date</th>
                                <th>Tuition Subject</th>
                                <th>Transaction ID</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-10 text-slate-400 font-bold uppercase italic">No earnings yet!</td>
                                </tr>
                            ) : (
                                payments.map((p) => (
                                    <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="text-slate-600 font-medium">
                                            <div className="flex items-center gap-2">
                                                <FaRegCalendarAlt className="text-slate-300" />
                                                {new Date(p.date).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="font-black text-slate-700 uppercase">{p.subject}</div>
                                        </td>
                                        <td>
                                            <code className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500">{p.transactionId}</code>
                                        </td>
                                        <td>
                                            <div className="font-black text-green-600">${p.salary}</div>
                                        </td>
                                        <td>
                                            <span className="badge badge-success badge-sm text-white font-bold uppercase text-[9px] px-3">Paid</span>
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

export default RevenueHistory;