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
        // Validate salary is a valid number
        if (!salary || typeof salary !== 'number' || salary <= 0) {
            setCardError("Invalid payment amount detected.");
            return;
        }

        // Get authorization token
        const token = localStorage.getItem('access-token');
        
        if (!token) {
            setCardError("Authentication required. Please login again.");
            return;
        }

        // Create payment intent
        axios.post("http://localhost:3000/create-payment-intent", 
            { salary: salary },
            { 
                headers: { 
                    authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                } 
            }
        )
        .then(res => {
            if (res.data.clientSecret) {
                setClientSecret(res.data.clientSecret);
                setCardError("");
            } else {
                setCardError("Failed to initialize payment.");
            }
        })
        .catch(err => {
            console.error("Payment Intent Error:", err.response?.data || err.message);
            const errorMsg = err.response?.data?.message || "Failed to initialize payment. Please try again.";
            setCardError(errorMsg);
        });
    }, [salary]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements || !clientSecret || processing) {
            return;
        }

        setProcessing(true);
        setCardError("");

        const card = elements.getElement(CardElement);

        if (card === null) {
            setProcessing(false);
            return;
        }

        // Confirm card payment
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
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            // Payment successful - save to database
            const paymentInfo = {
                transactionId: paymentIntent.id,
                studentEmail: user.email,
                tutorEmail: tutorEmail,
                salary: salary,
                appId: appId,
                status: "paid",
                date: new Date()
            };

            try {
                const token = localStorage.getItem('access-token');
                
                if (!token) {
                    throw new Error("Authentication token missing");
                }

                const res = await axios.post("http://localhost:3000/payments", 
                    paymentInfo,
                    { 
                        headers: { 
                            authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        } 
                    }
                );

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
                } else {
                    throw new Error("Failed to save payment record");
                }
            } catch (dbError) {
                console.error("Database save error:", dbError);
                Swal.fire({
                    icon: 'warning',
                    title: 'Payment Processed',
                    text: 'Payment was successful but there was an issue saving the record. Please contact support with Transaction ID: ' + paymentIntent.id,
                    confirmButtonColor: '#ea580c'
                });
                setProcessing(false);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50">
                <CardElement
                    options={{
                        hidePostalCode: true, // This removes the ZIP code requirement
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
                disabled={!stripe || !clientSecret || processing || !!cardError}
                className={`btn btn-primary w-full h-12 bg-orange-600 hover:bg-orange-700 border-none text-white font-black uppercase italic tracking-widest rounded-2xl shadow-lg transition-all ${(!stripe || !clientSecret || processing || !!cardError) ? 'opacity-50 cursor-not-allowed' : ''}`}
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
            
            {!clientSecret && !processing && !cardError && (
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