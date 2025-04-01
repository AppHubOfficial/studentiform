import React, { useState, useEffect } from 'react';
import { Button, Box, Alert, CircularProgress} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

import SearchComponent from '../components/SearchComponent';
import TableDataComponent from '../components/TableDataComponent';
import DrawerMenu from '../components/DrawerMenu';
import DashboardLayout from '../components/DashboardLayout';

import fetchData from '../scripts/fetchData';


import '../assets/styles/Profilo.css';

const apiUrl = process.env.REACT_APP_API_URL;

function ManageUsers() {

    const navigate = useNavigate();

    const [selectedRole, setSelectedRole] = useState("");
    const [open, setOpen] = useState(false);
    const [textSearchInput, setTextSearchInput] = useState("");
    const [valueDistance, setValueDistance] = useState([0, 100]);
    const [usersData, setUsersData] = useState(null);
    const [tempUsersData, setTempUsersData] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [messageErrorLoading, setMessageErrorLoading] = useState("");
    const [errorTimeout, setErrorTimeout] = useState(false);
    const TIMEOUT = 6000;

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await fetchData('getProfileData');
                if (!data) {
                    navigate('/');
                } else {
                    setProfileData(data);
                }
            } catch (err) {
                setError('Errore nel caricamento dei dati utente.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        if (!profileData) return;
        
        const fetchAllData = async () => {
            try {
                const data = await fetchData('getUsersData');
                if (!data) {
                    navigate('/');
                } else {
                    setUsersData(data);
                    setTempUsersData(data);
                }
            } catch (err) {
                setError('Errore nel caricamento dei dati degli utenti.');
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [profileData])

    const handleChangeRoles = (event) => {
        setSelectedRole(event.target.value);
    };

    const handleChangeDistance = (newValue) => {
        setValueDistance(newValue);
    };

    const handleSearchInput = (event) => {
        setTextSearchInput(event.target.value);
    }

    useEffect(() => {
        let filteredUsersData = tempUsersData || [];
    
        if (textSearchInput.trim().toLowerCase() !== "") {
            filteredUsersData = filteredUsersData.filter(user => {
                return (
                    user.nome.toLowerCase().includes(textSearchInput) ||
                    user.email.toLowerCase().includes(textSearchInput) ||
                    user.tel.toLowerCase().includes(textSearchInput)
                );
            });
        }
    
        if (selectedRole && selectedRole !== "all") {
            filteredUsersData = filteredUsersData.filter(user => {
                return user.role.includes(selectedRole);
            });
        }
    
        if (valueDistance) {
            filteredUsersData = filteredUsersData.filter(user => {
                return user.distance >= valueDistance[0] && user.distance <= valueDistance[1];
            });
        }
    
        setUsersData(filteredUsersData);
    
    }, [selectedRole, textSearchInput, valueDistance, tempUsersData]);

    if (loading) {
        return (
            <DashboardLayout>
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <CircularProgress />
                </Box>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <Alert
                    className='info'
                    severity="error">{error},
                </Alert>
            </DashboardLayout>
        );
    }


    return (
        <Box>
            <DashboardLayout>
                {profileData && profileData[0].role === "insegnante" && (
                    <Box>
                        <TableDataComponent usersData={usersData} />
                    </Box>
                )}
            </DashboardLayout>


        </Box>
    );
}

export default ManageUsers;
