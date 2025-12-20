import React, { useContext, useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    Box,
    Divider,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

const Header = () => {
    const { user, userDetails, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSettings = () => {
        handleClose();
        navigate('/settings');
    };

    const handleLogout = async () => {
        handleClose();
        await logout();
        navigate('/login');
    };

    // Avatar letter fallback
    const avatarLetter = (userDetails.display_name || userDetails.email || '?').charAt(0).toUpperCase();

    return (
        <AppBar position="static" color="transparent" elevation={0} style={{ background: 'transparent', marginBottom: '20px' }}>
            <Toolbar>
                <LightbulbIcon style={{ color: '#FBBF24', marginRight: '8px' }} />
                <Typography variant="h6" sx={{ flexGrow: 1 }}>Flowva</Typography>

                <Button color="inherit" sx={{ color: 'white' }}>Missions</Button>
                <Button color="inherit" sx={{ color: 'white', mx: 1 }}>Rewards</Button>
                <Button color="inherit" sx={{ color: 'white' }}>Growth</Button>

                {user && (
                    <IconButton onClick={handleAvatarClick} sx={{ ml: 2 }}>
                        <Avatar
                            sx={{
                                bgcolor: '#6D28D9', // Purple to match theme
                                color: 'white',
                                width: 40,
                                height: 40,
                            }}
                        >
                            {avatarLetter}
                        </Avatar>
                    </IconButton>
                )}

                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        sx: {
                            mt: 1,
                            minWidth: 220,
                            bgcolor: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                        },
                    }}
                >
                    {/* User details section */}
                    <Box sx={{ px: 2, py: 1.5 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                            {userDetails.display_name || userDetails.email}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {userDetails.email}
                        </Typography>
                        <Typography variant="body2" color="primary" sx={{ mt: 0.5 }}>
                            Points: {userDetails.points || 0}
                        </Typography>
                    </Box>

                    <Divider />

                    <MenuItem onClick={handleSettings}>
                        <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
                        <ListItemText>Settings</ListItemText>
                    </MenuItem>

                    <MenuItem onClick={handleLogout}>
                        <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                        <ListItemText>Logout</ListItemText>
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Header;