// routes/reelRoutes.js
const express = require('express');
const { fetchInstagramReels, getReels } = require('../controllers/reelController');

const router = express.Router();

// Route to fetch and store reels for a specific Instagram username
router.get('/fetch/:username', fetchInstagramReels);

// Route to get stored reels
router.get('/reels', getReels);

module.exports = router;
