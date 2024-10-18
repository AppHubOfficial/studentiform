import React, { useState } from 'react';
import { TextField, Button, Box, Link as MuiLink } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import '../assets/styles/LoginPage.css';

function LoginPage() {
    const navigate = useNavigate();

    const location = useLocation();
    const { type } = location.state || {};

    let text = type === 'login' ? "Non sei ancora registrato?" : "Hai già un account?";

    const formFields = [
        { label: 'Nome', name: 'nome', type: 'text', required: true, roles: ['student', 'teacher'] },
        { label: 'Cognome', name: 'cognome', type: 'text', required: true, roles: ['student', 'teacher'] },
        { label: 'Email', name: 'email', type: 'email', required: true, roles: ['login', 'student', 'teacher'] },
        { label: 'Password', name: 'password', type: 'password', required: true, roles: ['login', 'student', 'teacher'] },
        { label: 'Numero di Telefono', name: 'tel', type: 'text', required: true, roles: ['student', 'teacher'] },
        { label: 'Università', name: 'university', type: 'text', required: false, roles: ['student'] },
        { label: 'Facoltà', name: 'faculty', type: 'text', required: false, roles: ['student'] }
    ];

    const filteredFields = formFields.filter(field => field.roles.includes(type)); // Per mostrare solo i campi relativi a studente o insegnante

    const initialFormData = filteredFields.reduce((acc, field) => {
        acc[field.name] = '';
        return acc;
    }, {});

    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };


    ////////////////////////////////////
    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToSend = filteredFields.reduce((acc, field) => {
            acc[field.name] = {
                value: formData[field.name],
                required: field.required
            };
            return acc;
        }, { type });


        // Se si sta facendo il login redirecto a users/login
        if (type === "login") {

            try {
                const response = await fetch('http://localhost:5000/api/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataToSend),
                });

                const data = await response.json();

                if (response.ok) {
                    setFormData(initialFormData);

                    navigate('/dashboard');
                } else {
                    console.error('Errore nel login dell\'utente:', data.error);
                }
            } catch (error) {
                console.error('Errore di rete:', error);
            }

        } else { // Altrimenti redirecto a users/create-user

            try {
                const response = await fetch('http://localhost:5000/api/users/create-user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataToSend),
                });

                const data = await response.json();

                if (response.ok) {
                    console.log('Utente creato:', data);
                    setFormData(initialFormData);

                    // Reindirizza l'utente alla dashboard
                    navigate('/dashboard');
                } else {
                    console.error('Errore nella creazione dell\'utente:', data.error);
                }
            } catch (error) {
                console.error('Errore di rete:', error);
            }
        }


    };
    ////////////////////////////////////



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
            <ArrowBackIcon style={{ cursor: 'pointer' }} onClick={() => navigate('/')}></ArrowBackIcon>
            {filteredFields.map((field) => (
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
            ))}
            <Button variant="contained" color="primary" type="submit" style={{ marginTop: '50px' }}>
                Invia
            </Button>


            <MuiLink to={type === 'login' ? '/' : '/login'} state={{ type: 'login' }} component={Link}>
                {text + " Clicca qui"}
            </MuiLink>

        </Box>
    );
}

export default LoginPage;
