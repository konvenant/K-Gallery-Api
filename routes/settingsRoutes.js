const express = require('express');
const settingsController = require('../controllers/settingsController');

const settingsRouter = express.Router();
settingsRouter.get('/getUserSettings/:email', settingsController.getAllCurrentSettings);
settingsRouter.post('/updateSetting',settingsController.updateSettings);

module.exports = settingsRouter;