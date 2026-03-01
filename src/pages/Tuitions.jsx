import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import TuitionCard from '../components/shared/TuitionsCard';
import useAxios from '../hooks/useAxios';

const AllTuitions = () => {
    const [tuitions, setTuitions] = useState([]);
    const [filteredTuitions, setFilteredTuitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    
    const axiosPublic = useAxios(); 

    useEffect(() => {
        // FIX: Changed '/tution' to '/tuitions' to match the backend route
        // Your backend logic: if no email is provided, it returns only { status: 'approved' }
        axiosPublic.get('/tuitions')
            .then(res => {
                if (res.data && Array.isArray(res.data)) {
                    setTuitions(res.data);
                    setFilteredTuitions(res.data);
                }
            })
            .catch(err => {
                console.error("Fetch Error:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [axiosPublic]);

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);

        const filtered = tuitions.filter(tuition => 
            tuition.subject?.toLowerCase().includes(value) || 
            tuition.location?.toLowerCase().includes(value) ||
            tuition.class?.toLowerCase().includes(value)
        );
        setFilteredTuitions(filtered);
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <span className="loading loading-spinner loading-lg text-orange-600"></span>
        </div>
    );

    return (
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
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                </div>

                {/* Search Bar */}
                <div className="relative max-w-2xl mx-auto -mt-10 z-20 px-4">
                    <div className="relative group">
                        <input 
                            type="text" 
                            value={searchText}
                            onChange={handleSearch}
                            placeholder="Search by Subject, Location, or Class..." 
                            className="input w-full h-20 rounded-2xl pl-16 pr-6 shadow-2xl border-none text-lg font-medium focus:ring-4 focus:ring-orange-500/20 transition-all outline-none"
                        />
                        <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-600 text-2xl transition-transform group-focus-within:scale-110" />
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center mb-8 px-2">
                    <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">
                        Showing {filteredTuitions.length} Results
                    </p>
                </div>

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