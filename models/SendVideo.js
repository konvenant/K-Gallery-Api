const mongoose = require('mongoose');

const sendVideoSchema = new mongoose.Schema({
  fromEmail: String,
  toEmail: String,
  caption: String,
  date: String,
  videoUrl: String,
  delivered: Boolean,
  read: Boolean,
  isSenderDeleted:Boolean,
  dateSenderDelete:String,
  isRecieverDeleted:Boolean,
  dateRecieverDelete:String
  // Other user properties
});

module.exports = mongoose.model('SendVideo', sendVideoSchema);
