const express = require('express');


const favoriteVideoController = require('../controllers/favoriteVideoController');
favoriteVideoRouter = express.Router();

favoriteVideoRouter.post("/addFavoriteVideo",favoriteVideoController.addVideoToFavorite);
favoriteVideoRouter.get("/getAllFavoriteVideos/:email",favoriteVideoController.getAllFavoriteVideos);
favoriteVideoRouter.post("/deleteFavoriteVideo",favoriteVideoController.deleteFavoriteVideos);
favoriteVideoRouter.post("/deleteMultipleFavoriteVideos", favoriteVideoController.deleteMultipleFavoriteVideos);
favoriteVideoRouter.post("/addMultipleFavoriteVideo",favoriteVideoController.addMultipleFavoriteVideo);




module.exports = favoriteVideoRouter;