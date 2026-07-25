const Song = require('../models/Song');
const searchExternalSongs = require('../services/itunesService');

const getSongs = async (req, res) => {
  try {
    const { title, artist, genre } = req.query;
    const filter = {};

    if (title) filter.title = { $regex: title, $options: 'i' };
    if (artist) filter.artist = { $regex: artist, $options: 'i' };
    if (genre) filter.genre = { $regex: genre, $options: 'i' };

    const songs = await Song.find(filter);
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
};

const getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ mensaje: 'Canción no encontrada' });
    }
    res.status(200).json(song);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
};

const createSong = async (req, res) => {
  try {
    const { title, artist, album, duration, genre } = req.body;

    if (!title || !artist || !duration) {
      return res.status(400).json({ mensaje: 'Título, artista y duración son obligatorios' });
    }

    const newSong = new Song({ title, artist, album, duration, genre });
    await newSong.save();

    res.status(201).json(newSong);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
};

const updateSong = async (req, res) => {
  try {
    const updatedSong = await Song.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedSong) {
      return res.status(404).json({ mensaje: 'Canción no encontrada' });
    }

    res.status(200).json(updatedSong);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
};

const deleteSong = async (req, res) => {
  try {
    const deletedSong = await Song.findByIdAndDelete(req.params.id);

    if (!deletedSong) {
      return res.status(404).json({ mensaje: 'Canción no encontrada' });
    }

    res.status(200).json({ mensaje: 'Canción eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
};

const searchExternal = async (req, res) => {
  try {
    const { term } = req.query;

    if (!term) {
      return res.status(400).json({ mensaje: 'El parámetro "term" es obligatorio' });
    }

    const songs = await searchExternalSongs(term);
    res.status(200).json(songs);

  } catch (error) {
    res.status(503).json({ mensaje: 'Error al conectar con el servicio externo', error: error.message });
  }
};

module.exports = { getSongs, getSongById, createSong, updateSong, deleteSong, searchExternal};