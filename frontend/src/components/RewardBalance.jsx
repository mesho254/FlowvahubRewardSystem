import React, { useContext, useEffect } from 'react';
import { Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { AuthContext } from '../context/AuthContext.jsx';

const RewardBalance = () => {
    const { userDetails, loading: contextLoading } = useContext(AuthContext);

    if (contextLoading) return <CircularProgress style={{ color: 'white' }} />;

    return (
        <Card style={{ marginTop: '20px' }}>
            <CardContent>
                <Typography variant="h5">Your Points</Typography>
                <Typography variant="h3" style={{ color: '#FBBF24' }}>
                    {userDetails.points || 0}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default RewardBalance;