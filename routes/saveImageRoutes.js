const express = require('express');
const saveImageController = require('../controllers/saveImageController');
const multer = require('multer');
const User = require('../models/User');
const Notification = require('../models/Notification');
const SaveImage = require('../models/SaveImage');
const saveImageRouter = express.Router();
const cloudinary = require('cloudinary').v2;


const upload = multer({ dest: 'uploads/' }); // Specify your upload directory


//save new image
saveImageRouter.post('/save-image/:email/:caption', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Image file not provided' });
      }
  
       const email = req.params.email;
       const date = new Date()
       const caption = req.params.caption;
      const imageUrl = await   saveImageController.sendImage(req.file);


      const savedImage = new SaveImage({
        email: email,
        date: date,
        caption:caption,
        imageUrl:imageUrl
      });
     
      

   

      const notice = new Notification({
        email: email,
        heading: "Image Saved",
        body: `Your image has been uploaded successfully`,
        date: date,
        isRead:false,
        action: "open-image",
        url:imageUrl
      });

      savedImage.save().then(()=>{
        User.findOne({email:email}).then((user)=>{
                notice.save()
              res.status(200).json({message: "Image Saved Successfully"});
        }).catch((errrrr)=>{
          res.status(500).json({ message: 'An error occurred' });
          console.log(errrrr);
        });
      }).catch((err)=>{
        res.status(500).json({ message: 'An error occurred' });
        console.log(err);
      });
    
    } catch (error) {
      res.status(500).json({ message: 'An error occurred' });
      console.log(error);
    }
  });

  saveImageRouter.post('/save-multipleImage/:email/:caption', upload.array('images'), async (req, res) => {
    try {
      // if (!req.file) {
      //   return res.status(400).json({ error: 'Image file not provided' });
      // }
      const email = req.params.email;
      const date = new Date()
      const caption = req.params.caption;
      const uploadedImages = [];
  
      // Loop through uploaded files
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path);
      
        // Push the uploaded image's public URL to the array
        uploadedImages.push(result.secure_url);
      }

      const notice = new Notification({
        email: email,
        heading: "Image Saved",
        body: `${uploadedImages.length} images has been uploaded successfully`,
        date: date,
        isRead:false,
        action: "open-image"
      });

      var objectsToUpload = []; 

      uploadedImages.forEach(element => {
        objectsToUpload.push({
          email: email,
  caption: caption,
  date: date,
  imageUrl: element
        });
      });
  

      SaveImage.insertMany(objectsToUpload)
      .then((result) => {
        notice.save()
        res.status(201).json({ message: `${objectsToUpload.length} images saved successfully` });
        console.log('Objects uploaded successfully:', result);
      })
      .catch((errr) => {
        console.error('Error uploading objects:', errr);
        res.status(500).json({ message: 'Internal Server Error' });
      });
        
      }catch(error){
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }

   
  });
  saveImageRouter.get("/get-savedImages/:email",saveImageController.getAllSavedImages );
  saveImageRouter.post("/delete-savedImage/:email/:id",saveImageController.deleteSavedImage);
  saveImageRouter.post("/delete-multipleSavedImages",saveImageController.deleteMultipleSavedImages);

  module.exports = saveImageRouter;