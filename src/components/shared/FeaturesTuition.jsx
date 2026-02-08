import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
// import TuitionCard from '../shared/TuitionCard';

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import TuitionCard from './TuitionsCard';

const FeaturedTuitions = () => {
    const [tuitions, setTuitions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:3000/tuitions')
            .then(res => {
                // লেটেস্ট ৬টি বা ৮টি টিউশন স্লাইডারে দেখানোর জন্য
                setTuitions(res.data.slice(0, 8));
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="text-center py-10"><span className="loading loading-dots loading-lg text-orange-600"></span></div>;

    return (
        <section className="py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-black italic uppercase">
                        Latest <span className="text-orange-600">Tuition</span> Jobs
                    </h2>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">New opportunities added recently</p>
                </div>

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
                    className="mySwiper pb-14!"
                >
                    {tuitions.map(tuition => (
                        <SwiperSlide key={tuition._id}>
                            {/* আপনার তৈরি করা Shared Component ব্যবহার হচ্ছে */}
                            <TuitionCard tuition={tuition} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default FeaturedTuitions;