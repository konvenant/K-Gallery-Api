// File: controllers/authController.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Notification = require('../models/Notification');
const bodyParser = require("body-parser");
const emailUtils = require('../utils/emailUtils');
const authService = require('../services/authService');
const SendImage = require('../models/SendImage');
const SendVideo = require('../models/SendVideo');

const signup = async (req, res) => {
  try {
    const password = req.body.password;
    const email = req.body.email;
    const date = new Date();

const saltRounds = 10;

const hashPassword = async (password) => {
  return await bcrypt.hash(password, saltRounds);
};

const hashedPassword = await hashPassword(password);

const generateVerificationToken = () => {
  const tokenLength = 4;
  let token = '';

  for (let i = 0; i < tokenLength; i++) {
    token += Math.floor(Math.random() * 10); // Generate a random digit (0-9)
  }

  return token;
};





const emailVerificationToken = generateVerificationToken();

const user = new User({
    email: email,
    password: hashedPassword,
    token: emailVerificationToken,
    dateAdded: date,
    imageUrl: "https://res.cloudinary.com/ddnlkgjnz/image/upload/v1704466924/nsgd7pvwx2o5m3tctyfu.jpg",
    isEmailVerified: false,
    phone: "",
    name: "",
    country: "",
    city: "",
    forgotPasswordToken: "",
    lastUpdated: date
 });


 const notice = new Notification({
  email: email,
  heading: "Account Registered",
  body: `Your Account with Email Address ${email} was successfully registered`,
  date: date,
  isRead:false,
  action: "open-details"
});
  

User.findOne({email:req.body.email}).then((foundUser)=>{
  if (foundUser) {
    res.status(401).json({message: "User already Exist"});
  } else {
    user.save().then(()=>{
       notice.save().then(()=>{
        res.status(201).json({ message: 'User registered successfully. Check your email for verification code' });
        const verificationToken = authService.generateEmailVerificationToken(user._id);
    emailUtils.sendVerificationEmail(user.email, emailVerificationToken);
    console.log(`token: ${emailVerificationToken}`);
       }).catch((noticeErr)=>{
        res.status(500).json({message: "Error Saving user"});
       })
    }).catch((addErr)=>{
      res.status(500).json({message: "Error Saving user"});
    })
  }
}).catch((err)=>{
  res.status(500).json({message: "Error"});
})
   
  } catch (error) {
    res.status(500).json({ message: 'An error occurred' });
    console.log(error);
  }
};


//make all video and image as delivered
const deliveredImageAndVideo = (email) => {
  SendVideo.updateMany({toEmail:email},{delivered:true}).then(()=>{
   SendImage.updateMany({toEmail:email},{delivered:true}).then(()=>{
    console.log("Success");
   }).catch((error)=> {
    console.log(error);
   });
  }).catch((e)=> {
   console.log(e);
  });
};

//login user
const login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email:email}).then((user)=>{
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      } else{
        // const isPasswordValid =  bcrypt.compare(password, user.password);
        // console.log("check:", isPasswordValid);
        // if (!isPasswordValid) {
        //    res.status(401).json({ error: 'Incorrect Password' });
        // } else{
        //   res.status(200).json({ user: user });
        // }
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            res.status(500).json({ message: 'An error occurred' });
            return;
          }
        
          if (isMatch) {
            deliveredImageAndVideo(email)
            res.status(200).json({ user: user });
            console.log('Passwords match');
          } else {
            res.status(401).json({ message: 'Incorrect Password' });
          }
        });
      }
    }).catch((err)=>{
      res.status(500).json({ error: 'An error occurred' });
    });

  

    
  

    // if (!user.isEmailVerified) {
    //   return res.status(401).json({ error: 'Email not verified' });
    // }

  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
};


