const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
  email: String,
  subject: String,
  message: String,
  caseNumber: String
  // Other user properties
});

module.exports = mongoose.model('Support', supportSchema);
