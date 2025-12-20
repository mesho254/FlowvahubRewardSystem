import React, { useState, useEffect, useContext } from 'react';
import { Card, CardContent, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

const Confirm = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const { refreshSession } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleConfirmation = async () => {
            const hash = location.hash.substring(1);
            const params = new URLSearchParams(hash);
            const type = params.get('type');
            const access_token = params.get('access_token');
            const refresh_token = params.get('refresh_token');

            if (type === 'signup' && access_token && refresh_token) {
                try {
                    localStorage.setItem('token', access_token);
                    // Assuming backend uses the same token, or adjust if moving to frontend Supabase
                    await refreshSession(access_token, refresh_token);
                    setMessage('Email confirmed successfully! Redirecting to dashboard...');
                    setTimeout(() => navigate('/'), 3000);
                } catch (err) {
                    setError('Failed to confirm email.');
                }
            } else {
                setError('Invalid confirmation link.');
            }
            setLoading(false);
        };

        handleConfirmation();
    }, [location, navigate, refreshSession]);

    if (loading) return <CircularProgress style={{ color: 'white', margin: 'auto', display: 'block', marginTop: '20%' }} />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Card style={{ marginTop: '100px', maxWidth: '400px', margin: 'auto' }}>
            <CardContent>
                <Typography variant="h5" align="center">Confirmation</Typography>
                {message && <Alert severity="success" style={{ marginBottom: '16px' }}>{message}</Alert>}
                <Button variant="contained" fullWidth onClick={() => navigate('/login')}>
                    Go to Login
                </Button>
            </CardContent>
        </Card>
    );
};

export default Confirm;