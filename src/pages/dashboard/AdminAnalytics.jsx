import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { FaWallet, FaUsers, FaChartLine, FaExchangeAlt } from 'react-icons/fa';

const AdminAnalytics = () => {
    const [data, setData] = useState({ totalUsers: 0, totalVolume: 0, platformRevenue: 0, payments: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('access-token');
        axios.get('http://localhost:3000/admin/analytics', {
            headers: { authorization: `Bearer ${token}` }
        })
        .then(res => {
            setData(res.data);
            setLoading(false);
        })
        .catch(err => console.error(err));
    }, []);

    // Formatting data for charts
    const chartData = data.payments.map(p => ({
        date: new Date(p.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        revenue: parseFloat(p.salary) * 0.20 // 20% platform cut
    })).reverse();

    if (loading) return <div className="p-20 text-center"><span className="loading loading-spinner text-orange-600"></span></div>;

    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            <header className="mb-10">
                <h2 className="text-3xl font-black text-slate-800 uppercase italic">Platform Analytics</h2>
                <p className="text-slate-500 font-medium italic">Tracking 10% service fees from students and 10% from tutors.</p>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-orange-100 text-orange-600 rounded-2xl"><FaWallet size={24} /></div>
                        <div>
                            <p className="text-[10px] uppercase font-black text-slate-400">Net Revenue (20%)</p>
                            <h3 className="text-2xl font-black text-slate-800">৳{data.platformRevenue.toLocaleString()}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-blue-100 text-blue-600 rounded-2xl"><FaExchangeAlt size={24} /></div>
                        <div>
                            <p className="text-[10px] uppercase font-black text-slate-400">Total Volume</p>
                            <h3 className="text-2xl font-black text-slate-800">৳{data.totalVolume.toLocaleString()}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-purple-100 text-purple-600 rounded-2xl"><FaUsers size={24} /></div>
                        <div>
                            <p className="text-[10px] uppercase font-black text-slate-400">Active Users</p>
                            <h3 className="text-2xl font-black text-slate-800">{data.totalUsers}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-green-100 text-green-600 rounded-2xl"><FaChartLine size={24} /></div>
                        <div>
                            <p className="text-[10px] uppercase font-black text-slate-400">Transactions</p>
                            <h3 className="text-2xl font-black text-slate-800">{data.payments.length}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                <div className="lg:col-span-2 bg-white p-8 rounded-4xl border border-slate-100 shadow-2xl">
                    <h3 className="text-lg font-black uppercase italic text-slate-700 mb-6">Revenue Growth (10% + 10% Cut)</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ea580c" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700}} />
                                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                                <Area type="monotone" dataKey="revenue" stroke="#ea580c" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Platform Summary Card */}
                <div className="bg-slate-900 p-8 rounded-4xl text-white shadow-2xl relative overflow-hidden">
                    <h3 className="text-xl font-black uppercase italic mb-8 relative z-10">Platform Health</h3>
                    <div className="space-y-6 relative z-10">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Fee from Students</p>
                            <div className="flex justify-between items-end">
                                <span className="text-2xl font-black italic">৳{(data.totalVolume * 0.1).toFixed(0)}</span>
                                <span className="text-orange-500 font-bold">10%</span>
                            </div>
                        </div>
                        <div className="h-[1px] bg-slate-800"></div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Fee from Tutors</p>
                            <div className="flex justify-between items-end">
                                <span className="text-2xl font-black italic">৳{(data.totalVolume * 0.1).toFixed(0)}</span>
                                <span className="text-orange-500 font-bold">10%</span>
                            </div>
                        </div>
                    </div>
                    <div className="absolute -bottom-10 -right-10 opacity-10 rotate-12">
                        <FaChartLine size={200} />
                    </div>
                </div>
            </div>

            {/* Transaction List */}
            <div className="bg-white rounded-4xl border border-slate-100 shadow-2xl overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                    <h3 className="text-xl font-black uppercase italic text-slate-800">Audit Log</h3>
                    <span className="badge badge-outline p-4 font-bold uppercase text-[10px]">Live Transactions</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead className="bg-slate-50/50">
                            <tr className="text-slate-400 font-black uppercase text-[10px] tracking-widest">
                                <th className="p-6">Student</th>
                                <th>Gross Amount</th>
                                <th>Platform Cut (20%)</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.payments.map(pay => (
                                <tr key={pay._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                    <td className="p-6">
                                        <div className="font-bold text-slate-700">{pay.studentEmail}</div>
                                        <div className="text-[10px] font-mono text-slate-400">{pay.transactionId}</div>
                                    </td>
                                    <td className="font-black text-slate-800 uppercase">৳{pay.salary}</td>
                                    <td className="font-black text-orange-600 uppercase">৳{(pay.salary * 0.2).toFixed(2)}</td>
                                    <td className="text-slate-500 text-sm">{new Date(pay.date).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;