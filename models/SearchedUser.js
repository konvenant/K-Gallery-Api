const mongoose = require('mongoose');

const searchedUserSchema = new mongoose.Schema({
  email: String,
  searchedEmail:String,
  lastAction: String
  // Other user properties
});

module.exports = mongoose.model('SearchedUser', searchedUserSchema);
