const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const supabase = require('../utils/supabaseClient');

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
  const email = fields.email.value;
  const password = fields.password.value.toString();
  const tel = fields.tel.value;
  const university = fields.university?.value;
  const faculty = fields.faculty?.value;
  const distance = fields.distance?.value;
  const activities = fields.activities?.value;

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          nome,
          email,
          password: hashedPassword,
          type,
          tel,
          university,
          faculty,
          distance,
          activities,
          created_at: new Date()
        }
      ]);

    if (error) {
      if (error.code === '23505') { // Codice di errore specifico per violazione di unicità in PostgreSQL
        return res.status(409).json({ error: 'Email già registrata' });
      }
      return res.status(500).json({ error: error.message, details: error });
    }

    req.session.userEmail = email;
    req.session.userType = type;

    await new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    console.log("Dati della sessione salvati create user:", req.session);
    res.status(201).json({ message: 'User created successfully', data });
  } catch (err) {
    res.status(500).json({ error: `Something went wrong`, details: err.message });
  }
});



router.post('/login', async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('password, type')
      .eq('email', email.value);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (data.length === 0) {
      return res.status(404).json({ error: 'Email not found: ' + email.value });
    }

    const matchPass = await bcrypt.compare(password.value, data[0].password);

    if (!matchPass) {
      res.status(404).json({ error: 'Incorrect password' });
    }

    req.session.userEmail = email.value;
    req.session.userType = data[0].type;

    console.log("Dati della sessione salvati:", req.session);
    return res.status(200).json({ message: 'Login successful' });

  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong', details: err.message });
  }

});


router.post('/logout', (req, res) => {
  console.log("Dati della sessione salvati logout:", req.session);
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    console.log("Logged out successfully");

    res.status(200).json({ message: 'Logged out successfully' });
  });
});


router.post('/getProfileData', async (req, res) => {

  const email = req.session.userEmail;

  console.log("Dati della sessione salvati getProfileData:", req.session);

  if (!email) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { data, error } = await supabase
    .from('users')
    .select('id, nome, email, tel, type, university, faculty, activities, distance, created_at')
    .eq('email', email);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  console.log(data);
  res.status(200).json(data);
});


router.post('/getUsersData', async (req, res) => {
  const email = req.session.userEmail;
  const type = req.session.userType;

  console.log("Dati della sessione salvati getUsersData:", req.session);

  if (!email) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  if (type !== "insegnante") {
    return res.status(401).json({ error: 'Not authorized' });
  }

  const { data, error } = await supabase
    .from('users')
    .select('nome, email, tel, type, university, faculty, activities, distance, created_at');

  if (error) {
    console.error('Errore nel recupero dei dati:', error);
    return res.status(500).json({ error: 'Errore nel recupero dei dati' });
  }

  console.log('Dati recuperati:', data);
  return res.json(data);
});

router.post('/editProfileData', async (req, res) => {
  const email = req.session.userEmail;

  if (!email) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  
  
  
});


module.exports = router;
