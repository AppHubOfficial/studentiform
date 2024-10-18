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

// Middleware per la gestione delle sessioni
app.use(session({
  secret: 'zgyuiuyt6u$T$E$T£WVV£Vr*éù-3',
  resave: false,
  saveUninitialized: true, 
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // Durata della sessione (1 giorno)
  }
}));

// Middleware per il parsing del JSON
app.use(express.json());

// Middleware per l'header di controllo degli accessi
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// Middleware di log delle richieste
app.use((req, res, next) => {
  console.log(`Received ${req.method} request for '${req.url}'`);
  console.log('Request body:', req.body);
  next();
});

// Rotte dell'applicazione
app.use('/api/users', userRoutes);

// Avvia il server sulla porta specificata
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
