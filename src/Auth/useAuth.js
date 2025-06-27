import { useEffect, useState } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import { useAtom } from 'jotai';
import { userAtom } from './atoms';

export const useAuth = () => {
    const [user, setUser] = useAtom(userAtom);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user === null) {
            setLoading(true);
            getCurrentUser()
                .then(setUser)
                .catch(() => setUser(null))
                .finally(() => setLoading(false));
        }
    }, [user, setUser]);

    return {
        user,
        isAuthenticated: !!user,
        loading,
        setUser, // <- expose this so you can manually update it
    };
};