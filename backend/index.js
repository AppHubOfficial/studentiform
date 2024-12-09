const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const userRoutes = require('./routes/userRoutes');

require('dotenv').config();

const app = express();

// console.log(process.env.FRONTEND_URL)

const corsOptions = {
  origin: `${process.env.FRONTEND_URL}`,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Received ${req.method} request for '${req.url}'`);
  console.log('Request body:', req.body);
  next();
});

app.use('/api/users', userRoutes);

app.use((req, res, next) => {
  const token = req.cookies.authToken;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      console.error('Token non valido:', err.message);
      res.status(401).json({ message: 'Token non valido o scaduto' });
      return;
    }
  }
  next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
