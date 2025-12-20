import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Snackbar, Alert, Box } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const Referral = () => {
    const [open, setOpen] = useState(false);
    const referralLink = 'https://flowvahub.com/refer?user=123'; // Mock, fetch from backend if dynamic

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setOpen(true);
    };

    return (
        <Card style={{ marginTop: '20px' }}>
            <CardContent>
                <Typography variant="h5">Referral Program</Typography>
                <Typography>Refer friends and earn 200 points each!</Typography>
                <Box display="flex" alignItems="center" mt={2}>
                    <Typography variant="body1" style={{ flexGrow: 1 }}>{referralLink}</Typography>
                    <Button onClick={handleCopy} startIcon={<ContentCopyIcon />} style={{ color: 'white' }}>Copy</Button>
                </Box>
            </CardContent>
            <Snackbar open={open} autoHideDuration={2000} onClose={() => setOpen(false)}>
                <Alert severity="success">Link copied!</Alert>
            </Snackbar>
        </Card>
    );
};

export default Referral;