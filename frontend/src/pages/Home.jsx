import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleClick = (type) => {
    navigate('/login', { state: { type } });
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
        Benvenuto!
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" color="primary" onClick={() => handleClick('student')}>
          Sono uno Studente
        </Button>
        <Button variant="contained" color="secondary" onClick={() => handleClick('teacher')}>
          Sono un Insegnante
        </Button>
      </Box>

      <Typography variant="body1">Se sei già registrato, effettua il login:</Typography>
      <Button variant="outlined" onClick={() => handleClick('login')}>
        Login
      </Button>
    </Box>
  );
}

export default Home;
