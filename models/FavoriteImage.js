const mongoose = require('mongoose');

const favoriteImageSchema = new mongoose.Schema({
  email: String,
  date: String,
  imageUrl: String
  // Other user properties
});

module.exports = mongoose.model('FavoriteImage', favoriteImageSchema);
