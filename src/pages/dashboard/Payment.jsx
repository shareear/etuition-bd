import React from 'react';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useLocation, useParams, useNavigate } from "react-router";
import CheckoutForm from "./CheckoutForm";
import { useEffect } from 'react';

// Stripe Public Key Load
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Payment = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    
    // location.state থেকে ডাটা রিসিভ করা
    const { salary, tutorEmail, subject } = location.state || {};

    // Validate and clean salary
    const cleanSalary = salary ? parseFloat(salary.toString().replace(/[$,]/g, '')) : 0;

    // Token verification
    const token = localStorage.getItem('access-token');

    // Validate required data
    useEffect(() => {
        // If critical data is missing, redirect back
        if (!id || !tutorEmail || !cleanSalary || cleanSalary <= 0 || !token) {
            console.error("Payment page error: Missing required data");
        }
    }, [id, tutorEmail, cleanSalary, token]);

    // Show error state if validation fails
    if (!token) {
        return (
            <div className="p-20 text-center">
                <h2 className="text-2xl font-black text-red-500 uppercase italic">
                    Authentication Required
                </h2>
                <p className="text-slate-500 mt-4">
                    Please login to continue with payment.
                </p>
                <button 
                    onClick={() => navigate('/login')}
                    className="mt-6 btn bg-orange-600 hover:bg-orange-700 text-white"
                >
                    Go to Login
                </button>
            </div>
        );
    }

    if (!cleanSalary || cleanSalary <= 0) {
        return (
            <div className="p-20 text-center">
                <h2 className="text-2xl font-black text-red-500 uppercase italic">
                    Invalid Payment Amount
                </h2>
                <p className="text-slate-500 mt-4">
                    The payment amount is invalid. Please go back and try again.
                </p>
                <button 
                    onClick={() => navigate('/dashboard/applied-tutors')}
                    className="mt-6 btn bg-orange-600 hover:bg-orange-700 text-white"
                >
                    Back to Applied Tutors
                </button>
            </div>
        );
    }

    if (!id || !tutorEmail) {
        return (
            <div className="p-20 text-center">
                <h2 className="text-2xl font-black text-red-500 uppercase italic">
                    Invalid Session
                </h2>
                <p className="text-slate-500 mt-4">
                    Required information is missing. Please go back to Applied Tutors and try again.
                </p>
                <button 
                    onClick={() => navigate('/dashboard/applied-tutors')}
                    className="mt-6 btn bg-orange-600 hover:bg-orange-700 text-white"
                >
                    Back to Applied Tutors
                </button>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-xl mx-auto">
            <header className="mb-10 text-center">
                <h2 className="text-4xl font-black text-slate-800 uppercase italic tracking-tighter">Checkout</h2>
                <div className="mt-4 p-6 bg-orange-50 border border-orange-100 rounded-4xl shadow-sm">
                    <p className="text-slate-500 uppercase text-[10px] font-bold tracking-widest mb-1">
                        Tuition Fee for {subject || "Selected Course"}
                    </p>
                    <h3 className="text-4xl font-black text-orange-600 italic">
                        ${cleanSalary.toFixed(2)}
                    </h3>
                    <p className="text-[9px] text-orange-400 font-bold uppercase mt-2 italic">
                        Tutor: {tutorEmail}
                    </p>
                </div>
            </header>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
                <Elements stripe={stripePromise}>
                    <CheckoutForm 
                        appId={id} 
                        salary={cleanSalary}
                        tutorEmail={tutorEmail} 
                    />
                </Elements>
            </div>
            
            <div className="flex flex-col items-center gap-2 mt-8">
                <div className="flex items-center gap-2 opacity-40 grayscale">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-5" />
                </div>
                <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-tight">
                    Secured by Stripe • AES-256 Encryption
                </p>
            </div>
        </div>
    );
};

export default Payment;