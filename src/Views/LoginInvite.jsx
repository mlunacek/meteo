import React from 'react';
import { Box, Button, Typography, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function LoginInvite() {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/auth');  // Adjust this route based on your routing setup
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="30vh">
            <Card sx={{ maxWidth: 400, p: 3, textAlign: 'center', boxShadow: 3 }}>
                <CardContent>

                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Please sign in to access this page.
                    </Typography>
                    <Button variant="text" color="primary" onClick={handleLogin}>
                        Sign in
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
}