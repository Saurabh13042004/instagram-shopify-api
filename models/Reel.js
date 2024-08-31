// models/Reel.js
const mongoose = require('mongoose');

const reelSchema = new mongoose.Schema({
  media_url: { type: String, required: true },
  media_type: { type: String, required: true },
  instagram_id: { type: String, required: true, unique: true },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Reel', reelSchema);
