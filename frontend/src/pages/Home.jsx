import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import background from '../assets/images/programmers.png';

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
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#ffffff',
      }}
    >
      <AppBar position="static" sx={{ backgroundColor: '#333333' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            EduPlatform
          </Typography>
          <Box>
            <Button color="inherit" onClick={() => handleClick('login')}>
              Accedi
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          backdropFilter: 'brightness(0.8)',
          padding: '20px',
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          Benvenuto su EduPlatform!
        </Typography>
        <Typography variant="h6" gutterBottom>
          Scegli il tuo percorso per iniziare.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleClick('studente')}
            sx={{ paddingX: 3 }}
          >
            Sono uno Studente
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleClick('insegnante')}
            sx={{ paddingX: 3 }}
          >
            Sono un Insegnante
          </Button>
        </Box>

        <Typography variant="body2" sx={{ marginTop: '20px', color: '#777' }}>
          Già registrato? Accedi al tuo account cliccando su "Login" in alto a destra.
        </Typography>
      </Container>
      </Box>
    </Box>
  );
}

export default Home;
