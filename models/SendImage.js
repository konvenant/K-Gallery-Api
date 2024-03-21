const mongoose = require('mongoose');

const sendImageSchema = new mongoose.Schema({
  fromEmail: String,
  toEmail: String,
  caption: String,
  date: String,
  imageUrl: String,
  delivered: Boolean,
  read: Boolean,
  isSenderDeleted:Boolean,
  dateSenderDelete:String,
  isRecieverDeleted:Boolean,
  dateRecieverDelete:String
  // Other user properties
});

module.exports = mongoose.model('SendImage', sendImageSchema);

