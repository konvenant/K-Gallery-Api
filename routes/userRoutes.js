const express = require('express');
const userController = require('../controllers/userController');
const multer = require('multer');
const User = require('../models/User');
const userRouter = express.Router();
const Notification = require('../models/Notification')

const upload = multer({ dest: 'uploads/' }); // Specify your upload directory


// userRouter.use(authenticationMiddleware.authenticate);
userRouter.get('/details/:email', userController.getUserDetails);
userRouter.put('/update', userController.updateUserDetails);
userRouter.put('/updatePassword', userController.updateUserPassword);
userRouter.get('/notification/:email', userController.getNotification);
userRouter.get('/notificationCount/:email', userController.getNotificationCount);
userRouter.put('/update-image/:email', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Image file not provided' });
      }
  
      const email = req.params.email;
      const imageUrl = await userController.uploadImage(req.file);
      const date = new Date();

      User.updateMany({email:email},{imageUrl:imageUrl,lastUpdated:date}).then(()=>{
        User.findOne({email:email}).then((user)=>{
            if (user) {
            const notice = new Notification({
              email: email,
              heading: "User profile updated",
              body: `profile image changed successfully`,
              date: date,
              isRead: false,
              action: "open-details"
            });
              notice.save()
              res.status(200).json({user:user});
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
userRouter.post('/update-deliveryState',userController.updateDeliveryState);



  
module.exports = userRouter;
