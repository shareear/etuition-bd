import React from 'react';
import Logo from '../components/shared/Logo';
import { NavLink, useNavigate } from 'react-router';
// Importing icons for mobile view
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';

const Navbar = () => {
    const { user, signOutUser } = useAuth();
    const navigate = useNavigate();
    console.log(user);
    // NavLink items with active state styling
    const links = <>
            <li><NavLink to="/" className={({ isActive }) => isActive ? "text-primary font-bold" : "text-white"}>Home</NavLink></li>
            <li><NavLink to="/tuitions" className={({ isActive }) => isActive ? "text-primary font-bold" : "text-white"}>Tuitions</NavLink></li>
            <li><NavLink to="/tutors" className={({ isActive }) => isActive ? "text-primary font-bold" : "text-white"}>Tutors</NavLink></li>
            <li><NavLink to="/about" className={({ isActive }) => isActive ? "text-primary font-bold" : "text-white"}>About</NavLink></li>
            <li><NavLink to="/contact" className={({ isActive }) => isActive ? "text-primary font-bold" : "text-white"}>Contact</NavLink></li>
            {user && <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? "text-primary font-bold" : "text-white"}>Dashboard</NavLink></li>}
    </>

    const handleSignOut = () => {
        signOutUser()
            .then(() => {
                toast.success("Signed out successfully");
                navigate("/login")
            })
            .catch((error) => {
                toast.error(error.message);
            })
    }

    return (
        <div className="fixed top-0 left-0 w-full z-50 mt-4 px-4">
            <div className="max-w-7xl mx-auto h-full">
                {/* Navbar Glass Box */}
                <div className="navbar backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl px-4 py-1 bg-black/30">
                    <div className="navbar-start">
                        <div className="dropdown">
                            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> 
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> 
                                </svg>
                            </div>
                            <ul 
                                tabIndex={0} 
                                className="menu menu-sm dropdown-content mt-5 w-52 p-4 shadow-2xl z-1 
                                        rounded-2xl border border-white/10 
                                        bg-black/90 backdrop-blur-xl text-white" 
                            >
                                {links}
                            </ul>
                        </div>
                        <Logo />
                    </div>

                    <div className="navbar-center hidden lg:flex">
                        <ul className="menu menu-horizontal px-1 gap-2 text-white font-medium">
                            {links}
                        </ul>
                    </div>

                    <div className="navbar-end gap-3">
                        {user ? (
                            /* User Present: Show Avatar Dropdown */
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border border-primary/50">
                                    <div className="w-10 rounded-full">
                                        <img 
                                            alt="User Profile" 
                                            src={user?.photoURL || "https://i.ibb.co.com/6JHm0vX/user-placeholder.png"} 
                                        />
                                    </div>
                                </div>
                                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-1 w-52 p-4 shadow-2xl rounded-2xl border border-white/10 bg-black/90 backdrop-blur-xl text-white space-y-2">
                                    <li><NavLink to="/dashboard" className="hover:text-primary transition-all">Dashboard</NavLink></li>
                                    <li><NavLink to="/profile" className="hover:text-primary transition-all">Profile</NavLink></li>
                                    <hr className="border-white/10" />
                                    <li>
                                        <button 
                                            onClick={handleSignOut} 
                                            className="text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all font-bold"
                                        >
                                            Sign Out
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            /* No User: Show Login/Signup */
                            <>
                                {/* Mobile Icons */}
                                <NavLink to="/login" className="sm:hidden text-white text-xl p-2">
                                    <FaSignInAlt />
                                </NavLink>
                                <NavLink to="/register" className="sm:hidden text-primary text-xl p-2">
                                    <FaUserPlus />
                                </NavLink>

                                {/* Desktop Buttons */}
                                <NavLink to="/login" className="btn btn-ghost text-white rounded-full hover:text-primary transition font-medium hidden sm:flex">
                                    Log In
                                </NavLink>
                                <NavLink to="/register" className="hidden sm:flex">
                                    <button className="bg-primary hover:bg-orange-600 btn rounded-full px-8 text-white border-none transition-all shadow-lg">
                                        Sign up
                                    </button>
                                </NavLink>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;