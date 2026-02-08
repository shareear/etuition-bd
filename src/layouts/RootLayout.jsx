import React, { useEffect, useState } from 'react';
import { Outlet, useNavigation } from 'react-router';
import Navbar from '../pages/Navbar';
import Footer from '../pages/Footer';
import Loader from '../components/shared/Loader';
import { Toaster } from 'react-hot-toast';

const RootLayout = () => {
    const [isLoading, setIsLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 2000); // Simulate loading time
        return () => clearTimeout(timer);
    }, []);

    if (isLoading || navigation.state === "loading") {
        return <Loader fullPage={true} />;
    }

    return (
        <div className="min-h-screen flex flex-col">
           <main className="grow relative">
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
           </main>
           <Toaster position="top-right" reverseOrder={false} />
        </div>
    );
};

export default RootLayout;