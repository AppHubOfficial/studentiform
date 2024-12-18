import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Box, Typography, Modal } from '@mui/material';
import LoginComponent from '../component/LoginComponent';
import background from '../assets/images/programmers.jpg';

function Home() {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [loginType, setLoginType] = useState('');

  const handleOpenLogin = (type) => {
    setLoginType(type);
    setLoginOpen(true); 
  };

  const handleCloseLogin = () => {
    setLoginOpen(false);
    setLoginType('');
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
      {/* <AppBar position="static" sx={{ backgroundColor: '#333333' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', cursor: 'pointer' }}>
            EduPlatform
          </Typography>
          <Box>
          </Box>
        </Toolbar>
      </AppBar> */}

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
          overflowY: 'auto',
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
            onClick={() => handleOpenLogin('studente')}
            sx={{ paddingX: 3, padding: '13px' }}
          >
            Sono uno Studente
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleOpenLogin('insegnante')}
            sx={{ paddingX: 3, padding: '13px' }}
          >
            Sono un Insegnante
          </Button>
        </Box>

        <Typography variant="body1" sx={{ mt: 3 }}>
          Sei già registrato? Accedi qui:
        </Typography>
        <Button
          variant="contained"
          onClick={() => handleOpenLogin('login')}
          sx={{
            backgroundColor: '#00b11e',
            color: '#ffffff',
            mt: 1,
            paddingX: 3,
          }}
          style={{ padding: '13px' }}
        >
          Login
        </Button>
      </Box>

      <Modal
        open={isLoginOpen}
        onClose={handleCloseLogin}
        aria-labelledby="login-modal-title"
        aria-describedby="login-modal-description"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
          <LoginComponent type={loginType} setLoginOpen={setLoginOpen} setLoginType={setLoginType} />
      </Modal>
    </Box>
  );
}

export default Home;
