import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

const FeedBack = () => {
    const [feedBacks, setFeedBacks] = useState([]);
    const [loading, setLoading] = useState(true);

    // console.log(feedBacks);

    useEffect(() => {
        axios.get('https://etuition-bd-server.vercel.app/feedBack')
            .then(result => {
                // console.log(result.data);
                setFeedBacks(result.data)
                setLoading(false);
            })
            .catch(err => {
                toast.error(`${err.message}`)
                return;
            })
    }, []);

    if (loading) return (
        <div className="flex justify-center py-20">
            <span className="loading loading-dots loading-lg text-orange-600"></span>
        </div>
    );

    // If no data is found, we don't render the section
    if (feedBacks.length === 0) return null;

    return (
        <section className="py-20 bg-base-100 transition-colors duration-300 overflow-hidden md:max-w-7xl mx-auto">
            <div className="max-w-7xl mx-auto px-4 mb-12 text-center">
                <h2 className="text-4xl font-black uppercase italic text-base-content">
                    Client <span className="text-orange-600">Testimonials</span>
                </h2>
                <div className="w-24 h-1 bg-orange-500 mx-auto mt-4 rounded-full"></div>
            </div>

            <Swiper
                loop={true}
                speed={3000}
                freeMode={true}
                slidesPerView={1}
                spaceBetween={20}
                autoplay={{
                    delay: 0,
                    disableOnInteraction: false,
                    reverseDirection: true, // Changes direction from Left to Right ✅
                }}
                modules={[Autoplay, FreeMode]}
                breakpoints={{
                    // Mobile: 1.2 slides (shows a peek of the next one)
                    320: { slidesPerView: 1.2, spaceBetween: 15 },
                    // Tablet: 2.5 slides
                    768: { slidesPerView: 2.5, spaceBetween: 25 },
                    // Desktop: 4 slides
                    1024: { slidesPerView: 4, spaceBetween: 30 },
                }}
                className="feedback-swiper"
            >
                {feedBacks.map((feed, index) => (
                    <SwiperSlide key={index}>
                        <div className="bg-base-200 p-6 rounded-4xl border border-base-300 h-full flex flex-col hover:bg-base-100 hover:shadow-xl hover:border-orange-100 transition-all duration-500 group">

                            <div className="flex justify-between items-start mb-6">
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className="text-orange-400 text-xs" />
                                    ))}
                                </div>
                                <FaQuoteLeft className="text-base-content/10 group-hover:text-orange-200 transition-colors text-2xl" />
                            </div>

                            <p className="text-base-content/70 text-sm leading-relaxed italic mb-8 grow">
                                {feed.feedback}
                            </p>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-orange-200/20 overflow-hidden ring-2 ring-base-100 shadow-md">
                                    <img src={feed.image} alt="user" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-base-content">{feed.name}</h4>
                                    <p className="text-[10px] font-bold text-orange-500 uppercase">{feed.role}</p>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>


            {/* Crucial for Marquee effect: Overriding Swiper transition to be linear */}
            <style jsx global>{`
                .feedback-swiper .swiper-wrapper {
                    transition-timing-function: linear !important;
                }
            `}</style>
        </section>
    );
};

export default FeedBack;