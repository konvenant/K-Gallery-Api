// File: controllers/userController.js

const User = require('../models/User');
const bcrypt = require('bcrypt');
const Notification = require('../models/Notification');
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const authController = require('../controllers/authController')

cloudinary.config({
  cloud_name: "ddnlkgjnz",
  api_key: "376612215949779",
  api_secret: "iQx5JdGpw3LZMg5xacvPvcwvTNI"
});
const storage = multer.diskStorage({});

const upload = multer({ storage });


const getUserDetails = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({email:email}).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({user: user});
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
    console.log(error);
  }
};

const updateUserDetails = async (req, res) => {
  try {
    const email = req.body.email;
    const name = req.body.name;
    const phone = req.body.phone;
    const city = req.body.city;
    const country = req.body.country;
    const date = new Date();

    User.updateMany({email:email},{name:name,phone:phone,city:city,country:country,lastUpdated:date}).then(()=>{
      User.findOne({email:email}).then((user)=>{
            const date = new Date();
            const notice = new Notification({
              email: email,
              heading: "User Detials Updated",
              body: `User details updated successfully`,
              date: date,
              isRead: false,
              action: "open-details"
            });
              notice.save()
            res.status(200).json({user:user});
          
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
};


const updateUserPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const saltRounds = 10;

const hashPassword = async (password) => {
  return await bcrypt.hash(password, saltRounds);
};
const date = new Date();

const hashedPassword = await hashPassword(password);
    User.updateMany({email:email},{password:hashedPassword,lastUpdated:date}).then(()=>{
      User.findOne({email:email}).then((user)=>{
        const date = new Date();
            const notice = new Notification({
              email: email,
              heading: "Password Updated",
              body: `Password changed successfully`,
              date: date,
              isRead: false,
              action: "open-details"
            });
              notice.save()
        res.status(200).json({user:user});
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
};



const uploadImage = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path);
    return result.secure_url; // URL of the uploaded image
  } catch (error) {
    // Handle error
    console.error('Error uploading image:', error);
    throw error;
  }
};

const getNotification = async (req,res) =>{
  try{
    const email = req.params.email;
     Notification.find({email:email}).sort({_id:-1}).then((notices)=>{
       Notification.updateMany({email:email}, {isRead:true}).then(()=>{
        res.status(200).json({ notices: notices });
       })
     }).catch((err)=>{
      res.status(500).json({ message: 'An error occurred' });
     });
  } catch{
    res.status(500).json({ message: 'An error occurred' });
  }
}

const getNotificationCount = async (req,res) => {
  try{
    const email = req.params.email;
    Notification.find({email:email,isRead:false}).then((noticesCount)=> {
      res.status(200).json({ notice: noticesCount.length });
    }).catch((err)=>{
      res.status(500).json({ message: 'An error occurred' });
      console.log(err)
    });
  } catch{
    res.status(500).json({ message: 'An error occurred' });
  }
}

const updateDeliveryState = async(req,res) => {
  try{
    const email = req.body.email;
    authController.deliveredImageAndVideo(email);
    res.status(200).json({ message: "done" });
  } catch(e){
res.status(500).json({ message: 'An error occurred' });
  }
}

module.exports = { getUserDetails, updateUserDetails,updateUserPassword,uploadImage,getNotification,getNotificationCount,updateDeliveryState };











