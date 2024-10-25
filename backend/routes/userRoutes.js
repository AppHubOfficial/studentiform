const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const supabase = require('../utils/supabaseClient');

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
  const university = fields.university?.value;
  const faculty = fields.faculty?.value;

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    console.log(university)

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
          created_at: new Date()
        }
      ]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    req.session.userEmail = email;
    req.session.userType = type;

    console.log("Dati della sessione salvati:", req.session);

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
      .select('email, password')
      .eq('email', email.value);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (data.length === 0) {
      return res.status(404).json({error: 'Email not found: ' + email.value});
    }

    const matchPass = await bcrypt.compare(password.value, data[0].password);

    if (!matchPass) {
      res.status(404).json({ error: 'Incorrect password' });
    }

    req.session.userEmail = email;
    return res.status(200).json({ message: 'Login successful' });

  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong', details: err.message });
  }

});



router.post('/session', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  res.status(200).json({ userId: req.session.userId, userType: req.session.userType });
});


router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }

    res.status(200).json({ message: 'Logged out successfully' });
  });
});

module.exports = router;
