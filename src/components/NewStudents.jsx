import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import { FaUserGraduate, FaMapMarkerAlt, FaGraduationCap } from 'react-icons/fa';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';

const NewStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('https://etuition-bd-server.vercel.app/users')
            .then(res => {
                const filtered = res.data
                    .filter(user => user.role === 'student')
                    .reverse()
                    .slice(0, 12); 
                setStudents(filtered);
                setLoading(false);
            })
            .catch(err => {
                console.error("Student Fetch Error:", err);
                setLoading(false);
            });
    }, []);

    if (loading || students.length === 0) return null;

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-slate-800 italic uppercase">
                        Our Growing <span className="text-blue-600">Student</span> Community
                    </h2>
                    <div className="w-20 h-1.5 bg-blue-600 mx-auto mt-4 rounded-full"></div>
                </div>

                <Swiper
                    slidesPerView={1.5}
                    spaceBetween={20}
                    loop={true}
                    speed={5000} // Smooth continuous flow
                    freeMode={true}
                    autoplay={{
                        delay: 0,
                        disableOnInteraction: false,
                    }}
                    breakpoints={{
                        640: { slidesPerView: 2.5, spaceBetween: 25 },
                        1024: { slidesPerView: 4, spaceBetween: 30 },
                        1280: { slidesPerView: 5, spaceBetween: 30 },
                    }}
                    modules={[Autoplay, FreeMode]}
                    className="student-showcase-swiper"
                >
                    {students.map((student) => (
                        <SwiperSlide key={student._id}>
                            <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 flex flex-col items-center text-center transition-all duration-500 hover:shadow-xl hover:bg-white border-b-4 hover:border-b-blue-600">
                                
                                {/* Large Avatar */}
                                <div className="w-24 h-24 rounded-4xl overflow-hidden mb-6 ring-4 ring-blue-50 shadow-inner">
                                    <img 
                                        src={student.image || student.photoURL || "https://i.ibb.co/5GzXkwq/user.png"} 
                                        className="w-full h-full object-cover"
                                        alt={student.name}
                                    />
                                </div>

                                {/* Identity */}
                                <h4 className="text-lg font-black text-slate-800 italic uppercase truncate w-full">
                                    {student.name}
                                </h4>
                                
                                <div className="flex items-center justify-center gap-1.5 mt-2 mb-4">
                                    <FaGraduationCap className="text-blue-500" />
                                    <p className="text-blue-600 font-bold text-[10px] uppercase tracking-widest">
                                        {student.class || "Student"}
                                    </p>
                                </div>

                                {/* Minimal Location Info */}
                                <div className="flex items-center gap-1.5 text-slate-400">
                                    <FaMapMarkerAlt size={10} />
                                    <span className="text-[10px] font-bold uppercase tracking-tighter">
                                        {student.address?.split(',')[0] || "Bangladesh"}
                                    </span>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Linear motion styling */}
            <style jsx global>{`
                .student-showcase-swiper .swiper-wrapper {
                    transition-timing-function: linear !important;
                }
            `}</style>
        </section>
    );
};

export default NewStudents;