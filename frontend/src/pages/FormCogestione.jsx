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

    const [classe, setClasse] = useState("");
    const [mangioScuola, setMangioScuola] = useState(false);
    const [oraDAriaCount, setOraDAriaCount] = useState(0);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [popoverContent, setPopoverContent] = useState("");
    const [openSelect, setOpenSelect] = useState(false);
    const [calcioDisabled, setCalcioDisabled] = useState(false);
    const openPopover = Boolean(anchorEl);
    const popoverId = openPopover ? 'simple-popover' : undefined;
    const classi = ["1", "2", "3", "4", "5"];
    const [attivita, setAttivita] = useState({
        mercoledi: ["", "", ""],
        giovedi: ["", "", ""],
        pomeriggio: ""
    });
    const [formData, setFormData] = useState({
        nome: "",
        cognome: "",
        classe: "",
        attivita: {
            mercoledi: ["", "", ""],
            giovedi: ["", "", ""],
            pomeriggio: ""
        },
        mangioScuola: false
    });

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

    const handleChange = (e) => {

    }


    ///////////////// FORM FIELDS /////////////////
    const formFields = [
        { label: 'Nome', name: 'nome', type: 'input', required: true, classi: [1, 2, 3, 4, 5] },
        { label: 'Cognome', name: 'cognome', type: 'input', required: true, classi: [1, 2, 3, 4, 5] },
        { label: 'Classe', name: 'classe', type: 'selectClasse', required: true, classi: [1, 2, 3, 4, 5] },

        { label: 'Mercoledì mattina', type: 'label', classi: [1, 2, 3, 4, 5] },
        { label: 'Modulo 1', modulo: "merc1", name: 'merc_mattina', type: 'selectAttivita', required: true, classi: [1, 2, 3, 4, 5] },
        { label: 'Modulo 2', modulo: "merc2",name: 'merc_mattina', type: 'selectAttivita', required: true, classi: [1, 2, 3, 4, 5] },
        { label: 'Modulo 3', modulo: "merc3",name: 'merc_mattina', type: 'selectAttivita', required: true, classi: [1, 2, 3, 4, 5] },

        { label: 'Giovedì mattina', type: 'label', classi: [1, 2, 3, 4, 5] },
        { label: 'Modulo 1', modulo: "giov1", name: 'giov_mattina', type: 'selectAttivita', required: true, classi: [1, 2, 3, 4, 5] },
        { label: 'Modulo 2', modulo: "giov2", name: 'giov_mattina', type: 'selectAttivita', required: true, classi: [1, 2, 3, 4, 5] },
        { label: 'Modulo 3', modulo: "giov3", name: 'giov_mattina', type: 'selectAttivita', required: true, classi: [1, 2, 3, 4, 5] },

        { label: `${["3", "4", "5"].includes(classe) ? "Govedì" : "Mercoledì"} pomeriggio`, type: 'label', classi: [1, 2, 3, 4, 5] },
        { label: 'Modulo Pomeriggio', name: 'pomeriggio', type: 'selectAttivita', required: true, classi: [1, 2, 3, 4, 5] },

        { label: 'Mangio a scuola (1€)', name: 'mangio_scuola', type: 'checkbox', required: false, classi: [1, 2, 3, 4, 5] },
    ];


    const selectFields = [
        { name: "calcio_tutta_la_mattina", label: "Calcio (tutta la mattina)", descr: "Partita di calcio all'aperto. Le squadre verranno formate in anticipo.", ora: ["merc_mattina", "giov_mattina"] },
        { name: "calcio_non_torneo", label: "Calcio (Non torneo)", descr: "Partita di calcio amatoriale senza torneo, squadre organizzate prima.", ora: ["pomeriggio"] },
        { name: "basket", label: "Basket", descr: "Partita di basket all'aperto con squadre organizzate prima dell'evento.", ora: ["merc_mattina", "giov_mattina", "pomeriggio"] },
        { name: "pallavolo", label: "Pallavolo", descr: "Gioco di pallavolo all'aperto con squadre predefinite.", ora: ["merc_mattina", "giov_mattina", "pomeriggio"] },
        { name: "ping_pong", label: "Ping Pong", descr: "Torneo di ping pong in aula attrezzata.", ora: ["merc_mattina", "giov_mattina", "pomeriggio"] },
        { name: "cucina", label: "Cucina", descr: "Affiancamento al professor Casalegno nella preparazione della pasta per gli studenti.", ora: ["merc_mattina"] },
        { name: "cucina_etnica", label: "Cucina Etnica (1€ ad assaggio)", descr: "Fiera gastronomica con piatti da tutto il mondo preparati da famiglie e docenti.", ora: ["merc_mattina", "giov_mattina", "pomeriggio"] },
        { name: "make_up", label: "Make-up", descr: "Sessione di confronto sulle tecniche di trucco tra studenti e studentesse.", ora: ["merc_mattina", "giov_mattina", "pomeriggio"] },
        { name: "croce_rossa", label: "Croce Rossa", descr: "Due corsi della Croce Rossa: malattie sessualmente trasmissibili e rischi della guida irresponsabile.", ora: ["merc_mattina", "giov_mattina", "pomeriggio"] },
        { name: "forze_dell_ordine", label: "Forze dell'Ordine", descr: "Incontro informativo sulle carriere nelle forze dell'ordine.", ora: ["merc_mattina", "giov_mattina", "pomeriggio"] },
        { name: "protezione_civile", label: "Protezione Civile", descr: "Dimostrazioni della Protezione Civile sui rischi della zona.", ora: ["merc_mattina", "giov_mattina", "pomeriggio"] },
        { name: "programmazione", label: "Programmazione", descr: "Lezione su linguaggi di programmazione extra rispetto al programma ministeriale.", ora: ["merc_mattina", "giov_mattina", "pomeriggio"] },
        { name: "cinema_anime", label: "Cinema/Anime", descr: "Visione di un'opera di cinema o anime con successiva riflessione critica.", ora: ["merc_mattina", "giov_mattina", "pomeriggio"] },
        { name: "ballo", label: "Ballo", descr: "Lezioni di ballo moderno all'aperto con vari generi musicali.", ora: ["merc_mattina", "giov_mattina", "pomeriggio"] },
        { name: "ludoteca", label: "Ludoteca", descr: "Sessione di gioco da tavolo con esperti della ludoteca di Castelnuovo Don Bosco.", ora: ["merc_mattina", "giov_mattina", "pomeriggio"] },
        { name: "aula_di_studio", label: "Aula di Studio", descr: "Spazio dedicato allo studio o al riposo, disponibile solo per due moduli.", ora: ["merc_mattina", "giov_mattina", "pomeriggio"] },
        { name: "pittura", label: "Pittura", descr: "Ritinteggiatura dell'aula LCF il 23/04/2025 e dell'aula 7 il 24/04/2025.", ora: ["merc_mattina", "giov_mattina", "pomeriggio"] },
        { name: "ora_d_aria", label: "Ora d'aria", descr: "Momento di relax all'aperto.", ora: ["merc_mattina", "giov_mattina", "pomeriggio"] },

    ];

    //////////////////////////////////////////



    //////////// handleSubmit ////////////
    const handleSubmit = async (e) => {
        e.preventDefault();

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
    ////////////////////////////////////

    

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
                <Typography variant="h5" align="center" sx={{ fontWeight: "bold", marginTop: "-20px", marginBottom: "30px" }}>
                    Prenotazione COGESTIONE
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                    {formFields
                        .filter((field) => classe ? field.classi.includes(Number(classe)) : true)// filtro in base alla classe. Se è ancora undefined mostro tutto
                        .map((field, index) => {
                            switch (field.type) {
                                case 'selectClasse':
                                    return (
                                        <FormControl fullWidth margin="normal" key={field.name}>
                                            <InputLabel>{field.label}</InputLabel>
                                            <Select
                                                value={formData.classe}
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
                                    );

                                case 'selectAttivita': // Filtro in base al name
                                    return (
                                        <>

                                            <FormControl fullWidth margin="normal" key={index}>

                                                <InputLabel id={`act-${index}`}>{field.label}</InputLabel>
                                                <Select
                                                    labelId={`act-${index}`}
                                                    id={`act-${index}`}
                                                    label={field.label}
                                                    value={formData[field.name] || ""}
                                                    onChange={handleAttivitaChange}
                                                    onOpen={() => setOpenSelect(true)}
                                                    onClose={() => setOpenSelect(false)}
                                                >
                                                    {selectFields
                                                        .filter((sel) => sel.ora.includes(field.name))
                                                        .map((selectField, i) => (
                                                            <MenuItem
                                                                key={`${selectField.name}_${i}`}
                                                                value={selectField.label}
                                                                disabled={selectField.label === "Ora d'aria" && oraDAriaCount >= 1}
                                                            >
                                                                <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                                                                    <span>{selectField.label}</span>
                                                                    {openSelect && (
                                                                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); handlePopoverOpen(e, selectField.descr); }}>
                                                                            <ArrowDropDownIcon fontSize="small" />
                                                                        </IconButton>
                                                                    )}
                                                                </Box>
                                                            </MenuItem>
                                                        ))}
                                                </Select>

                                            </FormControl>

                                        </>
                                    );


                                case 'label':
                                    return (
                                        <InputLabel>{field.label}</InputLabel>
                                    );

                                case 'checkbox':
                                    return (
                                        <FormControlLabel
                                            control={<Checkbox checked={mangioScuola} onChange={() => setMangioScuola(!mangioScuola)} />}
                                            label="Mangio a scuola (2€)"
                                        />
                                    );

                                default:
                                    return (
                                        <TextField
                                            value={formData.nome}
                                            onChange={handleChange}
                                            label={field.label}
                                            variant="outlined"
                                            fullWidth
                                            required
                                            margin="normal"
                                        />

                                    );
                            }
                        })}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Button variant="contained" color="primary" type="submit">
                            Invia
                        </Button>
                    </Box>
                </Box>



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
