import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import TuitionCard from '../shared/TuitionCard';
import { FaSearch } from 'react-icons/fa';
import TuitionCard from '../components/shared/TuitionsCard';

const AllTuitions = () => {
    const [tuitions, setTuitions] = useState([]);
    const [filteredTuitions, setFilteredTuitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
    // এখানে setLoading(true) করার দরকার নেই, কারণ useState(true) আগেই করা আছে।
    axios.get('http://localhost:3000/tuitions')
        .then(res => {
            // ড্যাটা চেক করে সেট করা
            if(res.data) {
                setTuitions(res.data);
                setFilteredTuitions(res.data);
            }
        })
        .catch(err => {
            console.error("Fetch Error:", err);
        })
        .finally(() => {
            // ড্যাটা আসুক বা এরর হোক, লোডিং একবারে শেষ হবে
            setLoading(false);
        });
}, []);

    // সার্চ ফাংশনালিটি লজিক
    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);

        const filtered = tuitions.filter(tuition => 
            tuition.subject.toLowerCase().includes(value) || 
            tuition.location.toLowerCase().includes(value)
        );
        setFilteredTuitions(filtered);
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <span className="loading loading-spinner loading-lg text-orange-600"></span>
        </div>
    );

    return (
        // নেভবারের জন্য pt-24 বা pt-32 ব্যবহার করা হয়েছে যাতে কন্টেন্ট নিচে নেমে আসে
        <div className="bg-slate-50 min-h-screen pb-20 pt-24 lg:pt-32">
            
            {/* Header Section */}
            <div className="max-w-7xl mx-auto px-4 mb-10">
                <div className="bg-slate-900 rounded-[2.5rem] py-16 px-6 relative overflow-hidden shadow-2xl">
                    <div className="relative z-10 text-center">
                        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic mb-4">
                            Available <span className="text-orange-500">Tuitions</span>
                        </h1>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs">
                            Find your next teaching opportunity in seconds
                        </p>
                    </div>
                    {/* Decorative Background Element */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                </div>

                {/* Search Bar Functionality */}
                <div className="relative max-w-2xl mx-auto -mt-10 z-20 px-4">
                    <div className="relative group">
                        <input 
                            type="text" 
                            value={searchText}
                            onChange={handleSearch}
                            placeholder="Search by Subject (e.g. Math) or Location..." 
                            className="input w-full h-20 rounded-2xl pl-16 pr-6 shadow-2xl border-none text-lg font-medium focus:ring-4 focus:ring-orange-500/20 transition-all outline-none"
                        />
                        <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-600 text-2xl transition-transform group-focus-within:scale-110" />
                    </div>
                </div>
            </div>

            {/* Grid Container */}
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center mb-8 px-2">
                    <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">
                        Showing {filteredTuitions.length} Results
                    </p>
                </div>

                {/* Responsive Grid: 1 col (mobile), 2 cols (tablet), 3 cols (desktop) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredTuitions.length > 0 ? (
                        filteredTuitions.map(tuition => (
                            <TuitionCard key={tuition._id} tuition={tuition} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-slate-100">
                            <h3 className="text-2xl font-black text-slate-300 uppercase italic">No Matches Found</h3>
                            <p className="text-slate-400 text-sm mt-2">Try searching for something else!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllTuitions;