import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2"; 
import { useNavigate } from "react-router";

const CheckoutForm = ({ appId, salary, tutorEmail }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [clientSecret, setClientSecret] = useState("");
    const [processing, setProcessing] = useState(false);
    const [cardError, setCardError] = useState("");

    useEffect(() => {
        // ফিক্স: স্যালারি থেকে যেকোনো নন-নিউমেরিক ক্যারেক্টার ($ বা কমা) সরিয়ে শুধু নম্বর নেওয়া
        const cleanSalary = salary ? salary.toString().replace(/[$,]/g, '') : "0";
        const amount = parseFloat(cleanSalary);

        // স্ট্রিক্ট চেক: যদি স্যালারি ভ্যালিড নম্বর হয় তবেই ব্যাকএন্ডে রিকোয়েস্ট যাবে
        if (!isNaN(amount) && amount > 0) {
            axios.post("http://localhost:3000/create-payment-intent", { salary: amount })
                .then(res => {
                    setClientSecret(res.data.clientSecret);
                })
                .catch(err => {
                    console.error("Backend Error:", err.response?.data || err.message);
                    setCardError("Failed to initialize payment. Please try again.");
                });
        } else {
            setCardError("Invalid payment amount detected.");
        }
    }, [salary]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements || !clientSecret || processing) return;

        setProcessing(true);
        const card = elements.getElement(CardElement);

        if (card === null) {
            setProcessing(false);
            return;
        }

        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
                billing_details: { 
                    email: user?.email || 'anonymous', 
                    name: user?.displayName || 'anonymous' 
                }
            }
        });

        if (confirmError) {
            setCardError(confirmError.message);
            Swal.fire({
                icon: 'error',
                title: 'Payment Failed',
                text: confirmError.message,
                confirmButtonColor: '#ea580c'
            });
            setProcessing(false);
        } else {
            setCardError("");
            if (paymentIntent.status === "succeeded") {
                // পেমেন্ট সফল হওয়ার পর ডেটাবেজে পাঠানোর জন্য স্যালারি পুনরায় ক্লিন করা
                const finalSalary = parseFloat(salary.toString().replace(/[$,]/g, '')) || 0;

                const paymentInfo = {
                    transactionId: paymentIntent.id,
                    studentEmail: user.email,
                    tutorEmail,
                    salary: finalSalary,
                    appId,
                    status: "paid",
                    date: new Date()
                };

                try {
                    const res = await axios.post("http://localhost:3000/payments", paymentInfo);
                    if (res.data.paymentResult.insertedId) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Payment Successful!',
                            text: `Transaction ID: ${paymentIntent.id}`,
                            confirmButtonColor: '#ea580c',
                            background: '#fff',
                            customClass: { popup: 'rounded-3xl' }
                        }).then((result) => {
                            if (result.isConfirmed) {
                                navigate('/dashboard/applied-tutors');
                            }
                        });
                    }
                } catch (dbError) {
                    console.error("Database save error:", dbError);
                    setProcessing(false);
                }
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#1e293b',
                                '::placeholder': { color: '#94a3b8' },
                            },
                            invalid: { color: '#ef4444' },
                        },
                    }}
                    onChange={(e) => {
                        setCardError(e.error ? e.error.message : "");
                    }}
                />
            </div>
            
            {cardError && <p className="text-red-500 text-xs font-bold px-2 italic">{cardError}</p>}

            <button
                type="submit"
                disabled={!stripe || !clientSecret || processing}
                className={`btn btn-primary w-full h-12 bg-orange-600 hover:bg-orange-700 border-none text-white font-black uppercase italic tracking-widest rounded-2xl shadow-lg transition-all ${(!stripe || !clientSecret || processing) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {processing ? (
                    <div className="flex items-center gap-2 justify-center">
                        <span className="loading loading-spinner loading-xs"></span>
                        Processing...
                    </div>
                ) : (
                    `Confirm Payment $${salary}`
                )}
            </button>
            
            {!clientSecret && !processing && (
                <div className="text-center">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                        Initializing secure connection...
                    </p>
                </div>
            )}
        </form>
    );
};

export default CheckoutForm;