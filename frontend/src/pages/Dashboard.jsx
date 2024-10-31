import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Alert, Divider } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DrawerMenu from '../component/DrawerMenu';
import MenuIcon from '@mui/icons-material/Menu';
import '../assets/styles/Dashboard.css';
import SearchComponent from '../component/SearchComponent';
import TableDataComponent from '../component/TableDataComponent';
import Context from '../Context';

export const UserContext = React.createContext();

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  //const [profileData, setProfileData] = useState(null);
  const { profileData, setProfileData } = useContext(Context);

  const [usersData, setUsersData] = useState(null);
  const [tempUsersData, setTempUsersData] = useState(null);
  const [open, setOpen] = useState(false);

  const [selectedRole, setSelectedRole] = useState("");
  const [textSearchInput, setTextSearchInput] = useState("");

  const [errorTimeout, setErrorTimeout] = useState(false);
  const TIMEOUT = 6000;


  ////////// Funzioni SearchComponent //////////

  const handleChangeRoles = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleSearchInput = (event) => {
    setTextSearchInput(event.target.value);
  }

  // Funzione per applicare tutti i filtri
  useEffect(() => {
    let filteredUsersData = tempUsersData;
  
    if (textSearchInput.trim() !== "") {
      filteredUsersData = filteredUsersData.filter(user => {
        return (
          user.nome.includes(textSearchInput) || 
          user.email.includes(textSearchInput) || 
          user.tel.includes(textSearchInput)
        );
      });
    }
  
    if (selectedRole && selectedRole !== "all") {
      filteredUsersData = filteredUsersData.filter(user => {
        return user.type.includes(selectedRole);
      });
    }
  
    setUsersData(filteredUsersData);
  
  }, [selectedRole, textSearchInput]);

  /////////////////////////////////////////////

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/logout', {
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
        const response = await fetch('http://localhost:5000/api/users/getProfileData', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          clearTimeout(timeout);
          const data = await response.json();
          setProfileData(data[0] || {});
        } else {
          console.error(`Errore in getProfileData: ${response.status}`);
        }
      } catch (error) {
        console.error('Errore durante il recupero dei dati del profilo:', error);
      }
    };

    const fetchAllUsersData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/getUsersData', {
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
    fetchAllUsersData();

    return () => clearTimeout(timeout); 
  }, []);

  useEffect(() => {
    
  }, [profileData])

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
              <SearchComponent handleChangeRoles={handleChangeRoles} handleSearchInput={handleSearchInput} />
              <TableDataComponent usersData={usersData} />
            </>
          )}
        </>
      ) : (
        errorTimeout ? (
          <Alert severity="error">Caricamento fallito.</Alert>
        ) : (
          <Alert severity="info">Caricamento dati utente...</Alert>
        )
        
      )}
    </Box>
  );
}

export default Dashboard;
