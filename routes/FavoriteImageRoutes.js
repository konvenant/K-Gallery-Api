const express = require('express');


const favoriteImageController = require('../controllers/favoriteImageController');
favoriteImageRouter = express.Router();

favoriteImageRouter.post("/addFavoriteImage",favoriteImageController.addImageToFavorite);
favoriteImageRouter.get("/getAllFavoriteImages/:email",favoriteImageController.getAllFavoriteImages);
favoriteImageRouter.post("/deleteFavoriteImage",favoriteImageController.deleteFavoriteImages);
favoriteImageRouter.post("/deleteMultipleFavoriteImages", favoriteImageController.deleteMultipleFavoriteImages);
favoriteImageRouter.post("/addMultipleFavoriteImages",favoriteImageController.addMultipleFavoriteImage);


module.exports = favoriteImageRouter;