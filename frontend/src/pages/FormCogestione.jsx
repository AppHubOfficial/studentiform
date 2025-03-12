import { useState } from "react";
import {
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Box,
  Modal,
  CircularProgress,
  Popover,
  IconButton
} from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import backgroundCogestione from '../assets/images/sport.jpg';

const classi = ["1", "2", "3", "4", "5"];

const attivitaMattina = {
  "Calcio": "Partita di calcio all'aperto. Le squadre verranno formate in anticipo.",
  "Basket": "Partita di basket all'aperto con squadre organizzate prima dell'evento.",
  "Pallavolo": "Gioco di pallavolo all'aperto con squadre predefinite.",
  "Ping Pong": "Torneo di ping pong in aula attrezzata.",
  "Cucina": "Affiancamento al professor Casalegno nella preparazione della pasta per gli studenti.",
  "Cucina Etnica (1€ ad assaggio)": "Fiera gastronomica con piatti da tutto il mondo preparati da famiglie e docenti.",
  "Make-up": "Sessione di confronto sulle tecniche di trucco tra studenti e studentesse.",
  "Croce Rossa": "Due corsi della Croce Rossa: malattie sessualmente trasmissibili e rischi della guida irresponsabile.",
  "Forze dell'Ordine": "Incontro informativo sulle carriere nelle forze dell'ordine.",
  "Protezione Civile": "Dimostrazioni della Protezione Civile sui rischi della zona.",
  "Programmazione": "Lezione su linguaggi di programmazione extra rispetto al programma ministeriale.",
  "Cinema/Anime": "Visione di un'opera di cinema o anime con successiva riflessione critica.",
  "Ballo": "Lezioni di ballo moderno all'aperto con vari generi musicali.",
  "Ludoteca": "Sessione di gioco da tavolo con esperti della ludoteca di Castelnuovo Don Bosco.",
  "Aula di Studio": "Spazio dedicato allo studio o al riposo, accessibile solo per due moduli.",
  "Pittura": "Ritinteggiatura dell'aula LCF il 23/04/2025 e dell'aula 7 il 24/04/2025.",
  "Ora d'aria": "Momento di relax all'aperto."
};

const attivitaPomeriggio = {
  "Calcio (Non torneo)": "Partita di calcio amatoriale senza torneo, squadre organizzate prima.",
  "Basket": attivitaMattina["Basket"],
  "Pallavolo": attivitaMattina["Pallavolo"],
  "Ping Pong": attivitaMattina["Ping Pong"],
  "Cucina Etnica (1€ ad assaggio)": attivitaMattina["Cucina Etnica (1€ ad assaggio)"],
  "Make-up": attivitaMattina["Make-up"],
  "Croce Rossa": attivitaMattina["Croce Rossa"],
  "Forze dell'Ordine": attivitaMattina["Forze dell'Ordine"],
  "Protezione Civile": attivitaMattina["Protezione Civile"],
  "Programmazione": attivitaMattina["Programmazione"],
  "Cinema/Anime": attivitaMattina["Cinema/Anime"],
  "Ballo": attivitaMattina["Ballo"],
  "Ludoteca": attivitaMattina["Ludoteca"],
  "Aula di Studio": attivitaMattina["Aula di Studio"],
  "Pittura": attivitaMattina["Pittura"],
  "Ora d'aria": attivitaMattina["Ora d'aria"]
};

const apiUrl = process.env.REACT_APP_API_URL;

const styleModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -100%)',
  width: 240,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function PrenotazioneCogestione() {
  // Stato per le due sessioni mattutine e per il pomeriggio
  const [attivita, setAttivita] = useState({
    mercoledi: ["", "", ""],
    giovedi: ["", "", ""],
    pomeriggio: ""
  });
  const [classe, setClasse] = useState("");
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [mangioScuola, setMangioScuola] = useState(false);
  const [oraDAriaCount, setOraDAriaCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverContent, setPopoverContent] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handlePopoverOpen = (event, content) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setPopoverContent(content);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setPopoverContent("");
  };

  // Definizione di handleSubmit: usata per inviare il form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      nome,
      cognome,
      classe,
      // Invia le sessioni mattutine in base alla logica che preferisci
      attivitaMattina: classe === "1" || classe === "2" ? attivita.mercoledi.concat(attivita.giovedi) : attivita.mercoledi,
      attivitaPomeriggio: attivita.pomeriggio,
      mangioScuola,
    };

    console.log("Dati inviati:", formData);
    setErrorMessage("");
    setOpen(true);
    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/users/save_data_cogestione`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("SUCCESS");
        setIsLoading(false);
      } else {
        console.log(data.error);
        setErrorMessage(data.error || 'Problema di rete');
      }
    } catch (error) {
      console.error('Errore di rete:', error);
      setErrorMessage("Errore di rete");
    } finally {
      setIsLoading(false);
    }
  };

  // Quando si seleziona "Calcio" in una sessione, imposta tutti i moduli di quella sessione su "Calcio"
  const handleAttivitaChange = (session, index, value) => {
    let newAttivita = { ...attivita };
    if (session === "mercoledi" || session === "giovedi") {
      if (value === "Calcio") {
        newAttivita[session] = ["Calcio", "Calcio", "Calcio"];
      } else {
        newAttivita[session][index] = value;
      }
    } else {
      newAttivita.pomeriggio = value;
    }
    setAttivita(newAttivita);
    setOraDAriaCount(
      [...newAttivita.mercoledi, ...newAttivita.giovedi, newAttivita.pomeriggio].filter(a => a === "Ora d'aria").length
    );
  };

  const openPopover = Boolean(anchorEl);
  const popoverId = openPopover ? 'simple-popover' : undefined;

  // Etichetta per il pomeriggio in base alla classe
  const pomeriggioLabel = (classe === "1" || classe === "2") ? "Mercoledì Pomeriggio" :
                          (classe === "3" || classe === "4" || classe === "5") ? "Giovedì Pomeriggio" : "Pomeriggio";

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: `url(${backgroundCogestione})`,
        height: '45vh',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
      >
        <Box sx={{ ...styleModal, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {isLoading ? (
            <CircularProgress style={{ width: '30px', height: '30px' }} />
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: errorMessage ? "#CC0000" : "#006200" }}>
              {errorMessage ? <CloseIcon /> : <CheckIcon fontSize="large" />}
              <Typography id="modal-modal-title" variant="h6" component="h2">
                {errorMessage || "Il form è stato inviato"}
              </Typography>
            </Box>
          )}
        </Box>
      </Modal>

      <Box
        sx={{
          maxWidth: 400,
          mx: "auto",
          mt: 15,
          mb: 15,
          p: 3,
          boxShadow: '0px 7px 14px rgba(0, 0, 0, 0.1)',
          padding: '65px 30px 30px 30px',
          backgroundColor: 'white',
          marginBottom: '20px',
          marginTop: "50px !important",
          color: '#3e3e3e'
        }}
      >
        <Typography variant="h5" align="center" color="secondary" sx={{ fontWeight: "bold" }}>
          Prenotazione COGESTIONE
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* Selezione Classe */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Classe</InputLabel>
            <Select
              value={classe}
              onChange={(e) => setClasse(e.target.value)}
              label="Classe"
              required
            >
              {classi.map((classeVal, index) => (
                <MenuItem key={index} value={classeVal}>
                  {classeVal}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Nome e Cognome */}
          <TextField
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            label="Nome"
            variant="outlined"
            fullWidth
            required
            margin="normal"
          />
          <TextField
            value={cognome}
            onChange={(e) => setCognome(e.target.value)}
            label="Cognome"
            variant="outlined"
            fullWidth
            required
            margin="normal"
          />

          {/* Sessioni Mattutine */}
          <Typography variant="h6" color="secondary" sx={{ mt: 2 }}>
            Mercoledì Mattina
          </Typography>
          {attivita.mercoledi.map((value, index) => (
            <FormControl fullWidth margin="normal" key={`mercoledi-${index}`}>
              <InputLabel>Attività {index + 1}</InputLabel>
              <Select
                value={value}
                onChange={(e) => handleAttivitaChange("mercoledi", index, e.target.value)}
                label={`Attività ${index + 1}`}
                required
              >
                {Object.keys(attivitaMattina).map((key) => (
                  <MenuItem
                    key={key}
                    value={key}
                    disabled={key === "Ora d'aria" && oraDAriaCount >= 1}
                  >
                    <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                      <span>{key}</span>
                      <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); handlePopoverOpen(e, attivitaMattina[key]); }}
                      >
                        <ArrowDropDownIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}

          <Typography variant="h6" color="secondary" sx={{ mt: 2 }}>
            Giovedì Mattina
          </Typography>
          {attivita.giovedi.map((value, index) => (
            <FormControl fullWidth margin="normal" key={`giovedi-${index}`}>
              <InputLabel>Attività {index + 1}</InputLabel>
              <Select
                value={value}
                onChange={(e) => handleAttivitaChange("giovedi", index, e.target.value)}
                label={`Attività ${index + 1}`}
                required
              >
                {Object.keys(attivitaMattina).map((key) => (
                  <MenuItem
                    key={key}
                    value={key}
                    disabled={key === "Ora d'aria" && oraDAriaCount >= 1}
                  >
                    <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                      <span>{key}</span>
                      <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); handlePopoverOpen(e, attivitaMattina[key]); }}
                      >
                        <ArrowDropDownIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}

          {/* Selezione attività Pomeriggio */}
          <Typography variant="h6" color="secondary" sx={{ mt: 2 }}>
            {pomeriggioLabel}
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel>{pomeriggioLabel}</InputLabel>
            <Select
              value={attivita.pomeriggio}
              onChange={(e) => handleAttivitaChange("pomeriggio", -1, e.target.value)}
              label={pomeriggioLabel}
              required
            >
              {Object.keys(attivitaPomeriggio).map((key) => (
                <MenuItem
                  key={key}
                  value={key}
                  disabled={key === "Ora d'aria" && oraDAriaCount >= 1}
                >
                  <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                    <span>{key}</span>
                    <IconButton
                      size="small"
                      onClick={(e) => { e.stopPropagation(); handlePopoverOpen(e, attivitaPomeriggio[key]); }}
                    >
                      <ArrowDropDownIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Checkbox Mangio a scuola */}
          <FormControlLabel
            control={<Checkbox checked={mangioScuola} onChange={() => setMangioScuola(!mangioScuola)} />}
            label="Mangio a scuola (2€)"
          />

          {/* Bottone di invio */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button variant="contained" color="primary" type="submit">
              Invia
            </Button>
          </Box>
        </form>

        {/* Popover per la descrizione dell'attività */}
        <Popover
          id={popoverId}
          open={openPopover}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Typography sx={{ p: 2 }}>{popoverContent}</Typography>
        </Popover>
      </Box>
    </Box>
  );
}
