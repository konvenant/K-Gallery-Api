const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  phone: String,
  name: String,
  country: String,
  city:String,
  password: String,
  imageUrl: String,
  token: Number,
  isEmailVerified: Boolean,
  dateAdded: String,
  forgotPasswordToken: String,
  lastUpdated: String
  // Other user properties
});

module.exports = mongoose.model('User', userSchema);
