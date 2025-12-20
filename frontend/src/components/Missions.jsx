import React, { useState, useEffect, useContext } from 'react';
import { Card, CardContent, Typography, Button, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';

const Missions = () => {
    const [missions, setMissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const { fetchUserDetails } = useContext(AuthContext);

    const fetchMissions = async () => {
        try {
            const res = await axios.get('/api/rewards/missions');
            setMissions(res.data);
        } catch (err) {
            setError('Failed to load missions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMissions();
    }, []);

    const handleClaim = async (id) => {
        try {
            await axios.post('/api/rewards/claim-mission', { missionId: id });

            // Optimistic UI: mark as completed immediately
            setMissions(missions.map(m => m.id === id ? { ...m, completed: true } : m));

            // Refresh points globally
            await fetchUserDetails();

            setSuccess('Mission claimed! Points added.');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Claim failed');
            setTimeout(() => setError(null), 4000);
        }
    };

    if (loading) return <CircularProgress style={{ color: 'white' }} />;
    if (missions.length === 0) return <Typography>No missions available</Typography>;

    return (
        <Card style={{ marginTop: '20px' }}>
            <CardContent>
                <Typography variant="h5">Missions</Typography>
                {success && <Alert severity="success" style={{ marginBottom: '16px' }}>{success}</Alert>}
                {error && <Alert severity="error" style={{ marginBottom: '16px' }}>{error}</Alert>}

                <List>
                    {missions.map(m => (
                        <ListItem key={m.id}>
                            <ListItemText
                                primary={m.name}
                                secondary={`${m.points} points`}
                            />
                            <Button
                                disabled={m.completed}
                                onClick={() => handleClaim(m.id)}
                                variant="contained"
                            >
                                {m.completed ? 'Claimed' : 'Claim'}
                            </Button>
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
};

export default Missions;