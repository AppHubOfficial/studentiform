import React, { useState, useEffect } from 'react';
import { Box, IconButton, Alert } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { useNavigate } from 'react-router-dom';

import DrawerMenu from '../components/DrawerMenu';


const DashboardLayout = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const apiUrl = process.env.REACT_APP_API_URL;

    const listMenu = [
        { text: 'Home', icon: <HomeIcon />, path: '/dashboard' },
        { text: 'Profilo', icon: <PersonIcon />, path: '/profilo' },
        { text: 'Gestione utenti', icon: <PeopleAltIcon />, path: '/manage-users' },
    ]

    const handleLogout = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/users/logout`, {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                navigate('/');
            } else {
                console.error("Errore durante logout");
            }
        } catch (error) {
            console.error('Errore durante il logout:', error);
        }
    };

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <IconButton onClick={toggleDrawer(true)} sx={{ alignSelf: 'start', m: 2 }}>
                <MenuIcon />
            </IconButton>

            <DrawerMenu open={open} toggleDrawer={toggleDrawer} handleLogout={handleLogout} listMenu={listMenu} />

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                {children}
            </Box>

        </Box>
    );
};

export default DashboardLayout;
