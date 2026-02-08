import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import image1 from '../assets/image1.png';
import image2 from '../assets/image2.png';
import image3 from '../assets/image3.png';
import image4 from '../assets/image4.png';
import image5 from '../assets/image5.png';
import image6 from '../assets/image6.jpeg';
import image7 from '../assets/image7.png';

// Import Swiper styles
import 'swiper/css';

const Brands = () => {
    // Array of your logo image paths
    const brandLogos = [
        { id: 1, src: image1 },
        { id: 2, src: image2 },
        { id: 3, src: image3 },
        { id: 4, src: image4 },
        { id: 5, src: image5 },
        { id: 6, src: image6 },
        { id: 7, src: image7 },
    ];

    return (
        <section className="py-10 bg-white border-y border-slate-50">
            <div className="max-w-7xl mx-auto px-6">
                <h1 className="text-2xl font-bold text-center mb-8">We are <span className="text-primary">Featured</span> in:</h1>
                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={50}
                    slidesPerView={2}
                    loop={true}
                    speed={5000} // Increased speed for a very smooth, slow crawl
                    autoplay={{
                        delay: 0,
                        disableOnInteraction: false,
                    }}
                    allowTouchMove={false} // Prevents users from breaking the smooth flow
                    breakpoints={{
                        640: { slidesPerView: 3 },
                        768: { slidesPerView: 4 },
                        1024: { slidesPerView: 6 },
                    }}
                    className="brands-ticker-wrapper"
                >
                    {brandLogos.map((logo) => (
                        <SwiperSlide key={logo.id} className="flex items-center justify-center">
                            <div className="h-12 w-full flex items-center justify-center grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                                <img 
                                    src={logo.src} 
                                    alt={logo.alt} 
                                    className="max-h-full max-w-full object-contain" 
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            
            {/* Global CSS for the Linear Ticker effect */}
            <style jsx global>{`
                .brands-ticker-wrapper .swiper-wrapper {
                    transition-timing-function: linear !important;
                }
            `}</style>
        </section>
    );
};

export default Brands;