const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  email: String,
  heading: String,
  body: String,
  date: String,
  isRead: Boolean,
  action:String,
  url:String
});

module.exports = mongoose.model('Notification', noticeSchema);