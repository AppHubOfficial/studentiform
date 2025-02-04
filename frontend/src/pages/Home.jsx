import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Box, Typography, Modal } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import LoginComponent from '../component/LoginComponent';
import background from '../assets/images/programmers.jpg';

function Home() {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [loginType, setLoginType] = useState('');

  const navigate = useNavigate();

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
      <AppBar position="static" sx={{ backgroundColor: '#333333' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', cursor: 'pointer' }}>
            EduPlatform
          </Typography>

          <Button
            variant="outlined"
            onClick={() => handleOpenLogin('login')}
            style={{
              padding: '8px',
              width: '90px',
              borderColor: 'rgb(187, 187, 187)',
              color: 'rgb(244, 244, 244)',
              position: 'absolute',
              right: '30px',
              height: '35px'
            }}
          >
            Login
          </Button>

          <Button
            variant="outlined"
            onClick={() => handleOpenLogin('signin')}
            style={{
              padding: '8px',
              width: '90px',
              borderColor: 'rgb(187, 187, 187)',
              color: 'rgb(244, 244, 244)',
              position: 'absolute',
              right: '145px',
              height: '35px'
            }}
          >
            Signin
          </Button>

          <Button
            variant="outlined"
            onClick={() => navigate('/cogestione')}
            style={{
              padding: '8px',
              width: '120px',
              borderColor: 'rgb(187, 187, 187)',
              color: 'rgb(244, 244, 244)',
              position: 'absolute',
              right: '260px',
              height: '35px'
            }}
          >
            Cogestione
          </Button>

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
          overflowY: 'auto',
        }}
      >

        {/*<Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
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
        </Box>*/}

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