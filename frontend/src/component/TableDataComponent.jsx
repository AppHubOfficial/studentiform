import React, { useEffect, useState } from 'react';
import { Box, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

function TableDataComponent({ usersData }) {
    const columns = [
        { field: 'nome', headerName: 'Nome', width: 130 },
        { field: 'email', headerName: 'Email', width: 230 },
        { field: 'tel', headerName: 'Telefono', width: 130 },
        { field: 'type', headerName: 'Ruolo', width: 130 },
        { field: 'university', headerName: 'Università', width: 130 },
        { field: 'faculty', headerName: 'Facoltà', width: 130 },
        {
            field: 'created_at',
            headerName: 'Creato il giorno',
            width: 160,
            valueGetter: (value) => {
                if (!value) {
                  return value;
                }
                return formatDate(value)
              },
        },
    ];

    const paginationModel = { page: 0, pageSize: 10 };

    function formatDate(dateString) {
        const regex = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/;
        const match = dateString.match(regex);

        if (!match) return null;

        const [, year, month, day, hour, minute] = match;
        return `${day}/${month}/${year}, ${hour}:${minute}`;
    };

    return (
        <>
            <Box>
                <Paper sx={{ height: 500, width: '100%' }}>
                    <DataGrid
                        rows={usersData}
                        columns={columns}
                        getRowId={(row) => row.email}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[20, 30, 40, 50, 100, 500]}
                        pagination
                        checkboxSelection
                        sx={{ border: 0 }}
                    />
                </Paper>
            </Box>
        </>
    );
}

export default TableDataComponent;
