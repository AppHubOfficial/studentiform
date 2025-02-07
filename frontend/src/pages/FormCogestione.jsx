import { useState } from "react";
import { TextField, MenuItem, FormControlLabel, Checkbox, Button, FormControl, InputLabel, Select, Typography, Box } from "@mui/material";
import backgroundCogestione from '../assets/images/sport.jpg';

const classi = ["1", "2", "3", "4", "5"];
const attivitaMattina = ["Sport", "Laboratorio", "Musica", "Ora d'aria"];
const attivitaPomeriggio = ["Teatro", "Coding", "Pittura", "Ora d'aria"];

const apiUrl = process.env.REACT_APP_API_URL;

export default function PrenotazioneCogestione() {
  const [classe, setClasse] = useState("");
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [mangioScuola, setMangioScuola] = useState(false);
  const [attivita, setAttivita] = useState({ mattina: ["", "", ""], pomeriggio: "" });
  const [oraDAriaCount, setOraDAriaCount] = useState(0);
  const [formData, setFormData] = useState("");
  const [formSend, setFormSend] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      nome,
      cognome,
      classe,
      attivitaMattina: attivita.mattina,
      attivitaPomeriggio: attivita.pomeriggio,
      mangioScuola,
    };

    console.log("Dati inviati:", formData);

    try {
      const response = await fetch(`${apiUrl}/api/users/save_data_cogestione`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setFormSend(true);
      } else {
        console.log(data.error);
        setErrorMessage(data.error || 'Problema di rete');
      }
    } catch (error) {
      console.error('Errore di rete:', error);
    }
  };


  const handleAttivitaChange = (type, index, value) => {
    let newAttivita = { ...attivita };
    if (type === "mattina") {
      newAttivita.mattina[index] = value;
    } else {
      newAttivita.pomeriggio = value;
    }
    setAttivita(newAttivita);
    setOraDAriaCount([...newAttivita.mattina, newAttivita.pomeriggio].filter(a => a === "Ora d'aria").length);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: `url(${backgroundCogestione})`,
        height: '50vh',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 'bold',
          fontSize: '40px',
          mb: -20,
          mt: 10,
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        Prenotazione cogestione
      </Typography>
      <Box
        sx={{
          maxWidth: 400,
          mx: "auto",
          mt: 35,
          mb: 10,
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: 'white',
          marginBottom: '20px',
        }}
        component="form"
        onSubmit={handleSubmit}
      >

        <TextField fullWidth label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} margin="normal" />
        <TextField fullWidth label="Cognome" value={cognome} onChange={(e) => setCognome(e.target.value)} margin="normal" />
        <FormControl fullWidth margin="normal">
          <InputLabel>Classe</InputLabel>
          <Select value={classe} onChange={(e) => setClasse(e.target.value)}>
            {classi.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </Select>
        </FormControl>

        <Typography variant="h6" sx={{ mt: 2 }}> Mattina </Typography>
        {[0, 1, 2].map(i => (
          <FormControl fullWidth margin="normal" key={i}>
            <InputLabel>Modulo {i + 1}</InputLabel>
            <Select value={attivita.mattina[i]} onChange={(e) => handleAttivitaChange("mattina", i, e.target.value)}>
              {attivitaMattina.map(a => <MenuItem key={a} value={a} disabled={a === "Ora d'aria" && oraDAriaCount >= 1}>{a}</MenuItem>)}
            </Select>
          </FormControl>
        ))}

        {(classe === "1" || classe === "2") && (
          <>
            <Typography variant="h6" sx={{ mt: 2 }}> Mercoledì Pomeriggio </Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel>Modulo Pomeriggio</InputLabel>
              <Select value={attivita.pomeriggio} onChange={(e) => handleAttivitaChange("pomeriggio", 0, e.target.value)}>
                {attivitaPomeriggio.map(a => <MenuItem key={a} value={a} disabled={a === "Ora d'aria" && oraDAriaCount >= 1}>{a}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControlLabel control={<Checkbox checked={mangioScuola} onChange={() => setMangioScuola(!mangioScuola)} />} label="Mangio a scuola (1€)" />
          </>
        )}

        {(classe === "3" || classe === "4" || classe === "5") && (
          <>
            <Typography variant="h6" sx={{ mt: 2 }}> Giovedì Pomeriggio </Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel>Modulo Pomeriggio</InputLabel>
              <Select value={attivita.pomeriggio} onChange={(e) => handleAttivitaChange("pomeriggio", 0, e.target.value)}>
                {attivitaPomeriggio.map(a => <MenuItem key={a} value={a} disabled={a === "Ora d'aria" && oraDAriaCount >= 1}>{a}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControlLabel control={<Checkbox checked={mangioScuola} onChange={() => setMangioScuola(!mangioScuola)} />} label="Mangio a scuola (1€)" />
          </>
        )}

        <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">Prenota</Button>
      </Box>
    </Box>

  );
}
