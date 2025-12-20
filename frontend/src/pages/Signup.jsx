import React, { useState, useContext } from 'react';
import { Card, CardContent, Typography, TextField, Button, CircularProgress, Alert, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import axios from 'axios';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.includes('@') || password.length < 6) {
            setError('Invalid email or password (min 6 chars)');
            return;
        }
        setLoading(true);
        setError(null);
        setMessage(null);
        const success = await signup(email, password, window.location.origin);
        setLoading(false);
        if (success) {
            setMessage('Signup successful! Check your email to confirm your account.');
        } else {
            setError('Signup failed. Email may be in use.');
        }
    };

    return (
        <Card style={{ marginTop: '100px', maxWidth: '400px', margin: 'auto' }}>
            <CardContent>
                <Typography variant="h5" align="center">Sign Up</Typography>
                {error && <Alert severity="error" style={{ marginBottom: '16px' }}>{error}</Alert>}
                {message && <Alert severity="success" style={{ marginBottom: '16px' }}>{message}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ marginBottom: '16px' }}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ marginBottom: '16px' }}
                    />
                    <Button type="submit" variant="contained" fullWidth disabled={loading}>
                        {loading ? <CircularProgress size={24} style={{ color: 'white' }} /> : 'Sign Up'}
                    </Button>
                </form>
                <Typography align="center" style={{ marginTop: '16px' }}>
                    Have account? <Link href="/login">Login</Link>
                </Typography>
            </CardContent>
        </Card>
    );
};

export default Signup;