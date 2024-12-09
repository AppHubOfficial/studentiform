import React, { useEffect, useState } from 'react';
import { Box, Typography, Alert, Divider } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DrawerMenu from '../component/DrawerMenu';
import MenuIcon from '@mui/icons-material/Menu';
import '../assets/styles/Dashboard.css';
import SearchComponent from '../component/SearchComponent';
import TableDataComponent from '../component/TableDataComponent';

const apiUrl = process.env.REACT_APP_API_URL;

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [profileData, setProfileData] = useState(null);

  const [usersData, setUsersData] = useState(null);
  const [tempUsersData, setTempUsersData] = useState(null);
  const [open, setOpen] = useState(false);

  const [selectedRole, setSelectedRole] = useState("");
  const [textSearchInput, setTextSearchInput] = useState("");
  const [valueDistance, setValueDistance] = useState([0, 100]);

  const [messageErrorLoading, setMessageErrorLoading] = useState("");

  const [errorTimeout, setErrorTimeout] = useState(false);
  const TIMEOUT = 6000;


  ////////// Funzioni SearchComponent //////////

  const handleChangeRoles = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleChangeDistance = (newValue) => {
    setValueDistance(newValue);
  };

  const handleSearchInput = (event) => {
    setTextSearchInput(event.target.value);
  }

  // Funzione per applicare tutti i filtri della ricerca
  useEffect(() => {
    let filteredUsersData = tempUsersData;

    if (textSearchInput.trim().toLowerCase() !== "") {
      filteredUsersData = filteredUsersData.filter(user => {
        return (
          user.nome.toLowerCase().includes(textSearchInput) ||
          user.email.toLowerCase().includes(textSearchInput) ||
          user.tel.toLowerCase().includes(textSearchInput)
        );
      });
    }

    if (selectedRole && selectedRole !== "all") {
      filteredUsersData = filteredUsersData.filter(user => {
        return user.type.includes(selectedRole);
      });
    }

    if (valueDistance) {
      filteredUsersData = filteredUsersData?.filter(user => {
        return user.distance >= valueDistance[0] && user.distance <= valueDistance[1];
      });
    }

    setUsersData(filteredUsersData);

  }, [selectedRole, textSearchInput, valueDistance]);

  /////////////////////////////////////////////

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/users/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        navigate('/');
      } else {
        console.error("Errore durante logout");
      }
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
  };


  ///////////////////////////////////////
  useEffect(() => {

    const timeout = setTimeout(() => setErrorTimeout(true), TIMEOUT);

    const fetchUserProfileData = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/users/getProfileData`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          clearTimeout(timeout);
          const data = await response.json();

          console.log("data in dashboard: " + data)
          if (data[0]?.type === "insegnante") {
            console.log("Insegnante");
            fetchAllUsersData();
          }
          setProfileData(data[0] || {});
        } else {
          console.error(`Errore in getProfileData: ${response.status}`);
          if (response.status == 401) {
            setErrorTimeout(true)
            setMessageErrorLoading("Non autenticato. Effettua il login prima di accedere alla dashboard")
          } else {
            setMessageErrorLoading("Errore di rete")
          }
        }
      } catch (error) {
        console.error('Errore durante il recupero dei dati del profilo:', error);
      }
    };

    const fetchAllUsersData = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/users/getUsersData`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setUsersData(data);
          clearTimeout(timeout);
          setTempUsersData(data);
        } else {
          console.error(`Errore in getUsersData: ${response.status}`);
        }
      } catch (error) {
        console.error('Errore durante il recupero dei dati degli utenti:', error);
      }
    };

    fetchUserProfileData();

    return () => {
      clearTimeout(timeout);
      if (profileData) handleLogout();
    }
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
        justifyContent: 'left',
        height: '93vh',
        gap: 3,
        backgroundColor: '#f5f5f5',
        padding: '20px',
      }}
    >
      {profileData ? (
        <>
          <MenuIcon onClick={toggleDrawer(true)} sx={{ cursor: 'pointer' }} />
          <DrawerMenu open={open} toggleDrawer={toggleDrawer} handleLogout={handleLogout} />

          <Typography variant="h4" component="h1" gutterBottom>
            Benvenuto{" "}
            <Typography component="span" variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              {profileData.nome}!
            </Typography>
          </Typography>

          <Typography variant="body1">
            Sei autenticato con successo come{" "}
            <Typography component="span" variant="body1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              {profileData.type === "insegnante" ? "insegnante" : "studente"}
            </Typography>.
            Puoi gestire il tuo account qui.
          </Typography>
          <Divider />

          {profileData.type === "insegnante" && (
            <>
              <SearchComponent
                handleChangeRoles={handleChangeRoles}
                handleSearchInput={handleSearchInput}
                handleChangeDistance={handleChangeDistance}
                valueDistance={valueDistance}
              />
              <TableDataComponent usersData={usersData} />
            </>
          )}
        </>
      ) : (
        errorTimeout ? (
          <Alert severity="error">{messageErrorLoading}</Alert>
        ) : (
          <Alert severity="info">Caricamento dati utente...</Alert>
        )

      )}
    </Box>
  );
}

export default Dashboard;
