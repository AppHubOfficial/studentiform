import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Box, Typography, Modal, Card, CardContent } from '@mui/material';
import LoginComponent from '../component/LoginComponent';
import background from '../assets/images/programmers.jpg';

import Header from '../component/Header';
import HeroSection from '../component/HeroSection';
import HomeEvents from '../component/HomeEvents';

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
    <>
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
        <Header handleCloseLogin={handleCloseLogin} handleOpenLogin={handleOpenLogin} />
        <HeroSection />
      </Box>

      <HomeEvents />


      {/* Footer */}
      <Box sx={{ backgroundColor: '#333', color: '#fff', textAlign: 'center', padding: '20px', mt: 5, marginTop: '0 !important' }}>
        <Typography variant="body2">© 2025 EduPlatform - Tutti i diritti riservati</Typography>
        <Typography variant="body2">IIS Andriano - Castelnuovo Don Bosco</Typography>
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
    </>
  );
}

export default Home;