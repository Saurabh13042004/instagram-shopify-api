// routes/reelRoutes.js
const express = require('express');
const { fetchInstagramReels, getReels , deleteReels } = require('../controllers/reelController');

const router = express.Router();

// Route to fetch and store reels for a specific Instagram username
router.get('/fetch/:username', fetchInstagramReels);

router.delete('/reels', deleteReels);
// Route to get stored reels
router.get('/reels', getReels);

module.exports = router;
