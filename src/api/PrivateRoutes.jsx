import React from 'react';
// import { AuthContext } from '../contexts/AuthProvider/ContextProvider';
import Loader from '../components/shared/Loader';
import { Navigate, useLocation } from 'react-router';
import useAuth from '../hooks/useAuth';

const PrivateRoutes = ({children}) => {
    const {user, loading} = useAuth();
    const location = useLocation();

     if(loading){
        return <Loader></Loader>
     };

     if(!user){
      return <Navigate to="/login" state={location.pathname}></Navigate>
     }

     if(user){
        return children;
     }
    return <Navigate to="/login" state={{from: location}} replace></Navigate>
};

export default PrivateRoutes;