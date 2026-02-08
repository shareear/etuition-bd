import React from 'react';
import { Link } from 'react-router';
import Lottie from 'lottie-react';
// Tip: Go to LottieFiles, search for "404 education" or "404 error", 
// download the JSON and save it in your assets folder.
import errorAnimation from '../../../assets/404-animation.json'; 

const Notfound = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-5 py-10">
            {/* Lottie Animation Container */}
            <div className="w-full max-w-lg mb-8">
                <Lottie 
                    animationData={errorAnimation} 
                    loop={true} 
                    className="h-64 md:h-96"
                />
            </div>

            {/* Error Text Content */}
            <div className="text-center space-y-4">
                <h1 className="text-6xl md:text-8xl font-black text-orange-600">
                    404
                </h1>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Oops! This page is playing truant.
                </h2>
                <p className="text-gray-600 max-w-md mx-auto">
                    We couldn't find the page you were looking for. It might have been moved, 
                    deleted, or perhaps it never existed in our curriculum!
                </p>

                {/* Call to Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <Link 
                        to="/" 
                        className="btn bg-orange-600 hover:bg-orange-700 text-white border-none px-8 font-bold shadow-lg transform hover:scale-105 transition-all"
                    >
                        Go Back Home
                    </Link>
                    <button 
                        onClick={() => window.history.back()}
                        className="btn btn-outline border-orange-600 text-orange-600 hover:bg-orange-50 px-8"
                    >
                        Previous Page
                    </button>
                </div>
            </div>

            {/* Footer-like subtle link */}
            <p className="mt-12 text-sm text-gray-400 italic">
                Need help? <Link to="/contact" className="underline hover:text-orange-500">Contact Support</Link>
            </p>
        </div>
    );
};

export default Notfound;