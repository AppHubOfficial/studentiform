import React from 'react';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import background from '../assets/images/programmers.png';

function Home() {
  const navigate = useNavigate();

  const handleClick = (type) => {
    navigate('/login', { state: { type } });
  };

  return (
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

      </Box>
    </Box>
  );
}

export default Home;
