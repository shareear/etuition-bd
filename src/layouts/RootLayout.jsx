import React from 'react';
import { Outlet, useNavigation } from 'react-router';
import Navbar from '../pages/Navbar';
import Footer from '../pages/Footer';
import Loader from '../components/shared/Loader';
import { Toaster } from 'react-hot-toast';

const RootLayout = () => {
    const navigation = useNavigation();

    const isLoading = navigation.state === "loading"
    return (
        <div className="min-h-screen flex flex-col">
           <main className="grow relative">
            {isLoading && <Loader fullPage={true}></Loader>}
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
           </main>
           <Toaster position="top-right" reverseOrder={false} />
        </div>
    );
};

export default RootLayout;