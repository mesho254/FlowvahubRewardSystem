import React, { useState, useContext } from 'react';
import { Card, CardContent, Typography, TextField, Button, CircularProgress, Alert, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import axios from 'axios';

const Settings = () => {
    const { userDetails, fetchUserDetails } = useContext(AuthContext);
    const [displayName, setDisplayName] = useState(userDetails.display_name || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await axios.post('https://flowvahub-reward-system.vercel.app/api/rewards/profile', { display_name: displayName });
            await fetchUserDetails();
            setSuccess('Profile updated successfully');
        } catch (err) {
            setError('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            setError('New password must be at least 6 characters');
            return;
        }
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await axios.post('https://flowvahub-reward-system.vercel.app/api/auth/change-password', { currentPassword, newPassword });
            setSuccess('Password changed successfully');
            setCurrentPassword('');
            setNewPassword('');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card style={{ marginTop: '20px' }}>
            <CardContent>
                <Typography variant="h5">Settings</Typography>
                {error && <Alert severity="error" style={{ marginBottom: '16px' }}>{error}</Alert>}
                {success && <Alert severity="success" style={{ marginBottom: '16px' }}>{success}</Alert>}

                <Typography variant="h6" style={{ marginTop: '20px' }}>Profile Information</Typography>
                <form onSubmit={handleUpdateProfile}>
                    <TextField
                        label="Display Name"
                        fullWidth
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        style={{ marginBottom: '16px' }}
                    />
                    <TextField
                        label="Email"
                        fullWidth
                        value={userDetails.email}
                        disabled
                        style={{ marginBottom: '16px' }}
                    />
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? <CircularProgress size={24} style={{ color: 'white' }} /> : 'Update Profile'}
                    </Button>
                </form>

                <Divider style={{ margin: '20px 0' }} />

                <Typography variant="h6">Change Password</Typography>
                <form onSubmit={handleChangePassword}>
                    <TextField
                        label="Current Password"
                        type="password"
                        fullWidth
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        style={{ marginBottom: '16px' }}
                    />
                    <TextField
                        label="New Password"
                        type="password"
                        fullWidth
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        style={{ marginBottom: '16px' }}
                    />
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? <CircularProgress size={24} style={{ color: 'white' }} /> : 'Change Password'}
                    </Button>
                </form>

                <Button onClick={() => navigate('/')} style={{ marginTop: '20px' }}>Back to Rewards</Button>
            </CardContent>
        </Card>
    );
};

export default Settings;