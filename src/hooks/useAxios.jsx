import axios from 'axios';
import { useMemo, useContext } from 'react'; // useAuth বা AuthContext ব্যবহার করুন
import { AuthContext } from '../providers/AuthContext';

const useAxios = () => {
    const { signOutUser } = useContext(AuthContext); // দরকার হলে লগআউট করানোর জন্য

    const axiosInstance = useMemo(() => {
        const instance = axios.create({
            baseURL: ' http://localhost:3000',
        });

        // console.log(instance);
        // ১. Request Interceptor: প্রতিটি রিকোয়েস্ট পাঠানোর আগে টোকেন যোগ করবে
        instance.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('access-token');
                if (token) {
                    config.headers.authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // ২. Response Interceptor: যদি টোকেন এক্সপায়ার হয় (৪০১ বা ৪০৩ এরর), তবে অটো লগআউট করবে
        instance.interceptors.response.use(
            (response) => {
                return response;
            },
            async (error) => {
                const status = error.response ? error.response.status : null;
                if (status === 401 || status === 403) {
                    // টোকেন ইনভ্যালিড হলে ইউজারকে বের করে দেওয়া নিরাপদ
                    await signOutUser();
                }
                return Promise.reject(error);
            }
        );

        return instance;
    }, [signOutUser]);

    return axiosInstance;
};

export default useAxios;