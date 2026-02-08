import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminAnalytics = () => {
    const [data, setData] = useState({ totalEarnings: 0, payments: [] });

    useEffect(() => {
        axios.get('http://localhost:3000/admin/analytics')
            .then(res => setData(res.data));
    }, []);

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="bg-orange-600 p-8 rounded-3xl text-white shadow-xl">
                    <p className="text-lg font-medium opacity-80">Total Earnings</p>
                    <h1 className="text-5xl font-black mt-2">${data.totalEarnings}</h1>
                </div>
                <div className="bg-slate-800 p-8 rounded-3xl text-white shadow-xl">
                    <p className="text-lg font-medium opacity-80">Total Transactions</p>
                    <h1 className="text-5xl font-black mt-2">{data.payments.length}</h1>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
                <h3 className="text-xl font-bold mb-4">Transaction History</h3>
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>Student</th>
                            <th>Amount</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.payments.map(pay => (
                            <tr key={pay.transactionId}>
                                <td className="font-mono text-xs">{pay.transactionId}</td>
                                <td>{pay.studentEmail}</td>
                                <td className="text-green-600 font-bold">${pay.salary}</td>
                                <td>{new Date(pay.date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminAnalytics;