const express = require('express');
const authController = require('../controllers/authController');

const authRouter = express.Router();
authRouter.post('/signup', authController.signup);
authRouter.post('/login', authController.login);
authRouter.post('/verify', authController.verifyEmail);
authRouter.post('/verifyPassword', authController.verifyPassWord);
authRouter.post('/sendToken', authController.sendToken);
authRouter.post('/forgotPassword/:email', authController.forgotPassword);

module.exports = authRouter;
