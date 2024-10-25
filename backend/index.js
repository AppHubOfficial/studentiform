const express = require('express');
const cors = require('cors');
const session = require('express-session');
const userRoutes = require('./routes/userRoutes');

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));

app.use(session({
  secret: '89g^_oPt7_0GYlC;YV#[8&uQ&3b,v&!q',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Mettere a true in produzione (HTTPS)
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 1 giorno
  }
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`Received ${req.method} request for '${req.url}'`);
  console.log('Request body:', req.body);
  next();
});

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
