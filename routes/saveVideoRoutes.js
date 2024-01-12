const express = require('express');
const saveVideoController = require('../controllers/saveVideoController');
const multer = require('multer');
const User = require('../models/User');
const Notification = require('../models/Notification');
const SaveVideo = require('../models/SaveVideo');
const saveVideoRouter = express.Router();
const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//       folder: 'uploads/', // Change this to your desired folder name
//       allowed_formats: ['mp4', 'avi'], // Allowed video formats
//       resource_type: 'video'
//     }
//   });


  // const upload = multer({ storage: storage });

const upload = multer({ dest: 'uploads/' }); // Specify your upload directory


saveVideoRouter.post('/save-video/:email/:caption', upload.single('video'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No video file provided' });
          }
  
       const email = req.params.email;
       const date = new Date()
       const caption = req.params.caption;
      const videoUrl = await   saveVideoController.saveVideo(req.file);



      const savedVideo = new SaveVideo({
        email: email,
        date: date,
        caption:caption,
        videoUrl:videoUrl
      });
     
      

      const notice = new Notification({
        email: email,
        heading: "Video Saved",
        body: `Your video has been uploaded successfully`,
        date: date,
        isRead:false,
        action: "open-video",
        url:videoUrl
      });

      savedVideo.save().then(()=>{
        User.findOne({email:email}).then((user)=>{
            if (user) {
                notice.save()
              res.status(200).json({user:user});
            } else{
                res.status(401).json({ message: 'User not found' });
            }
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

  saveVideoRouter.post('/save-multipleVideo/:email/:caption', upload.array('videos'), async (req, res) => {
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
        const result = await cloudinary.uploader.upload(file.path, { resource_type: 'video' });
      
        // Push the uploaded image's public URL to the array
        uploadedImages.push(result.secure_url);
      }

      const notice = new Notification({
        email: email,
        heading: "Videos Saved",
        body: `${uploadedImages.length} videos has been uploaded successfully`,
        date: date,
        isRead:false,
        action: "open-video"
      });

      var objectsToUpload = []; 

      uploadedImages.forEach(element => {
        objectsToUpload.push({
          email: email,
  caption: caption,
  date: date,
  videoUrl: element
        });
      });
  

      SaveVideo.insertMany(objectsToUpload)
      .then((result) => {
        notice.save()
        res.status(201).json({ message: `${objectsToUpload.length} videos saved successfully` });
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
  saveVideoRouter.get("/get-savedVideos/:email",saveVideoController.getAllSavedVideos );
  saveVideoRouter.post("/delete-savedVideo/:email/:id",saveVideoController.deleteSavedVideo);
  saveVideoRouter.post("/delete-multipleSavedVideos",saveVideoController.deleteMultipleVideos);
  
  module.exports = saveVideoRouter;