import React from 'react';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useLocation, useParams } from "react-router";
import CheckoutForm from "./CheckoutForm";

// Ensure this key is in your .env file
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Payment = () => {
    const { id } = useParams();
    const location = useLocation();
    const { salary, tutorEmail, subject } = location.state || {};

    // একমাত্র ফিক্স: স্যালারিকে নম্বর হিসেবে নিশ্চিত করা যাতে স্ট্রাইপ রিকোয়েস্ট না আটকায়
    const numericSalary = salary ? parseFloat(salary.toString().replace(/[$,]/g, '')) : 0;

    if (!numericSalary || numericSalary <= 0) {
        return (
            <div className="p-20 text-center">
                <h2 className="text-2xl font-bold text-red-500">Invalid Session</h2>
                <p>Please go back to Applied Tutors and try again.</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-xl mx-auto">
            <header className="mb-10 text-center">
                <h2 className="text-4xl font-black text-slate-800 uppercase italic">Checkout</h2>
                <div className="mt-4 p-4 bg-orange-50 border border-orange-100 rounded-2xl">
                    <p className="text-slate-600 uppercase text-xs font-bold tracking-widest">Payment for {subject}</p>
                    <h3 className="text-3xl font-black text-orange-600">${numericSalary}</h3>
                </div>
            </header>

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                <Elements stripe={stripePromise}>
                    <CheckoutForm 
                        appId={id} 
                        salary={numericSalary} 
                        tutorEmail={tutorEmail} 
                    />
                </Elements>
            </div>
            <p className="text-center text-slate-400 text-xs mt-6">
                Secured by Stripe. Your data is encrypted.
            </p>
        </div>
    );
};

export default Payment;