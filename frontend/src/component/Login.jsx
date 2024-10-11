import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

function FormLogin() {



    const formFields = [
        { label: 'Email', name: 'email', type: 'email', required: true },
        { label: 'Password', name: 'password', type: 'password', required: true }
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

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mettere dati nel db

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

export default FormLogin;
