import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

///////////////////////////COMPONENTE ATTUALMENTE NON USATO///////////////////////////

function Form() {


    const formFields = [
        { label: 'Nome', name: 'Nome', type: 'text', required: true },
        { label: 'Cognome', name: 'Cognome', type: 'text', required: true },
        { label: 'Email', name: 'email', type: 'email', required: true },
        { label: 'Password', name: 'password', type: 'password', required: true },
        { label: 'Numero di Telefono', name: 'NumeroDiTelefono', type: 'tel', required: true },
        { label: 'Università', name: 'università', type: 'text', required: false },
        { label: 'Facoltà', name: 'Facoltà', type: 'text', required: false }
    
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
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Utente creato:', data);
                setFormData(initialFormData);
            } else {
                console.error('Errore nella creazione dell\'utente:', data.error);
            }
        } catch (error) {
            console.error('Errore di rete:', error);
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
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
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

export default Form;
