import React from 'react';
import { Box, Typography, Divider, TextField, Slider, FormControl, MenuItem, InputLabel, Select } from '@mui/material';
import Grid from '@mui/material/Grid2';

function SearchComponent({ handleChangeRoles }) {
    return (
        <>
            <Divider />
            <Box className="searchContainer" sx={{ padding: 3 }}>
                <Typography style={{ marginBottom: '50px' }} variant="h5" component="h1" gutterBottom>
                    Ricerca
                </Typography>

                <Grid container spacing={6}>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Cerca" variant="outlined" />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1">Cerca per distanza</Typography>
                        <Slider
                            defaultValue={0}
                            aria-label="Default"
                            valueLabelDisplay="auto"
                            sx={{ mt: 2 }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField style={{ width: '70px' }} label="Età" variant="outlined" />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel id="demo-simple-select-standard-label">Ruolo</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                onChange={handleChangeRoles}
                                label="Ruolo"
                            >
                                <MenuItem value="teacher">Tutti</MenuItem>
                                <MenuItem value="teacher">Insegnante</MenuItem>
                                <MenuItem value="student">Studente</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}

export default SearchComponent;
