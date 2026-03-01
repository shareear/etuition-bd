import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { auth } from "../utils/firebase.init";
import axios from 'axios'; // axios ইমপোর্ট করুন

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({children}) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    const signInWithGoogle = ()=>{
        setLoading(true);
        return signInWithPopup(auth ,googleProvider);
    };

    const createUserWithEmail = (email, password) =>{
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const signInWithEmail = (email, password)=>{
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password);
    };

    const updateUserProfile = (profile) =>{
        return updateProfile(auth.currentUser, profile)
    };

    const resetPassword = (email) =>{
        setLoading(true);
        return sendPasswordResetEmail(auth, email);
    }

    const signOutUser = () =>{
        setLoading(true);
        // লগআউট করলে টোকেন রিমুভ করে দেওয়া ভালো
        localStorage.removeItem('access-token');
        return signOut(auth);
    };

    useEffect(()=>{
        const unsubcribe = onAuthStateChanged(auth, async (currentUser)=>{
            setUser(currentUser);
            
            if (currentUser) {
                // ইউজার থাকলে ব্যাকএন্ড থেকে টোকেন নিয়ে আসা
                const userInfo = { email: currentUser.email };
                axios.post(' https://etuition-bd-server.vercel.app/jwt', userInfo)
                    .then(res => {
                        if (res.data.token) {
                            localStorage.setItem('access-token', res.data.token);
                            setLoading(false);
                        }
                    })
            } else {
                localStorage.removeItem('access-token');
                setLoading(false);
            }
        });

        return () => unsubcribe();
    }, []);

    const authinfo = {
        signInWithGoogle,
        createUserWithEmail,
        signInWithEmail,
        signOutUser,
        user,
        loading,
        updateUserProfile,
        resetPassword
    }
    return (
        <AuthContext.Provider value={authinfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;