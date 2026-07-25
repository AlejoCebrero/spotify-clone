const express = require('express');
const router = express.Router();
const {
  createPlaylist,
  getMyPlaylists,
  getPlaylistById,
  addSongToPlaylist,
  removeSongFromPlaylist,
  deletePlaylist
} = require('../controllers/playlistController');
const protect = require('../middlewares/authMiddleware');

router.post('/', protect, createPlaylist);
router.get('/', protect, getMyPlaylists);
router.get('/:id', protect, getPlaylistById);
router.put('/:id/add', protect, addSongToPlaylist);
router.put('/:id/remove', protect, removeSongFromPlaylist);
router.delete('/:id', protect, deletePlaylist);

module.exports = router;