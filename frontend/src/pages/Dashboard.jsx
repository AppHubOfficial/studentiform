import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const renspose = await fetch('http://localhost:5000/api/users/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (renspose.ok) {
        navigate('/')
      } else {
        console.error("Errore durante logout")
      }
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }

    
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '93vh',
        gap: 3,
        backgroundColor: '#f5f5f5',
        padding: '20px',
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Benvenuto nella Dashboard!
      </Typography>
      
      <Typography variant="body1">
        Sei autenticato con successo. Puoi gestire il tuo account qui.
      </Typography>

      <Button variant="contained" color="secondary" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
}

export default Dashboard;
