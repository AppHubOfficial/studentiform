import React, { useContext, useState } from 'react';
import { Button, Box, Typography, Avatar, Paper } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useNavigate } from 'react-router-dom';
import Context from '../Context';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Profilo() {
  const navigate = useNavigate();
  const { profileData } = useContext(Context);

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  // Assegna i dati del profilo, includendo valori di default
  const {
    nome = "Nome non disponibile",
    email = "Email non disponibile",
    tel = "Telefono non disponibile",
    type = "Ruolo non disponibile",
    university = "Università non disponibile",
    faculty = "Facoltà non disponibile",
    created_at = "Data creazione non disponibile",
    foto = "https://via.placeholder.com/150",
  } = profileData || {};

  const columns = [
    { field: 'nome', headerName: 'Nome', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'tel', headerName: 'Telefono', width: 150 },
    { field: 'type', headerName: 'Ruolo', width: 130 },
    { field: 'university', headerName: 'Università', width: 200 },
    { field: 'faculty', headerName: 'Facoltà', width: 200 },
    { field: 'created_at', headerName: 'Creato il', width: 200 },
  ];

  const rows = [
    {
      nome: nome,
      email: email,
      tel: tel,
      type: type,
      university: university,
      faculty: faculty,
      created_at: new Date(created_at).toLocaleDateString('it-IT'),
    },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '93vh',
        gap: 3,
        backgroundColor: '#f5f5f5',
        padding: '20px',
        position: 'relative',
        top: '-120px'
      }}
    >
      <ArrowBackIcon style={{ fontSize: '37px' }} onClick={() => navigate('/dashboard')}></ArrowBackIcon>

      <Avatar alt={nome} src={foto} sx={{ width: 100, height: 100, mb: 2 }} />
      <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
        {nome}
      </Typography>

      <Paper sx={{ padding: 2, width: '100%', maxWidth: 800 }}>
        <Grid container spacing={2} direction="column">
          {columns.map((column) => (
            <Grid container item key={column.field} alignItems="center">
              <Grid item sx={{ width: 120 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {column.headerName}
                </Typography>
              </Grid>
              <Grid item xs>
                <Typography variant="body1">{rows[0][column.field]}</Typography>
              </Grid>
            </Grid>
          ))}
        </Grid>
        <Grid container justifyContent="flex-start" sx={{ marginTop: 2 }}>
          <Button variant="contained" color="primary">Edit</Button>
        </Grid>
      </Paper>

    </Box>
  );
}

export default Profilo;
