import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { InView } from 'react-intersection-observer';
import { FaUsers, FaBriefcase, FaGraduationCap, FaChalkboardTeacher } from 'react-icons/fa';

// Custom Counter Component to avoid react-countup bugs
const AnimatedNumber = ({ value, suffix = "+" }) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest) + suffix);
    const [displayValue, setDisplayValue] = useState("0" + suffix);

    useEffect(() => {
        const controls = animate(count, value, { duration: 2, ease: "easeOut" });
        return controls.stop;
    }, [count, value]);

    // Update state so it renders correctly
    useEffect(() => {
        return rounded.onChange((latest) => setDisplayValue(latest));
    }, [rounded]);

    return <span>{displayValue}</span>;
};

const StatsCounter = () => {
    const statsData = [
        { id: 1, label: "Total Tutors", value: 4500, icon: <FaChalkboardTeacher />, color: "from-orange-400 to-red-500", shadow: "shadow-orange-200" },
        { id: 2, label: "Live Tuitions", value: 1200, icon: <FaBriefcase />, color: "from-blue-400 to-indigo-600", shadow: "shadow-blue-200" },
        { id: 3, label: "Total Students", value: 8500, icon: <FaUsers />, color: "from-green-400 to-emerald-600", shadow: "shadow-emerald-200" },
        { id: 4, label: "Success Rate", value: 98, suffix: "%", icon: <FaGraduationCap />, color: "from-purple-400 to-pink-600", shadow: "shadow-purple-200" }
    ];

    return (
        <div className="py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-6">
                <InView triggerOnce threshold={0.2}>
                    {({ inView, ref }) => (
                        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {statsData.map((stat, index) => (
                                <motion.div
                                    key={stat.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={inView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className={`relative bg-white p-8 rounded-3xl shadow-xl ${stat.shadow} border border-slate-100 flex flex-col items-center text-center overflow-hidden`}
                                >
                                    <div className={`w-16 h-16 rounded-2xl bg-linear-to-br ${stat.color} text-white flex items-center justify-center text-3xl mb-6 shadow-lg`}>
                                        {stat.icon}
                                    </div>

                                    <div className="text-4xl font-black text-slate-800 mb-2">
                                        {inView ? <AnimatedNumber value={stat.value} suffix={stat.suffix || "+"} /> : "0"}
                                    </div>

                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                                        {stat.label}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </InView>
            </div>
        </div>
    );
};

export default StatsCounter;