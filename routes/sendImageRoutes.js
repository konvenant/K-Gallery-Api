const express = require('express');
const sendImageController = require('../controllers/sendImageController');
const multer = require('multer');
const User = require('../models/User');
const Notification = require('../models/Notification');
const SendImage = require('../models/SendImage');
const sendImageRouter = express.Router();




const upload = multer({ dest: 'uploads/' }); // Specify your upload directory


sendImageRouter.post('/send-image/:fromEmail/:toEmail/:caption', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Image file not provided' });
      }
  
       const fromEmail = req.params.fromEmail;
       const toEmail = req.params.toEmail;
       const delivered = false;
       const read = false;
       const date = new Date()
       const deleted = false;
       const caption = req.params.caption;
      const imageUrl = await   sendImageController.sendImage(req.file);


      const sendImage = new SendImage({
        fromEmail: fromEmail,
        toEmail: toEmail,
        date: date,
        caption:caption,
        imageUrl:imageUrl,
        delivered: delivered,
        read: read,
        isSenderDeleted: deleted,
        isRecieverDeleted: deleted
      });
     
      

   

      const notice = new Notification({
        email: fromEmail,
        heading: "Image Sent Successfully",
        body: `image was sent to ${toEmail}`,
        date: date,
        isRead:false,
        action: "open-chat",
        url:imageUrl
      });

      sendImage.save().then(()=>{
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

  sendImageRouter.get("/getAll-sentImages/:email",sendImageController.getAllSentImages);
  sendImageRouter.get("/getAll-RecievedImages/:email",sendImageController.getAllRecievedImages);
  sendImageRouter.get("/getAllChatImages/:fromEmail/:toEmail",sendImageController.getAllChatImages);
  sendImageRouter.post("/delete-sentImage",sendImageController.deleteSentImage);
  sendImageRouter.post("/delete-recievedImage",sendImageController.deleteRecievedImage);
  sendImageRouter.post("/delete-multipleImage",sendImageController.deleteMultipleImage);
  sendImageRouter.post("/send-multipleImages",sendImageController.sendMultipleImages);

  module.exports = sendImageRouter;