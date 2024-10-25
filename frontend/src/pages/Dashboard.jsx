import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, TextField, Autocomplete, Slider } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DrawerMenu from '../component/DrawerMenu';
import MenuIcon from '@mui/icons-material/Menu';
import Divider from '@mui/material/Divider';
import '../assets/styles/Dashboard.css';

import SearchComponent from '../component/SearchComponent';

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const [userData, setUserData] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/logout', {
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


    const handleChangeRoles = (event) => {
        setSelectedRole(event.target.value);
    };

  /////// getData ////// 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/getData', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          console.log(data);
        } else {
          const errorMessage = await response.text();
          console.error(`Errore in getData: ${response.status} - ${errorMessage}`);
        }
      } catch (error) {
        console.error('Errore durante il recupero dei dati:', error);
      }
    };

    fetchData();
  }, []); // In questo modo esegue al caricamento del componente

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
        justifyContent: 'left',
        height: '93vh',
        gap: 3,
        backgroundColor: '#f5f5f5',
        padding: '20px',
      }}
    >
      {userData ? (
        <>
          <MenuIcon onClick={toggleDrawer(true)} style={{ cursor: 'pointer' }} />
          <DrawerMenu open={open} toggleDrawer={toggleDrawer} handleLogout={handleLogout} /> {/* Passa handleLogout come prop */}

          <Typography variant="h4" component="h1" gutterBottom>
            Benvenuto{" "}
            <Typography component="span" variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              {userData[0]?.nome}!
            </Typography>
          </Typography>


          <Typography variant="body1">
            Sei autenticato con successo come{" "}
            <Typography component="span" variant="body1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              {userData[0]?.type === "teacher" ? "insegnante" : "studente"}
            </Typography>
            . Puoi gestire il tuo account qui.
          </Typography>


        
          {userData[0]?.type === "teacher" && (
            <SearchComponent handleChangeRoles={handleChangeRoles}/>
          )}
        </>
      ) : (
        <Typography variant="body1">Caricamento dati utente...</Typography>
      )}
    </Box>
  );
}

export default Dashboard;
