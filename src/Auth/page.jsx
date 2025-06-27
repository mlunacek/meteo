import { useState, useEffect } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import PageContainer from '@/utils/PageContainer';
import { fetchAuthSession } from 'aws-amplify/auth';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/Auth/useAuth';

const formFields = {
    signUp: {
        name: {
            label: 'Full name',
            placeholder: 'Enter your full name',
            isRequired: true,
            type: 'name',
            order: 1
        },
        email: {
            label: 'Email',
            placeholder: 'Enter your email',
            isRequired: true,
            type: 'email',
            order: 2
        }
    }
};




const AuthenticatedUser = ({ user, signOut }) => {

    const { setUser } = useAuth();

    const [accessToken, setAccessToken] = useState(null);
    useEffect(() => {
        const fetchToken = async () => {
            try {
                const session = await fetchAuthSession();
                const token = session.tokens?.accessToken?.toString(); // or .idToken
                // console.log("session.tokens?.accessToken.payload.exp", session.tokens?.accessToken.payload.exp)
                setAccessToken(token || null);
            } catch (error) {
                console.error('Failed to fetch access token:', error);
                setAccessToken(null);
            }
        };

        fetchToken(); // Call the async function
    }, [user]); // Empty dependency array means this runs once on mount

    useEffect(() => {
        if (!user) return;
        setUser(user);
        // console.log("storing user", user, accessToken)
    }, [user, accessToken]);



    return (
        <Navigate to={'/'} replace={true} />
    );
};


export const AuthPage = () => {

    return (
        <PageContainer>
            <Authenticator
                loginMechanisms={['email']}
                formFields={formFields}
            >
                {({ signOut, user }) => (
                    <AuthenticatedUser user={user} signOut={signOut} />
                    // <LoginRedirect />
                )}
            </Authenticator>
        </PageContainer >
    );
};
