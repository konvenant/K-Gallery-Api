const express = require('express');
const sendVideoController = require('../controllers/sendVideoController');
const multer = require('multer');
const User = require('../models/User');
const Notification = require('../models/Notification');
const SendVideo = require('../models/SendVideo');
const sendVideoRouter = express.Router();

const upload = multer({ dest: 'uploads/' }); // Specify your upload directory


   sendVideoRouter.post('/send-video/:fromEmail/:toEmail/:caption', upload.single('video'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No video file provided' });
          }
  
          const fromEmail = req.params.fromEmail;
          const toEmail = req.params.toEmail;
          const delivered = false;
          const read = false;
          const date = new Date()
          const deleted = false;
          const caption = req.params.caption;
      const videoUrl = await   sendVideoController.sendVideo(req.file);



      const sendVideo = new SendVideo({
        fromEmail: fromEmail,
        toEmail: toEmail,
        date: date,
        caption:caption,
        delivered: delivered,
        read: read,
        videoUrl:videoUrl,
        isSenderDeleted: deleted,
        isRecieverDeleted: deleted
      });
     
      

      const notice = new Notification({
        email: fromEmail,
        heading: "Video sent successfully",
        body: `video was sent to ${toEmail}`,
        date: date,
        isRead:false,
        action: "open-image",
        url:videoUrl
      });

      sendVideo.save().then(()=>{
        User.findOne({email:fromEmail}).then((user)=>{
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
  sendVideoRouter.get("/getAll-sentVideos/:email", sendVideoController.getAllSentVideos);
  sendVideoRouter.get("/getAll-recievedVideos/:email", sendVideoController.getAllRecievedVideos);
  sendVideoRouter.get("/getAllChatVideos/:fromEmail/:toEmail", sendVideoController.getAllChatVideos);
  sendVideoRouter.post("/delete-sentVideo", sendVideoController.deleteSentVideo);
  sendVideoRouter.post("/delete-recievedVideo",sendVideoController.deleteRecievedVideo);
  sendVideoRouter.post("/delete-multipleVideos", sendVideoController.deleteMultipleVideo)
  sendVideoRouter.post("/send-multipleVideos",sendVideoController.sendMultipleVideo);
  
  module.exports = sendVideoRouter;