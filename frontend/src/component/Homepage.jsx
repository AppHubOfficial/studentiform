import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Homepage() {
  const navigate = useNavigate();

  const handleStudentClick = () => {
    navigate('/form-exstudenti'); // Vai alla pagina di registrazione studenti
  };

  const handleTeacherClick = () => {
    navigate('/register-teacher'); // Vai alla pagina di registrazione insegnanti
  };

  const handleLoginClick = () => {
    navigate('/login'); // Vai alla pagina di login
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
        Benvenuto su Studentiform
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
