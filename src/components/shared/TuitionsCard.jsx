import React from 'react';
import { Link } from 'react-router'; // নিশ্চিত করুন react-router-dom বা react-router v7 ব্যবহার করছেন
import { FaMapMarkerAlt, FaBookOpen, FaDollarSign, FaLayerGroup } from 'react-icons/fa';

const TuitionCard = ({ tuition }) => {
    // ডাটা ডেসট্রাকচারিং (ব্যাক-এন্ড থেকে আসা ডাটা অনুযায়ী)
    const { _id, subject, class: className, salary, location, status } = tuition;

    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-7 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden flex flex-col h-full">
            
            {/* Top Hover Line Decor */}
            <div className="absolute top-0 left-0 w-full h-1 bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            
            <div className="flex justify-between items-start mb-6">
                <div className="bg-slate-100 text-slate-800 p-4 rounded-2xl group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                    <FaBookOpen className="text-xl" />
                </div>
                <span className={`badge border-none font-black uppercase text-[9px] tracking-[2px] px-4 py-3 ${
                    status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                }`}>
                    {status}
                </span>
            </div>

            <div className="grow">
                <div className="space-y-1 mb-6">
                    <h3 className="text-2xl font-black text-slate-800 uppercase italic group-hover:text-orange-600 transition-colors">
                        {subject}
                    </h3>
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                        <FaLayerGroup className="text-orange-500" /> {className}
                    </div>
                </div>

                <div className="space-y-3 mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3 text-slate-600 text-sm font-semibold">
                        <FaMapMarkerAlt className="text-orange-500 shrink-0" /> 
                        <span className="truncate">{location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-900 font-black text-lg">
                        <FaDollarSign className="text-emerald-600" /> 
                        {salary} <span className="text-[10px] text-slate-400 font-bold uppercase">/ Month</span>
                    </div>
                </div>
            </div>

            {/* View Details Button - Dynamic Route /tuition/:id */}
            <Link 
                to={`/tuition/${_id}`} 
                className="btn btn-block bg-slate-900 hover:bg-orange-600 text-white border-none rounded-2xl h-14 uppercase font-black italic tracking-widest transition-all shadow-lg shadow-slate-200 mt-auto"
            >
                View Details
            </Link>
        </div>
    );
};

export default TuitionCard;