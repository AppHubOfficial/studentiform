import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, Paper, Table, TableBody, TableCell, TableRow, Alert, TextField, Checkbox, FormControlLabel } from '@mui/material';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '../assets/styles/Profilo.css';

function Profilo() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);

  const [openPopup, setOpenPopup] = React.useState(false);

  const [ripetizioni, setRipetizioni] = useState(false);

  const [errorTimeout, setErrorTimeout] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const TIMEOUT = 6000;

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    tel: "",
    type: "",
    university: "",
    faculty: "",
    distance: "",
    work: "",
    activities: [],
    note: "",
    ripetizioni: false,
  });

  const handleClose = (event, reason) => {
    // if (reason === 'clickaway') {
    //   return; // Ignora il clickaway
    // }
    setOpenPopup(false);
  };

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

  const checkboxRipetizioni = (e) => {
    const { name, checked } = e.target;
    setRipetizioni(checked)
    setFormData({
      ...formData,
      ripetizioni: checked
    });
  }

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();

    const regex = /^\d+(\.\d+)?$/;
    if (regex.test(formData.tel) && formData.tel.length !== 10) {
      setErrorTimeout(true)
      setErrorMessage("Numero di telefono non valido")
      return;
    }

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
        //const data = await response.json();
        //setProfileData(data);
        setOpenPopup(true)

      } else {
        setErrorMessage("Errore durante aggiornamento profilo")
        setErrorTimeout(true)
        console.error(`Errore nell'aggiornamento del profilo: ${response.status}`);
      }
    } catch (error) {
      console.error('Errore durante l\'aggiornamento del profilo:', error);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => setErrorTimeout(true), TIMEOUT);

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
          clearTimeout(timeout);
          const data = await response.json();
          const userData = data[0] || {};
          setProfileData(userData);
          console.log(userData)
          setFormData({
            nome: userData.nome || "",
            email: userData.email || "",
            tel: userData.tel || "",
            type: userData.type || "",
            university: userData.university || "",
            faculty: userData.faculty || "",
            distance: userData.distance || "",
            activities: userData.activities || [],
            note: userData.note || "",
            work: userData.work || "",
            ripetizioni: userData.ripetizioni || false,
          });
        } else {
          console.error(`Errore in getProfileData: ${response.status}`);
          if (response.status == 401) {
            setErrorTimeout(true)
            setErrorMessage("Non autenticato. Effettua il login prima di accedere alla dashboard")
          } else {
            setErrorMessage("Errore di rete")
          }
        }
      } catch (error) {
        console.error('Errore durante il recupero dei dati del profilo:', error);
      }
    };

    fetchUserProfileData();

    return () => clearTimeout(timeout);
  }, []);

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
        marginBottom: "50px",
        width: "90%",
        ...(profileData?.type === "studente" && {
          position: 'relative',
          top: '70px',
          marginTop: '210px',
          marginBottom: "450px !important",
        }),
        ...(profileData?.type === "insegnante" && {
          marginTop: '30px !important',
          marginBottom: '90px !important'
        }),
      }}
    >
      {errorMessage && (
        <Alert
          className='info'
          severity="error">{errorMessage}
        </Alert>
      )}
      <Snackbar
        open={openPopup}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <SnackbarContent
          sx={{ backgroundColor: 'green' }}
          message="Dati aggiornati con successo"
          action={
            <Button color="inherit" onClick={handleClose}>
              Chiudi
            </Button>
          }
        />
      </Snackbar>
      {profileData ? (
        <>
          <ArrowBackIcon style={{ fontSize: '35px', marginTop: "50px", cursor: "pointer", }} onClick={() => navigate('/dashboard')} />

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
              {formData.nome}
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
                    <TableCell>Note</TableCell>
                    <TableCell>
                      <TextField
                        value={formData.note}
                        onChange={handleInputChange}
                        name='note'
                      />
                    </TableCell>
                  </TableRow>

                  {profileData.type === "studente" && (
                    <>
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
                        <TableCell>Luogo di lavoro</TableCell>
                        <TableCell>
                          <TextField
                            name="work"
                            onChange={handleInputChange}
                            value={formData.work}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Posso dare ripetizioni</TableCell>
                        <TableCell display="flex" alignItems="center">
                          <Checkbox onChange={checkboxRipetizioni} checked={formData.ripetizioni} />
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
                    </>
                  )}

                  <TableRow>
                    <TableCell>Account creato il</TableCell>
                    <TableCell>
                      <TextField disabled value={new Date(profileData.created_at).toLocaleDateString('it-IT')} />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
            <Button variant="contained" sx={{ marginTop: "10px", width: "80%", maxWidth: "500px" }} type="submit">Salva modifiche</Button>
          </Box>
        </>
      ) : (
        errorTimeout ? (
          <Alert
            className='info'
            severity="error">{errorMessage},
          </Alert>
        ) : (
          <Alert className='info' severity="info">Caricamento dati utente...</Alert>
        )
      )}
    </Box>
  );
}

export default Profilo;
