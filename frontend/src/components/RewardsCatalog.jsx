import React, { useState, useEffect, useContext } from 'react';
import { Card, CardContent, Typography, Button, Grid, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';

const RewardsCatalog = () => {
    const [rewards, setRewards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const { fetchUserDetails } = useContext(AuthContext);

    useEffect(() => {
        const fetchRewards = async () => {
            try {
                const res = await axios.get('/api/rewards/rewards');
                setRewards(res.data);
            } catch (err) {
                setError('Failed to load rewards');
            } finally {
                setLoading(false);
            }
        };
        fetchRewards();
    }, []);

    const handleRedeem = async (id) => {
        try {
            await axios.post('/api/rewards/redeem', { rewardId: id });

            // Refresh points instantly
            await fetchUserDetails();

            setSuccess('Reward redeemed successfully!');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Insufficient points or redeem failed');
            setTimeout(() => setError(null), 4000);
        }
    };

    if (loading) return <CircularProgress style={{ color: 'white' }} />;
    if (rewards.length === 0) return <Typography>No rewards available</Typography>;

    return (
        <Card style={{ marginTop: '20px' }}>
            <CardContent>
                <Typography variant="h5">Rewards Catalog</Typography>
                {success && <Alert severity="success" style={{ marginBottom: '16px' }}>{success}</Alert>}
                {error && <Alert severity="error" style={{ marginBottom: '16px' }}>{error}</Alert>}

                <Grid container spacing={2}>
                    {rewards.map(r => (
                        <Grid item xs={12} md={6} key={r.id}>
                            <Card style={{ background: 'rgba(255,255,255,0.2)' }}>
                                <CardContent>
                                    <Typography variant="h6">{r.name}</Typography>
                                    <Typography>{r.description}</Typography>
                                    <Typography style={{ color: '#FBBF24', fontWeight: 'bold' }}>
                                        {r.cost} points
                                    </Typography>
                                    <Button
                                        onClick={() => handleRedeem(r.id)}
                                        variant="contained"
                                        fullWidth
                                        style={{ marginTop: '10px' }}
                                    >
                                        Redeem
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
        </Card>
    );
};

export default RewardsCatalog;