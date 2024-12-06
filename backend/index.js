const express = require('express');
const cors = require('cors');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const Redis = require('ioredis');
const userRoutes = require('./routes/userRoutes');

require('dotenv').config();

const app = express();

// console.log(process.env.FRONTEND_URL)

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
});

const corsOptions = {
  origin: `${process.env.FRONTEND_URL}`,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));

app.use(session({
  store: new RedisStore({ client: redisClient }),
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
