const Playlist = require('../models/Playlist');
const Song = require('../models/Song');

const createPlaylist = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ mensaje: 'El nombre de la playlist es obligatorio' });
    }

    const newPlaylist = new Playlist({
      name,
      user: req.userId,
      songs: []
    });

    await newPlaylist.save();
    res.status(201).json(newPlaylist);

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
};

const getMyPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ user: req.userId });
    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
};

const getPlaylistById = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id).populate('songs');

    if (!playlist) {
      return res.status(404).json({ mensaje: 'Playlist no encontrada' });
    }

    if (playlist.user.toString() !== req.userId) {
      return res.status(403).json({ mensaje: 'No tenés permiso para ver esta playlist' });
    }

    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
};

const addSongToPlaylist = async (req, res) => {
  try {
    const { songId } = req.body;

    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ mensaje: 'Playlist no encontrada' });
    }

    if (playlist.user.toString() !== req.userId) {
      return res.status(403).json({ mensaje: 'No tenés permiso para modificar esta playlist' });
    }

    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ mensaje: 'Canción no encontrada' });
    }

    if (playlist.songs.includes(songId)) {
      return res.status(400).json({ mensaje: 'La canción ya está en la playlist' });
    }

    playlist.songs.push(songId);
    await playlist.save();

    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
};

const removeSongFromPlaylist = async (req, res) => {
  try {
    const { songId } = req.body;

    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ mensaje: 'Playlist no encontrada' });
    }

    if (playlist.user.toString() !== req.userId) {
      return res.status(403).json({ mensaje: 'No tenés permiso para modificar esta playlist' });
    }

    playlist.songs = playlist.songs.filter(id => id.toString() !== songId);
    await playlist.save();

    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
};

const deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ mensaje: 'Playlist no encontrada' });
    }

    if (playlist.user.toString() !== req.userId) {
      return res.status(403).json({ mensaje: 'No tenés permiso para borrar esta playlist' });
    }

    await Playlist.findByIdAndDelete(req.params.id);
    res.status(200).json({ mensaje: 'Playlist eliminada correctamente' });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
};

module.exports = {
  createPlaylist,
  getMyPlaylists,
  getPlaylistById,
  addSongToPlaylist,
  removeSongFromPlaylist,
  deletePlaylist
};