//verify email
const verifyEmail = async (req, res) => {
 
  try {
       const token = req.body.token;
       const email = req.body.email;
       const date = new Date();

       const notice = new Notification({
        email: email,
        heading: "Email Verified",
        body: `Your Account with Email Address ${email} has been verified successfully`,
        date: date,
        isRead:false,
        action: "open-details"
      });

    User.findOne({email:email}).then((user)=>{
         if (user) {
           if (user.token == token) {
            User.updateMany({email: user.email},{isEmailVerified: true}).then(()=>{
              User.findOne({email:user.email}).then((userVerified)=>{
                emailUtils.sendWelcomeEmail(email)
                notice.save()
                res.status(200).json({ user:userVerified });
              }).catch((errrr)=>{
                res.status(500).json({ message: 'error verifying email $errrr' });
                console.log(errrr);
              })
            }).catch((er)=>{
              res.status(500).json({ message: 'error verifying emaill' });
              console.log(er);
            })
           } else{
            res.status(400).json({ message: 'Invalid verification token' });
           }
         } else{
          res.status(404).json({ message: 'User not found' });
         }
    }).catch((err)=>{
      res.status(500).json({ message: 'error verifying email' });
      console.log(err);
    });

  } catch (error) {
    res.status(500).json({ message: 'error verifying email' });
    console.log(error);
  }
};

//verify forgot password token
const verifyPassWord = async (req, res) => {
  try {
       const passwordToken = req.body.passwordToken;
       const email = req.body.email;
       const date = new Date();

       const notice = new Notification({
        email: email,
        heading: "Account Recovered",
        body: `Your Account with Email Address ${email} has been recovered successfully`,
        date: date,
        isRead:false,
        action: "open-details"
      });

    User.findOne({email:email}).then((user)=>{
         if (user) {
           if (user.forgotPasswordToken == passwordToken) {
              User.findOne({email:user.email}).then((userVerified)=>{
                notice.save()
                res.status(200).json({ user:userVerified });
              }).catch((errrr)=>{
                res.status(500).json({ message: 'error verifying email' });
                console.log(errrr);
              })
           } else{
            res.status(400).json({ message: 'Invalid verification token' });
           }
         } else{
          res.status(404).json({ message: 'User not found' });
         }
    }).catch((err)=>{
      res.status(500).json({ message: 'error verifying email' });
      console.log(err);
    });

  } catch (error) {
    res.status(500).json({ message: 'error verifying email' });
    console.log(error);
  }
};

// resendToken
const sendToken = async (req, res)  => {
  try{
    const email = req.body.email;


     User.findOne({email:email}).then((user)=>{
      emailUtils.sendVerificationEmail(user.email, user.token);
      res.status(200).json({message: "Token sent successfully"});
     }).catch((err)=>{
        res.status(500).json({message: "Error Saving user"});
     });
  } catch{
    res.status(500).json({message: "Error Sending Token"});
  }
};


const forgotPassword = async (req,res) => {
  try {

    const generateVerificationToken = () => {
      const tokenLength = 4;
      let token = '';
    
      for (let i = 0; i < tokenLength; i++) {
        token += Math.floor(Math.random() * 10); // Generate a random digit (0-9)
      }
    
      return token;
    };


    const emailToken = generateVerificationToken();
    
    const email = req.params.email;
    User.findOne({email:email}).then((user)=>{
      if (user) {
        User.updateMany({email:email},{forgotPasswordToken:emailToken}).then(()=>{
          emailUtils.sendPasswordEmail(user.email, emailToken);
          res.status(200).json({user:user});
        }).catch((err)=>{
          res.status(500).json({message: "Error Sending Tokens"});
        });
      } else {
        res.status(500).json({message: "User not found"});
      }
     }).catch((err)=>{
        res.status(500).json({message: "Error finding user"});
        console.log(err);
     });
  } catch {
    res.status(500).json({message: "Error Sending Tokens"});
  }
};


module.exports = { signup, login, verifyEmail, sendToken, forgotPassword, verifyPassWord ,deliveredImageAndVideo};
