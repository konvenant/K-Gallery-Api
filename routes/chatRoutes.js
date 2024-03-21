const express = require('express');
const chatController = require('../controllers/chatController');
const chatRouter = express.Router();


chatRouter.get("/chatList/:email", chatController.getAllChatEmails);
chatRouter.get("/chatMesaageList/:email1/:email2", chatController.getAllChatMessages);

module.exports = chatRouter;
