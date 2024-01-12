const mongoose = require('mongoose');

const favoriteVideoSchema = new mongoose.Schema({
  email: String,
  date: String,
  videoUrl: String
  // Other user properties
});

module.exports = mongoose.model('FavouriteVideo', favoriteVideoSchema);
