import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleClick = (type) => {
    navigate('/login', { state: { type } });
  };

  return (
    <Box>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: '#0073e6' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            
          </Typography>
          <Button color="inherit" onClick={() => handleClick('login')}>
            Login
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container
        maxWidth="md"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '85vh',
          textAlign: 'center',
          gap: 4,
          backgroundColor: '#f5f5f5',
          borderRadius: 2,
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          padding: '40px',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Benvenuto!
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '18px', color: '#555' }}>
          Sei uno studente o un insegnante? Seleziona il tuo ruolo per continuare.
        </Typography>

        {/* Buttons */}
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => handleClick('studente')}
            sx={{ paddingX: 5 }}
          >
            Sono uno Studente
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => handleClick('insegnante')}
            sx={{ paddingX: 5 }}
          >
            Sono un Insegnante
          </Button>
        </Box>

        <Typography variant="body2" sx={{ marginTop: '20px', color: '#777' }}>
          Già registrato? Accedi al tuo account cliccando su "Login" in alto a destra.
        </Typography>
      </Container>
    </Box>
  );
}

export default Home;
