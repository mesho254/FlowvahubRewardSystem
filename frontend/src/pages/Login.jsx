import React, { useState, useContext } from 'react';
import { Card, CardContent, Typography, TextField, Button, CircularProgress, Alert, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showResend, setShowResend] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.includes('@') || password.length < 6) {
            setError('Invalid email or password (min 6 chars)');
            return;
        }
        setLoading(true);
        setError(null);
        const success = await login(email, password);
        setLoading(false);
        if (success) {
            navigate('/');
        } else {
            setError('Login failed. Check credentials.');
            setShowResend(true);  // Assume might need resend; in real, check error message for 'Email not confirmed'
        }
    };

    const handleResend = async () => {
        try {
            await axios.post('/api/auth/resend-confirmation', { email });
            setError('Confirmation email resent. Check your inbox.');
            setShowResend(false);
        } catch (err) {
            setError('Failed to resend confirmation.');
        }
    };

    return (
        <Card style={{ marginTop: '100px', maxWidth: '400px', margin: 'auto' }}>
            <CardContent>
                <Typography variant="h5" align="center">Login</Typography>
                {error && <Alert severity="error" style={{ marginBottom: '16px' }}>{error}</Alert>}
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
                        {loading ? <CircularProgress size={24} style={{ color: 'white' }} /> : 'Login'}
                    </Button>
                </form>
                {showResend && (
                    <Typography align="center" style={{ marginTop: '16px' }}>
                        Email not confirmed? <Link onClick={handleResend} style={{ cursor: 'pointer' }}>Resend confirmation</Link>
                    </Typography>
                )}
                <Typography align="center" style={{ marginTop: '16px' }}>
                    No account? <Link href="/signup">Sign up</Link>
                </Typography>
            </CardContent>
        </Card>
    );
};

export default Login;