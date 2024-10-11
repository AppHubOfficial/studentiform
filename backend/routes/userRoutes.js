const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const supabase = require('../utils/supabaseClient');

router.post('/create-user', async (req, res) => {
  const { nome, email, password, type, tel } = req.body;

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
    res.status(500).json({ error: 'Something went wrong', details: err.message });
  }
});

module.exports = router;
