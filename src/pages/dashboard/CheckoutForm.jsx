import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2"; 
import { useNavigate } from "react-router";

// Added 'subject' to the props list below
const CheckoutForm = ({ appId, salary, tutorEmail, subject }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [clientSecret, setClientSecret] = useState("");
    const [processing, setProcessing] = useState(false);
    const [cardError, setCardError] = useState("");

    useEffect(() => {
        if (!salary || typeof salary !== 'number' || salary <= 0) {
            setCardError("Invalid payment amount detected.");
            return;
        }

        const token = localStorage.getItem('access-token');
        if (!token) {
            setCardError("Authentication required. Please login again.");
            return;
        }

        axios.post(" https://etuition-bd-server.vercel.app//create-payment-intent", 
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
            }
        })
        .catch(err => {
            console.error("Payment Intent Error:", err);
            setCardError("Failed to initialize payment.");
        });
    }, [salary]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements || !clientSecret || processing) return;

        setProcessing(true);
        setCardError("");
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
            setProcessing(false);
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            
            // --- FIX APPLIED HERE ---
            const paymentInfo = {
                transactionId: paymentIntent.id,
                studentEmail: user.email,
                tutorEmail: tutorEmail,
                subject: subject, // Successfully using the prop now
                salary: salary,
                appId: appId,
                status: "paid",
                date: new Date()
            };

            try {
                const token = localStorage.getItem('access-token');
                const res = await axios.post(" https://etuition-bd-server.vercel.app//payments", 
                    paymentInfo,
                    { headers: { authorization: `Bearer ${token}` } }
                );

                if (res.data.paymentResult.insertedId) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Payment Successful!',
                        text: `Transaction ID: ${paymentIntent.id}`,
                        confirmButtonColor: '#ea580c'
                    }).then(() => {
                        navigate('/dashboard/applied-tutors');
                    });
                }
            } catch (dbError) {
                setProcessing(false);
                Swal.fire({ icon: 'error', title: 'Database Error', text: 'Payment succeeded but record failed to save.' });
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50">
                <CardElement
                    options={{
                        hidePostalCode: true,
                        style: {
                            base: { fontSize: '16px', color: '#1e293b', '::placeholder': { color: '#94a3b8' } },
                            invalid: { color: '#ef4444' },
                        },
                    }}
                />
            </div>
            {cardError && <p className="text-red-500 text-xs font-bold italic">{cardError}</p>}
            <button
                type="submit"
                disabled={!stripe || !clientSecret || processing}
                className="btn btn-primary w-full bg-orange-600 border-none text-white font-black uppercase italic rounded-2xl"
            >
                {processing ? "Processing..." : `Confirm Payment $${salary}`}
            </button>
        </form>
    );
};

export default CheckoutForm;