const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const supabase = require('../utils/supabaseClient');

// Rotta per il login e gestione sessione
router.post('/create-user', async (req, res) => {

  const { type, ...fields } = req.body;

  // Per verificare che non ci siano campi required vuoti
  const missingFields = Object.entries(fields).filter(([key, value]) => value.required && !value.value);

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: 'All required fields are missing',
      missingFields: missingFields.map(([key]) => key),
    });
  }

  const nome = fields.nome.value;
  const email = fields.email.value;
  const password = fields.password.value.toString();
  const tel = fields.tel.value;

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
          created_at: new Date()
        }
      ]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ message: 'User created successfully', data });
  } catch (err) {
    res.status(500).json({ error: `Something went wrong`, details: err.message });
  }
});


// Rotta per recuperare i dati della sessione dell'utente loggato
router.get('/session', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  res.status(200).json({ userId: req.session.userId, userType: req.session.userType });
});

// Rotta per disconnettersi (logout)
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }

    res.status(200).json({ message: 'Logged out successfully' });
  });
});

module.exports = router;
