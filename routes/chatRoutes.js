const express = require('express');
const chatController = require('../controllers/chatController');
const chatRouter = express.Router();


chatRouter.get("/chatList/:email", chatController.getAllChatEmails);

module.exports = chatRouter;
