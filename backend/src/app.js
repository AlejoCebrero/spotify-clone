const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ mensaje: 'API del clon de Spotify funcionando' });
});

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const songRoutes = require('./routes/songRoutes');
app.use('/api/songs', songRoutes);

module.exports = app;