import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ fullPage = true }) => {
    return (
        <div className={`${
            fullPage 
            ? "fixed inset-0 z-9999 bg-white" 
            : "relative w-full py-20 bg-transparent"
        } flex flex-col items-center justify-center`}>
            
            {/* Background Glow (Only for Full Page) */}
            {fullPage && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-orange-500/10 blur-[120px] rounded-full"></div>
            )}

            <div className="relative flex flex-col items-center">
                {/* Animated "Book" Bars */}
                <div className="flex items-end gap-1.5 mb-6 h-12">
                    {[0, 1, 2, 3, 4].map((i) => (
                        <motion.div
                            key={i}
                            initial={{ height: "20%" }}
                            animate={{ 
                                height: ["20%", "100%", "20%"],
                                backgroundColor: i % 2 === 0 ? "#EA580C" : "#1E293B" 
                            }}
                            transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                delay: i * 0.1,
                                ease: "easeInOut"
                            }}
                            className="w-2.5 rounded-full"
                        />
                    ))}
                </div>

                {/* Educational Cap Icon with Float Effect */}
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="text-slate-800 text-5xl mb-4"
                >
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M622.34 153.2L343.4 67.5c-15.2-4.67-31.6-4.67-46.79 0L17.66 153.2c-18.12 5.57-18.12 31.02 0 36.59L65.47 204.11v145.02c-15.35 6.16-26.04 21.28-26.04 38.92 0 23.16 18.77 41.93 41.93 41.93s41.93-18.77 41.93-41.93c0-17.64-10.69-32.76-26.04-38.92V209.85l101.93 31.29c15.2 4.67 31.6 4.67 46.79 0l276.33-84.73c14.28-4.38 14.28-24.51 0-28.89zM128 322.79c0 43.15 101.12 78.13 224 78.13s224-34.98 224-78.13V215.15L356.5 275.14c-11.33 3.47-23.65 3.47-34.99 0L128 214.39v108.4z"></path>
                    </svg>
                </motion.div>

                {/* Status Text */}
                <div className="text-center">
                    <h3 className="text-lg font-black text-slate-800 uppercase tracking-[0.2em]">
                        Loading<span className="text-orange-600 animate-pulse">...</span>
                    </h3>
                    {fullPage && (
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                            Preparing your classroom
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Loader;