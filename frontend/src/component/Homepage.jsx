import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Homepage() {
  const navigate = useNavigate();

  const handleStudentClick = () => {
    navigate('/form-exstudenti');
  };

  const handleTeacherClick = () => {
    navigate('/form-insegnanti'); 
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: 3,
        backgroundColor: '#f5f5f5',
        padding: '20px',
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Benvenuto!
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" color="primary" onClick={handleStudentClick}>
          Sono uno Studente
        </Button>
        <Button variant="contained" color="secondary" onClick={handleTeacherClick}>
          Sono un Insegnante
        </Button>
      </Box>

      <Typography variant="body1">Se sei già registrato, effettua il login:</Typography>
      <Button variant="outlined" onClick={handleLoginClick}>
        Login
      </Button>
    </Box>
  );
}

export default Homepage;
