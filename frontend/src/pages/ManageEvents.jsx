import React, { useState, useEffect } from 'react';
import { Button, Box, Alert, CircularProgress, TextField, InputAdornment, IconButton, Grid, InputLabel, Select, MenuItem } from '@mui/material';

import { useNavigate, useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

import SearchComponent from '../components/SearchComponent';
import TableDataComponent from '../components/TableDataComponent';
import DrawerMenu from '../components/DrawerMenu';
import DashboardLayout from '../components/DashboardLayout';

import fetchData from '../scripts/fetchData';


import '../assets/styles/Profilo.css';

const apiUrl = process.env.REACT_APP_API_URL;

function ManageUsers() {

    const navigate = useNavigate();

    const [textSearchInput, setTextSearchInput] = useState("");
    const [valueDistance, setValueDistance] = useState([0, 100]);
    const [cogestioneData, setCogestioneData] = useState(null);
    const [tempUsersData, setTempUsersData] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [messageErrorLoading, setMessageErrorLoading] = useState("");
    const [errorTimeout, setErrorTimeout] = useState(false);
    const TIMEOUT = 6000;

    const classi = [
        "1AE", "1AI", "1AM", "1AS", "1BI", "1BMT",
        "2AET", "2AI", "2AM", "2AS",
        "3AET", "3AI", "3AM", "3AS", "3BI",
        "4AE", "4AI", "4AM", "4AS",
        "5AEM", "5AI", "5AS"
    ];

    const [classeSel, setClasseSel] = useState('');
    const handleChange = (e) => {
        const { value } = e.target;
        setClasseSel(value);
      };

    const handleSearchInput = (event) => {
        setTextSearchInput(event.target.value);
    }

    const columnsTable = [
        { field: 'nome', headerName: 'Nome', width: 130 },
        { field: 'cognome', headerName: 'Cognome', width: 130 },
        { field: 'classe', headerName: 'Classe', width: 130 },
        { field: 'm1', headerName: 'Mercoledì 1° modulo', width: 150 },
        { field: 'm2', headerName: 'Mercoledì 2° modulo', width: 150 },
        { field: 'm3', headerName: 'Mercoledì 3° modulo', width: 150 },

        { field: 'g1', headerName: 'Giovedì 1° modulo', width: 150 },
        { field: 'g2', headerName: 'Giovedì 2° modulo', width: 150 },
        { field: 'g3', headerName: 'Giovedì 3° modulo', width: 150 },

        { field: 'pomeriggio', headerName: 'Pomeriggio', width: 130 },
        { field: 'mangioScuola', headerName: 'Mangio a Scuola', width: 130 },

        {
            field: 'created_at',
            headerName: 'Creato il giorno',
            width: 160,
            valueGetter: (params) => {
                if (!params.value) return '';
                return formatDate(params.value);
            },
        },
    ];

    function formatDate(dateString) {
        const regex = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/;
        const match = dateString.match(regex);

        if (!match) return null;

        const [, year, month, day, hour, minute] = match;
        return `${day}/${month}/${year}, ${hour}:${minute}`;
    };

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
        if (!profileData || profileData[0]?.role !== "insegnante") return;

        const fetchAllData = async () => {
            try {
                const data = await fetchData('getDataCogestione');
                if (!data) {
                    navigate('/');
                } else {
                    setCogestioneData(data);
                    setTempUsersData(data);
                    console.log(data)
                }
            } catch (err) {
                setError('Errore nel caricamento dei dati degli utenti.');
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [profileData])

    useEffect(() => {
        let filteredUsersData = tempUsersData || [];

        if (textSearchInput.trim().toLowerCase() !== "") {
            filteredUsersData = filteredUsersData.filter(user => {
                return (
                    user.nome.toLowerCase().includes(textSearchInput) ||
                    user.cognome.toLowerCase().includes(textSearchInput)
                );
            });
        }

        if (classeSel !== "") {
            filteredUsersData = filteredUsersData.filter(user => {
                return (
                    user.classe.includes(classeSel)
                );
            });
        }

        setCogestioneData(filteredUsersData);

    }, [textSearchInput, tempUsersData, classeSel]);


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
                {cogestioneData && profileData[0].role === "insegnante" && (
                    <Box>
                        <SearchComponent>
                            <TextField
                                style={{ maxWidth: '450px', marginBottom: '50px' }}
                                fullWidth
                                label="Cerca"
                                variant="outlined"
                                onChange={handleSearchInput}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton>
                                                <SearchIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Grid container spacing={3} style={{ marginLeft: '0px' }}>
                                <InputLabel sx={{ marginTop: '5px' }}>Cerca per classe: </InputLabel>
                                <Select
                                    value={classeSel}
                                    name="classe"
                                    onChange={handleChange}
                                    label="Classe"
                                    sx={{ marginLeft: '10px', width: '80px', height: '40px' }}
                                >
                                    {classi.map((classeVal, index) => (
                                        <MenuItem key={index} value={classeVal}>
                                            {classeVal}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                        </SearchComponent>
                        <TableDataComponent tableData={cogestioneData} columns={columnsTable} rowIdField="id" />
                    </Box>
                )}
            </DashboardLayout>


        </Box>
    );
}

export default ManageUsers;
