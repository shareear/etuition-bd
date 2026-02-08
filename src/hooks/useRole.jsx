import { useState, useEffect } from 'react';
import useAuth from "../hooks/useAuth";
import axios from "axios";

const useRole = () => {
    const { user, loading } = useAuth();
    const [role, setRole] = useState(null);
    const [roleLoading, setRoleLoading] = useState(true);

    useEffect(() => {
        if (user?.email) {
            // URL ঠিক করা হয়েছে এখানে
            axios.get(`http://localhost:3000/users/role/${user.email}`)
                .then(res => {
                    setRole(res.data.role);
                    setRoleLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching role:", err);
                    setRoleLoading(false);
                });
        } else if (!loading) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setRoleLoading(false);
        }
    }, [user, loading]);

    return [role, roleLoading];
};

export default useRole;