import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import TuitionCard from './TuitionsCard';
import useAxios from '../../hooks/useAxios'; 

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const FeaturedTuitions = () => {
    const [tuitions, setTuitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const axiosPublic = useAxios(); 

    useEffect(() => {
        // ✅ FETCHING FROM DATABASE: 
        // This hits app.get('/tuitions') in your backend.
        // Because no email query is passed, your backend returns { status: 'approved' }.
        axiosPublic.get('/tuitions')
            .then(res => {
                // We take the latest 8 approved tuitions from the DB for the slider
                if (res.data && Array.isArray(res.data)) {
                    setTuitions(res.data.slice(0, 8));
                }
            })
            .catch(err => {
                console.error("Error fetching featured tuitions:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [axiosPublic]);

    if (loading) return (
        <div className="text-center py-20">
            <span className="loading loading-dots loading-lg text-orange-600"></span>
        </div>
    );

    return (
        <section className="py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 py-5">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-black italic uppercase">
                        Latest <span className="text-orange-600">Tuition</span> Jobs
                    </h2>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">
                        New opportunities added recently
                    </p>
                </div>

                {tuitions.length > 0 ? (
                    <Swiper
                        spaceBetween={30}
                        centeredSlides={false}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        navigation={true}
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        modules={[Autoplay, Pagination, Navigation]}
                        className="mySwiper pb-14"
                    >
                        {tuitions.map(tuition => (
                            <SwiperSlide key={tuition._id}>
                                <TuitionCard tuition={tuition} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <div className="text-center text-slate-400 py-10 bg-white rounded-4xl border-2 border-dashed border-slate-200">
                        <p className="font-medium">No approved tuition jobs found in the database.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedTuitions;