const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const supabase = require('../utils/supabaseClient');

const jwt = require('jsonwebtoken');

require('dotenv').config();

///////////////// CREATE USER /////////////////
router.post('/create-user', async (req, res) => {
  const { type, ...fields } = req.body;
  console.log(req.body)

  const missingFields = Object.entries(fields).filter(([key, value]) => value.required && !value.value);
  if (missingFields.length > 0) {
    return res.status(400).json({
      error: 'Non tutti i campi required sono compilati',
      missingFields: missingFields.map(([key]) => key),
    });
  }

  const nome = fields.nome.value;
  const cognome = fields.cognome.value;
  const email = fields.email.value;
  const password = fields.password.value.toString();
  const tel = fields.tel.value;
  const university = fields.university?.value;
  const faculty = fields.faculty?.value;
  const distance = fields.distance?.value;
  const activities = fields.activities?.value;
  const work = fields.work?.value;
  const note = fields.note?.value;
  const ripetizioni = fields.ripetizioni?.value;
  const role = req.body.role;


  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          nome,
          cognome,
          email,
          password: hashedPassword,
          role,
          tel,
          university,
          faculty,
          distance,
          activities,
          work,
          note,
          ripetizioni,
        }
      ]);

    if (error) {
      if (error.code === '23505') { // Codice di errore specifico per violazione di unicità in PostgreSQL
        return res.status(409).json({ error: 'Email già registrata' });
      }
      return res.status(500).json({ error: error.message, details: error });
    }

    const token = jwt.sign(
      { email: email, role: role }, // il payload
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.cookie('email', email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.cookie('role', role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.status(201).json({ message: 'User created successfully', data });
  } catch (err) {
    res.status(500).json({ error: `Something went wrong`, details: err.message });
  }
});


///////////////// LOGIN /////////////////
router.post('/login', async (req, res) => {
  console.log(req.body);
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('password, role')
      .eq('email', email.value);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (data.length === 0) {
      return res.status(404).json({ error: 'Email o password errati' });
    }

    const matchPass = await bcrypt.compare(password.value, data[0].password);

    if (!matchPass) {
      return res.status(404).json({ error: 'Email o password errati' });
    }

    const token = jwt.sign(
      { email: email.value, role: data[0].role }, // il payload
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.cookie('email', email.value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.cookie('role', role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return res.status(200).json({ message: 'Login successful' });

  } catch (err) {

    return res.status(500).json({ error: 'Something went wrong during login', details: err.message });
  }

});

///////////////// LOGOUT /////////////////
router.post('/logout', (req, res) => {
  try {
    res.clearCookie('authToken');
    res.clearCookie('email');
    res.clearCookie('role');

    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong during logout', details: err.message });
  }
});

///////////////// GET PROFILE DATA /////////////////
router.post('/getProfileData', async (req, res) => {

  const token = req.cookies.authToken;
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    const email = decodedData.email;

    console.log("DECODED DATA: " + decodedData.email)

    if (!email) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { data, error } = await supabase
      .from('users')
      .select('id, nome, cognome, email, tel, role, university, faculty, activities, distance, work, ripetizioni, note, created_at')
      .eq('email', email);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    console.log("getProfileData: ", data);
    res.status(200).json(data);
  } catch (err) {
    console.error('Errore durante la verifica del token: ', err.message);
    res.status(401).json({ error: 'Invalid token' });
  }

});


///////////////// GET USERS DATA /////////////////
router.post('/getUsersData', async (req, res) => {

  const token = req.cookies.authToken;
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    const email = decodedData.email;
    const role = decodedData.role;


    if (!email) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (role !== "insegnante") {
      return res.status(401).json({ error: 'Not authorized' });
    }

    const { data, error } = await supabase
      .from('users')
      .select('nome, cognome, email, tel, role, university, faculty, activities, distance, work, note, ripetizioni, created_at');

    if (error) {
      console.error('Errore nel recupero dei dati:', error);
      return res.status(500).json({ error: 'Errore nel recupero dei dati' });
    }

    return res.json(data);
  } catch (err) {
    console.error('Errore durante la verifica del token: ', err.message);
    res.status(401).json({ error: 'Invalid token' });
  }

});


///////////////// EDIT PROFILE DATA /////////////////
router.post('/editProfileData', async (req, res) => {
  const token = req.cookies.authToken;
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    const email = decodedData.email;

    if (!email) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { nome, cognome, tel, role, university, faculty, activities, distance, note, work, ripetizioni } = req.body;

    const { data, error } = await supabase
      .from('users')
      .update({ nome, cognome, tel, role, university, faculty, activities, distance, note, work, ripetizioni })
      .eq('email', email);

    if (error) {
      console.error('Errore durante aggiornamento profilo:', error);
      return res.status(500).json({ error: 'Errore aggiornamento profilo' });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('Errore durante la verifica del token: ', err.message);
    res.status(401).json({ error: 'Invalid token' });
  }

});


///////////////// SAVE DATA COGESTIONE /////////////////
router.post('/save_data_cogestione', async (req, res) => {
  console.log(req.body);

  const { nome, cognome, classe, m1, m2, m3, g1, g2, g3, pomeriggio, mangioScuola } = req.body;

  try {
    const { data, error } = await supabase
      .from('cogestione')
      .insert([
        {
          nome,
          cognome,
          classe,
          attivita_mattina_merc: [m1, m2, m3],
          attivita_mattina_giov: [g1, g2, g3],
          attivita_pomeriggio: pomeriggio,
          mangio_scuola: mangioScuola,
        }
      ]);

    if (error) {
      console.error("Errore Supabase:", error.message);
      return res.status(500).json({ error: "Errore invio form cogestione" });
    }

    res.status(200).json(data);

  } catch (err) {
    console.error("Errore del server:", err);
    res.status(500).json({ error: "Errore del server" });
  }
});



///////////////// GET DATA COGESTIONE /////////////////
router.get('/get_data_cogestione', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cogestione')
      .select('*'); // Se vuoi filtrare i dati, aggiungi .eq('colonna', valore)

    if (error) {
      console.error("Errore Supabase:", error.message);
      return res.status(500).json({ error: "Errore nel recupero dei dati" });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("Errore del server:", err);
    res.status(500).json({ error: "Errore del server" });
  }
});

module.exports = router;
