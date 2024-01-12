const mongoose = require('mongoose');

const settingsSchema= new mongoose.Schema({
 email: String,
 darkMode: Boolean,
 language: String,
 notificationOn: Boolean,
 sendNewsLetter: Boolean
});

module.exports = mongoose.model('Settings', settingsSchema);
