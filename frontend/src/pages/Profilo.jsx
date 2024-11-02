import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, Paper, Table, TableBody, TableCell, TableRow, Alert, TextField, Checkbox, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Profilo() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    tel: "",
    type: "",
    university: "",
    faculty: "",
    distance: "",
    activities: [],
  });

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;

    if (name === "activities") {
      setFormData((prevData) => ({
        ...prevData,
        activities: checked
          ? [...prevData.activities, value] 
          : prevData.activities.filter((activity) => activity !== value)
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/users/editProfileData', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
      } else {
        console.error(`Errore nell'aggiornamento del profilo: ${response.status}`);
      }
    } catch (error) {
      console.error('Errore durante l\'aggiornamento del profilo:', error);
    }
  };

  useEffect(() => {
    const fetchUserProfileData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/getProfileData', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          const userData = data[0] || {};

          setProfileData(userData);
          setFormData({
            nome: userData.nome || "",
            email: userData.email || "",
            tel: userData.tel || "",
            type: userData.type || "",
            university: userData.university || "",
            faculty: userData.faculty || "",
            distance: userData.distance || "",
            activities: Array.isArray(userData.activities) ? userData.activities : [],
          });
        } else {
          console.error(`Errore in getProfileData: ${response.status}`);
        }
      } catch (error) {
        console.error('Errore durante il recupero dei dati del profilo:', error);
      }
    };

    fetchUserProfileData();
  }, []);

  if (!profileData) {
    return <Alert severity="info">Caricamento dati utente...</Alert>
  }

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
        top: '150px',
        marginBottom: "370px",
        width: "90%"
      }}
    >
      <ArrowBackIcon style={{ fontSize: '35px', marginTop: "50px" }} onClick={() => navigate('/dashboard')} />

      <Box
        component="form"
        onSubmit={handleSubmitUpdate}
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          gap: 3,
          alignItems: 'center',
          width: "100%",
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          {profileData.nome}
        </Typography>

        <Paper elevation={3} sx={{ padding: 2, width: "80%", maxWidth: "500px", minWidth: "300px", display: 'flex', justifyContent: 'center' }}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>
                  <TextField
                    name="nome"
                    onChange={handleInputChange}
                    value={formData.nome}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>
                  <TextField disabled value={formData.email} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Telefono</TableCell>
                <TableCell>
                  <TextField
                    name="tel"
                    onChange={handleInputChange}
                    value={formData.tel}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Ruolo</TableCell>
                <TableCell>
                  <TextField disabled value={formData.type} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Università</TableCell>
                <TableCell>
                  <TextField
                    name="university"
                    onChange={handleInputChange}
                    value={formData.university}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Facoltà</TableCell>
                <TableCell>
                  <TextField
                    name="faculty"
                    onChange={handleInputChange}
                    value={formData.faculty}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Distanza</TableCell>
                <TableCell>
                  <TextField
                    name="distance"
                    onChange={handleInputChange}
                    value={formData.distance}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Attività</TableCell>
                <TableCell>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="activities"
                        value="scuola"
                        checked={formData.activities.includes("scuola")}
                        onChange={handleInputChange}
                      />
                    }
                    label="Scuola"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="activities"
                        value="lavoro"
                        checked={formData.activities.includes("lavoro")}
                        onChange={handleInputChange}
                      />
                    }
                    label="Lavoro"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Account creato il</TableCell>
                <TableCell>
                  <TextField disabled value={new Date(profileData.created_at).toLocaleDateString('it-IT')} />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
        <Button variant="contained" sx={{ marginTop: "10px", width: "80%", maxWidth: "500px" }} type="submit">Modifica</Button>
      </Box>
    </Box>
  );
}

export default Profilo;
