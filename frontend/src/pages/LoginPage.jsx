import React, { useState } from 'react';
import { TextField, Button, Box, Link as MuiLink, Alert, Checkbox, FormControlLabel, FormGroup, Typography, Slider } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import PrivacyPolicyDialog from './PrivacyPolicyDialog';

import '../assets/styles/LoginPage.css';

function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { type } = location.state || {};
    const [errorMessage, setErrorMessage] = useState("");

    const text = type === 'login' ? "Non sei ancora registrato?" : "Hai già un account?";

    const formFields = [
        { label: 'Nome', name: 'nome', type: 'text', required: true, roles: ['studente', 'insegnante'] },
        { label: 'Cognome', name: 'cognome', type: 'text', required: true, roles: ['studente', 'insegnante'] },
        { label: 'Email', name: 'email', type: 'email', required: true, roles: ['login', 'studente', 'insegnante'] },
        { label: 'Password', name: 'password', type: 'password', required: true, roles: ['login', 'studente', 'insegnante'] },
        { label: 'Numero di Telefono', name: 'tel', type: 'text', required: true, roles: ['studente', 'insegnante'] },
        { label: 'Università', name: 'university', type: 'text', required: false, roles: ['studente'], dependencies: ['school'] },
        { label: 'Facoltà', name: 'faculty', type: 'text', required: false, roles: ['studente'], dependencies: ['school'] },
        { label: 'Attività', name: 'activities', type: 'checkboxSchoolOrWork', required: true, roles: ['studente'] },
        { label: 'Quanto ti puoi spostare?', name: 'distance', type: 'slider', required: true, roles: ['studente'], dependencies: ['work'] },
        { label: 'Luogo di lavoro', name: 'work', type: 'text', required: false, roles: ['studente'], dependencies: ['work'] },
        { label: 'Note', name: 'note', type: 'text', required: false, roles: ['studente'] }
    ];

    const filteredFields = formFields.filter(field => field.roles.includes(type));

    const initialFormData = filteredFields.reduce((acc, field) => {
        acc[field.name] = '';
        return acc;
    }, {});

    const [formData, setFormData] = useState(initialFormData);
    const [schoolChecked, setSchoolChecked] = useState(false);
    const [workChecked, setWorkChecked] = useState(false);
    const [distance, setDistance] = useState(10);

    const [privacyOpen, setPrivacyOpen] = useState(false);
    const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

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

    const handleSliderChange = (e, newValue) => {
        setDistance(newValue);
        setFormData({
            ...formData,
            distance: newValue
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!acceptedPrivacy) {
            setErrorMessage("Devi accettare l'informativa sulla privacy.");
            return;
        }

        const dataToSend = filteredFields.reduce((acc, field) => {
            acc[field.name] = {
                value: formData[field.name],
                required: field.required
            };
            return acc;
        }, { type });

        dataToSend.distance = {
            value: distance,
            required: true
        };

        dataToSend.activities = {
            value: formData.activities || [],
            required: false
        };

        const regex = /^\d+(\.\d+)?$/;
        if (regex.test(formData.tel) && formData.tel.length !== 10) {
            setErrorMessage("Numero di telefono non valido");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/users/${type === 'login' ? 'login' : 'create-user'}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(dataToSend),
            });

            const data = await response.json();

            if (response.ok) {
                setFormData(initialFormData);
                navigate('/dashboard');
            } else {
                console.log(data.error);
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

            {filteredFields.map((field) => {
                // Verifica se le dipendenze sono soddisfatte
                const isDependencyMet = !field.dependencies || field.dependencies.every(dep => (dep === 'school' ? schoolChecked : workChecked));

                // Se le dipendenze non sono soddisfatte, non mostrare il campo
                if (!isDependencyMet) return null;

                switch (field.type) {
                    case 'checkboxSchoolOrWork':
                        return (
                            <FormGroup key={field.name} sx={{ border: "1px solid #c2c2c2", padding: "15px", borderRadius: "4px" }}>
                                <Typography sx={{ fontSize: "17px", marginBottom: "10px", color: "#5e5e5e" }} variant="p" component="p">Studi o lavori?*</Typography>
                                <FormControlLabel
                                    control={<Checkbox checked={schoolChecked} onChange={handleCheckboxChange} name="scuola" />}
                                    label="Studio"
                                />
                                <FormControlLabel
                                    control={<Checkbox checked={workChecked} onChange={handleCheckboxChange} name="lavoro" />}
                                    label="Lavoro"
                                />
                            </FormGroup>
                        );
                    case 'slider':
                        return (
                            <Box key={field.name} sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography id="input-slider" gutterBottom>
                                    {field.label} {distance}km
                                </Typography>
                                <Slider
                                    value={distance}
                                    onChange={handleSliderChange}
                                    aria-labelledby="input-slider"
                                    min={0}
                                    max={100}
                                />
                            </Box>
                        );
                    default:
                        return (
                            <TextField
                                key={field.name}
                                label={field.label}
                                name={field.name}
                                type={field.type}
                                value={formData[field.name]}
                                onChange={handleChange}
                                variant="outlined"
                                required={field.required}
                            />
                        );
                }
            })}

            <FormControlLabel
                control={
                    <Checkbox
                        checked={acceptedPrivacy}
                        onChange={(e) => setAcceptedPrivacy(e.target.checked)}
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

            <MuiLink to={type === 'login' ? '/' : '/login'} state={{ type: 'login' }} component={Link}>
                {text + " Clicca qui"}
            </MuiLink>
        </Box>
    );
}

export default LoginPage;
