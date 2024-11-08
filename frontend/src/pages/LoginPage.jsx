import React, { useState } from 'react';
import { TextField, Button, Box, Link as MuiLink, Alert, Checkbox, FormControlLabel, FormGroup, Typography, Slider } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrivacyPolicyDialog from './PrivacyPolicyDialog';

function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { type } = location.state || {};
    const [errorMessage, setErrorMessage] = useState("");
    const [privacyOpen, setPrivacyOpen] = useState(false);
    const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        cognome: '',
        email: '',
        password: '',
        tel: '',
        university: '',
        faculty: '',
        work: '',
        activities: [],
        distance: 10,
    });

    const [schoolChecked, setSchoolChecked] = useState(false);
    const [workChecked, setWorkChecked] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
    
        if (name === 'scuola') setSchoolChecked(checked);
        else if (name === 'lavoro') setWorkChecked(checked);
    
        const arrayActivities = Array.isArray(formData.activities) ? formData.activities : [];
    
        const updatedActivities = checked
            ? [...arrayActivities, name] 
            : arrayActivities.filter(val => val !== name);
    
        setFormData({
            ...formData,
            activities: updatedActivities 
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!acceptedPrivacy) {
            setErrorMessage("Devi accettare l'informativa sulla privacy.");
            return;
        }

        // ...logica di invio del modulo...

        try {
            const response = await fetch('http://localhost:5000/api/users/create-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setFormData({
                    nome: '',
                    cognome: '',
                    email: '',
                    password: '',
                    tel: '',
                    university: '',
                    faculty: '',
                    work: '',
                    activities: [],
                    distance: 10,
                });
                navigate('/dashboard');
            } else {
                setErrorMessage(data.error || 'Si è verificato un errore sconosciuto');
            }
        } catch (error) {
            console.error('Errore di rete:', error);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '15px',
                width: '400px',
                margin: 'auto',
                position: 'relative',
                top: '100px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            }}
        >
            {errorMessage !== "" && <Alert severity="error">{errorMessage}</Alert>}
            <ArrowBackIcon style={{ cursor: 'pointer' }} onClick={() => navigate('/')}></ArrowBackIcon>

            <TextField
                label="Nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                fullWidth
                required
            />
            <TextField
                label="Cognome"
                name="cognome"
                value={formData.cognome}
                onChange={handleChange}
                fullWidth
                required
            />
            <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
            />
            <TextField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                required
            />
            <TextField
                label="Telefono"
                name="tel"
                value={formData.tel}
                onChange={handleChange}
                fullWidth
                required
            />

            {/* Condizioni di visualizzazione per scuola e lavoro */}
            {schoolChecked && (
                <>
                    <TextField
                        label="Università"
                        name="university"
                        value={formData.university}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Facoltà"
                        name="faculty"
                        value={formData.faculty}
                        onChange={handleChange}
                        fullWidth
                    />
                </>
            )}

            {workChecked && (
                <TextField
                    label="Lavoro"
                    name="work"
                    value={formData.work}
                    onChange={handleChange}
                    fullWidth
                />
            )}

            {/* Attività - Scuola o Lavoro */}
            <FormGroup>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={schoolChecked}
                            onChange={handleCheckboxChange}
                            name="scuola"
                        />
                    }
                    label="Sono uno studente"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={workChecked}
                            onChange={handleCheckboxChange}
                            name="lavoro"
                        />
                    }
                    label="Sto lavorando"
                />
            </FormGroup>

            {/* Informativa Privacy */}
            <FormControlLabel
                control={
                    <Checkbox
                        checked={acceptedPrivacy}
                        onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                        color="primary"
                    />
                }
                label={
                    <Typography>
                        Ho letto e accetto <MuiLink onClick={() => setPrivacyOpen(true)} sx={{ textDecoration: 'underline', cursor: 'pointer' }}>l'informativa sulla privacy</MuiLink>.
                    </Typography>
                }
            />

            <Button variant="contained" color="primary" type="submit" style={{ marginTop: '30px', marginBottom: "10px" }}>
                Invia
            </Button>

            {/* Dialog Privacy Policy */}
            <PrivacyPolicyDialog open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
        </Box>
    );
}

export default LoginPage;
