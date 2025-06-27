import { useEffect, useState } from 'react';
import { Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
    getCurrentUser,
    fetchUserAttributes,
    signInWithRedirect,
    signOut,
} from '@aws-amplify/auth';
import { Authenticator } from '@aws-amplify/ui-react';

import { useAuth } from '@/Auth/useAuth';


const AuthButton = () => {
    const navigate = useNavigate();
    const { user, setUser } = useAuth();

    const checkUser = async () => {
        try {
            const currentUser = await getCurrentUser();
            const attributes = await fetchUserAttributes();
            setUser(currentUser);
        } catch {
            setUser(null);
        }
    };

    useEffect(() => {
        checkUser();
    }, []);

    const handleSignIn = () => {
        navigate('/auth')
    };

    const handleSignOut = async () => {
        await signOut();
        setUser(null);
    };

    // console.log("Button:user", user)

    return (
        <Box>
            {user === null ?
                <Button onClick={handleSignIn}>Sign in</Button>
                :
                <Box>
                    {/* <span>Welcome, {user.signInDetails?.loginId || 'user'}</span> */}
                    <Button onClick={handleSignOut}>Logout</Button>
                </Box>
            }
        </Box>
    );
};

export default AuthButton;
