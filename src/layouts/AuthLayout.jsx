import React from 'react';
import { Outlet, Link } from 'react-router';
import { FaHome } from 'react-icons/fa';
import Logo from '../components/shared/Logo';

const AuthLayout = () => {
    return (
        /* Full viewport height with orange gradient */
        <div className="h-screen w-full bg-linear-to-r from-orange-500 to-orange-700 flex flex-col overflow-hidden">
            
            {/* Header Area */}
            <header className="w-full py-4 px-6 lg:px-12 z-20">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    
                    {/* --- CLICKABLE LOGO --- */}
                    <Link 
                        to="/" 
                        className="bg-white/10 backdrop-blur-md p-2 px-4 rounded-xl border border-white/20 shadow-lg scale-90 lg:scale-100 origin-left hover:bg-white/20 transition-all active:scale-95 block"
                    >
                        <Logo />
                    </Link>

                    {/* Go Home Button */}
                    <Link 
                        to="/" 
                        className="group flex items-center gap-2 bg-white/10 hover:bg-white text-white hover:text-orange-600 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 transition-all text-sm"
                    >
                        <FaHome />
                        <span className="font-bold uppercase tracking-wider hidden sm:inline">Home</span>
                    </Link>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="grow flex items-center justify-center p-2 lg:p-6 overflow-hidden">
                <div className="w-full max-w-7xl mx-auto flex justify-center h-full items-center">
                    
                    {/* Internal Scroll Container for Forms */}
                    <div className="w-full lg:w-auto max-h-[85vh] overflow-y-auto no-scrollbar rounded-[2.5rem]">
                        <Outlet />
                    </div>
                    
                </div>
            </main>
        </div>
    );
};

export default AuthLayout;