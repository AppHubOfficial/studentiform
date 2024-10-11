import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

function MyForm() {



    const formFields = [
        { label: 'Nome', name: 'Nome', type: 'text', required: true },
        { label: 'Cognome', name: 'Cognome', type: 'text', required: true },
        { label: 'Email', name: 'email', type: 'email', required: true },
        { label: 'Numero di Telefono', name: 'NumeroDiTelefono', type: 'tel', required: true },
        { label: 'Università', name: 'università', type: 'text', required: false },
        { label: 'Facoltà', name: 'Facoltà', type: 'text', required: false },

    ];

    const initialFormData = formFields.reduce((acc, field) => {
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/users/create-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData), // Invia i dati del modulo come JSON
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Utente creato:', data);
                // Puoi resettare il modulo o mostrare un messaggio di successo
                setFormData(initialFormData); // Resetta il modulo
            } else {
                console.error('Errore nella creazione dell\'utente:', data.error);
                // Puoi mostrare un messaggio di errore all'utente
            }
        } catch (error) {
            console.error('Errore di rete:', error);
            // Gestisci l'errore di rete (es. mostra un messaggio all'utente)
        }

        console.log(formData);
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
            }}
        >
            {formFields.map((field) => (
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
        </Box>
    );
}

export default MyForm;
