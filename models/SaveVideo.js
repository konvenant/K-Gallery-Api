const mongoose = require('mongoose');

const saveVideoSchema = new mongoose.Schema({
  email: String,
  caption: String,
  date: String,
  videoUrl: String
  // Other user properties
});

module.exports = mongoose.model('SaveVideo', saveVideoSchema);
