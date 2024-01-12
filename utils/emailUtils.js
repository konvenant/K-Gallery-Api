const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user:'sidesacademicplug001@gmail.com',
    pass:'brfnqxalmfmemfxu'
  },
});

const sendVerificationEmail = (email, verificationToken) => {
  const verificationLink = `${process.env.BASE_URL}/auth/verify/${verificationToken}`;

  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: 'Email Verification',
    html: `
    <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; text-align: center; padding: 20px;">

    <div style="background-color: #ffffff; border-radius: 10px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); padding: 20px; max-width: 400px; margin: 0 auto;">
      <h2 style="color: #333333; margin-bottom: 20px;">Email Verification</h2>
      
      <p style="color: #666666;">Your verification token is:</p>
      <p style="font-size: 24px; color: #007bff; font-weight: bold;">${verificationToken}</p>
      
      <p style="color: #666666; margin-top: 20px;">Copy this token and use it to verify your email.</p>
      
      <p style="color: #666666; margin-top: 20px;">If you did not request this verification, you can ignore this email.</p>
    </div>
  
  </body>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};


const sendWelcomeEmail = (email) => {

  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: 'WelCome To K-Gallery',
    html: `
    <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; text-align: center; padding: 20px;">

    <div style="background-color: #ffffff; border-radius: 10px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); padding: 20px; max-width: 400px; margin: 0 auto;">
      <h2 style="color: #333333; margin-bottom: 20px;">Email Verification</h2>
      
      <p style="color: #666666;">Welcome To K-Gallery</p>
      <p style="font-size: 24px; color: #007bff; font-weight: bold;">Welcome to the best gallery app in the world </p>
      
      <p style="color: #666666; margin-top: 20px;">Do well to complete your registration and Enjoy our free services.</p>
      
      <p style="color: #666666; margin-top: 20px;">If you have an issues, reply this mail for help.</p>
    </div>
  
  </body>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

const sendPasswordEmail = (email, password) => {

  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: 'Forgot Password',
    html: `
    <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; text-align: center; padding: 20px;">

    <div style="background-color: #ffffff; border-radius: 10px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); padding: 20px; max-width: 400px; margin: 0 auto;">
      <h2 style="color: #333333; margin-bottom: 20px;">Forgot Password</h2>
      
      <p style="color: #666666;">Your Token is</p>
      <p style="font-size: 24px; color: red; font-weight: bold;">${password}</p>
      <p style="color: #666666; margin-top: 20px;">You are Adviced to change password after this action.</p>
    
      <p style="color: #666666; margin-top: 20px;">If you did not request this verification, you can ignore this email.</p>
    </div>
  
  </body>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};
module.exports = { sendVerificationEmail, sendPasswordEmail, sendWelcomeEmail };
