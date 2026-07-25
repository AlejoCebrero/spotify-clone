const express = require('express');
const router = express.Router();
const {
  getSongs,
  getSongById,
  createSong,
  updateSong,
  deleteSong
} = require('../controllers/songController');
const protect = require('../middlewares/authMiddleware');

router.get('/', getSongs);
router.get('/:id', getSongById);
router.post('/', protect, createSong);
router.put('/:id', protect, updateSong);
router.delete('/:id', protect, deleteSong);

module.exports = router;