import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Box, Typography, Modal, Card, CardContent } from '@mui/material';
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
    <Box>
      {/* Header */}
      <Box
        sx={{
          height: '70vh',
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

            <Box>
              <Button
                variant="outlined"
                onClick={() => handleOpenLogin('signin')}
                sx={{ marginRight: 2, borderColor: '#bbb', color: '#f4f4f4' }}
              >
                Signin
              </Button>
              <Button
                variant="outlined"
                onClick={() => handleOpenLogin('login')}
                sx={{ borderColor: '#bbb', color: '#f4f4f4' }}
              >
                Login
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Hero Section */}
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
            top: '-60px',
            position: 'relative'
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
            Benvenuto su EduPlatform
          </Typography>
          <Typography variant="h6">
            Il miglior portale per rimanere aggiornato sugli eventi e attività scolastiche
          </Typography>
        </Box>
      </Box>

      {/* Sezione Eventi */}
      <Box
        sx={{
          position: 'relative',
          top: '-220px',
          backgroundColor: '#e8e8e8',
          padding: '40px',
          borderRadius: '10px',
          width: '80%',
          margin: '0 auto',
          boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
          textAlign: 'center',
          height: '40vh'
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
          Prossimi Eventi
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          {/* Evento 1 */}
          <Card sx={{ maxWidth: 300 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Open Day 2025
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Vieni a scoprire la nostra scuola il 15 Marzo!
              </Typography>
            </CardContent>
          </Card>

          {/* Evento 2 */}
          <Card sx={{ maxWidth: 300 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Hackathon Studenti
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Una sfida di programmazione per tutti gli studenti - 10 Aprile.
              </Typography>
            </CardContent>
          </Card>

          {/* Evento 3 */}
          <Card sx={{ maxWidth: 300 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Settimana della Scienza
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Esperimenti e conferenze dal 20 al 25 Maggio.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>


      {/* Footer */}
      <Box sx={{ backgroundColor: '#333', color: '#fff', textAlign: 'center', padding: '20px', mt: 5 }}>
        <Typography variant="body2">© 2025 EduPlatform - Tutti i diritti riservati</Typography>
        <Typography variant="body2">Contatti: info@eduplatform.com | Tel: 0123-456789</Typography>
      </Box>

      {/* Modale Login */}
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