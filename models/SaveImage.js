const mongoose = require('mongoose');

const saveImageSchema = new mongoose.Schema({
  email: String,
  caption: String,
  date: String,
  imageUrl: String
  // Other user properties
});

module.exports = mongoose.model('SaveImage', saveImageSchema);
