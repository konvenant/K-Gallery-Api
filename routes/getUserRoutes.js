const express = require('express');
const getUserController = require('../controllers/getUserController');
const getUserRouter = express.Router();

getUserRouter.post("/getUser",getUserController.getUserToSendTo);
getUserRouter.post("/getUserEmail",getUserController.getUserEmail);
getUserRouter.post("/addSearchedEmail",getUserController.addSearchedUser);
getUserRouter.post("/getAllSearchedEmail",getUserController.getSearchedUser)
getUserRouter.post("/deleteSearchedEmail",getUserController.deleteSearchUser);


module.exports = getUserRouter;