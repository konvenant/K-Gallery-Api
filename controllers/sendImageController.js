const cloudinary = require('cloudinary').v2;
const SendImage = require('../models/SendImage');
const Notification = require('../models/Notification');


const sendImage = async (file) => {
    try {
      const result = await cloudinary.uploader.upload(file.path);
      return result.secure_url; // URL of the uploaded image
    } catch (error) {
      // Handle error
      console.error('Error uploading image:', error);
      throw error;
    }
  };


  const getAllSentImages = async(req,res) => {
      try{
       const email = req.params.email;
       SendImage.find({fromEmail:email}).sort({_id:-1}).then((images)=>{
        res.status(200).json({ images: images });
       }).catch((err) => {
        console.log(err);
        res.status(500).json({ message: 'An error occurred' });
       });
      } catch(error){
        console.log(error);
        res.status(500).json({ message: 'An error occurred' });
      };
  };


  const getAllRecievedImages = async(req,res) => {
    try{
     const email = req.params.email;
     SendImage.find({toEmail:email}).sort({_id:-1}).then((images)=>{
      SendImage.updateMany({toEmail:email},{delivered:true,read:true}).then(()=>{
        res.status(200).json({ images: images });
      }).catch((erro)=> {
        console.log(erro);
        res.status(500).json({ message: 'An error occurred' });
      });
     }).catch((err) => {
      console.log(err);
      res.status(500).json({ message: 'An error occurred' });
     });
    } catch(error){
      console.log(error);
      res.status(500).json({ message: 'An error occurred' });
    };
};

const getAllChatImages = async(req,res) => {
  try{
    const fromEmail = req.params.fromEmail;
    const toEmail = req.params.toEmail
     SendImage.find({toEmail:toEmail,fromEmail:fromEmail}).sort({_id:-1}).then((images)=>{
      SendImage.updateMany({toEmail: toEmail},{delivered:true,read:true}).then(()=>{
        res.status(200).json({ images: images });
      }).catch((erro)=> {
        console.log(erro);
        res.status(500).json({ message: 'An error occurred' });
      });
     }).catch((err) => {
      console.log(err);
      res.status(500).json({ message: 'An error occurred' });
     });
  }catch(error){
    res.status(500).json({ message: 'An error occurred' });
  };
}

 
   const deleteSentImage = async(req,res) => {
    try{
    const fromEmail = req.body.fromEmail;
    const toEmail = req.body.toEmail;
    const id = req.body.id;

      const date = new Date();
      const notice = new Notification({
        email: fromEmail,
        heading: "Image Deleted",
        body: `You deleted an image you sent to ${toEmail} successfully`,
        date: date,
        isRead:false,
        action: "open-chat"
      });
      SendImage.updateOne({_id:id},{isSenderDeleted:true,dateSenderDelete:date}).then(()=> {
         notice.save();
         res.status(200).json({ message: 'Image deleted successfully' });
      }).catch((err)=> {
        res.status(500).json({ message: 'An error occurred' });
        console.log(err);
      });
    } catch(error){
      console.log(error);
      res.status(500).json({ message: 'An error occurred' });
    }
   }


   const deleteRecievedImage = async(req,res) => {
    try{
    const fromEmail = req.body.fromEmail;
    const toEmail = req.body.toEmail;
    const id = req.body.id;

      const date = new Date();
      const notice = new Notification({
        email: toEmail,
        heading: "Image Deleted",
        body: `You deleted an image you recieved to ${fromEmail} successfully`,
        date: date,
        isRead:false,
        action: "open-chat"
      });
      SendImage.updateOne({_id:id},{isRecieverDeleted:true,dateRecieverDelete:date }).then(()=> {
         notice.save();
         res.status(200).json({ message: 'Image deleted successfully' });
      }).catch((err)=> {
        res.status(500).json({ message: 'An error occurred' });
        console.log(err);
      });
    } catch(error){
      console.log(error);
      res.status(500).json({ message: 'An error occurred' });
    }
   }

   const deleteMultipleImage = async(req,res) => {
    try{
      const { email, arrayOfObjects } = req.body;
      const date = new Date();
      let count = 0;

      arrayOfObjects.forEach(item => {
        const fromEmail = item.fromEmail;
        const toEmail = item.toEmail;
        const id = item._id;
        if (email == fromEmail) {
          console.log(fromEmail);
          SendImage.updateMany({_id:id},{isSenderDeleted:true,dateSenderDelete:date}).then(()=>{
              console.log("deleted sent image");
         
          });
        } else {
          console.log(toEmail);
          SendImage.updateMany({_id:id},{isRecieverDeleted:true,dateRecieverDelete:date}).then(()=>{
            console.log("deleted recieved image");
            
        });
        }
        count++;
       console.log(count);
       console.log(arrayOfObjects.length);
      });
      
      if (count == arrayOfObjects.length) {
        const notice = new Notification({
          email: email,
          heading: "Images Deleted",
          body: `You deleted ${count} images successfully`,
          date: date,
          isRead:false,
          action: "open-chat"
        })

        notice.save()
        res.status(200).json({message:"done deleting all the images"});
      }
      
      
  
      
    } catch(error){
      console.log(error);
      res.status(500).json({ message: 'An error occurred' });
    }
   }

   const sendMultipleImages = async(req,res)=> {
    try{
      const { images, fromEmail, toEmail,caption } = req.body;
      const date = new Date();
      var objectsToUpload = [];  
      const delivered = false;
      const read = false;
      const deleted = false;
  
      images.forEach(element => {
        objectsToUpload.push({
          fromEmail: fromEmail,
          toEmail: toEmail,
          date: date,
          imageUrl: element,
          delivered: delivered,
          read: read,
          isSenderDeleted: deleted,
          isRecieverDeleted: deleted,
          caption:caption
        });
      });
   
  
   const notice = new Notification({
      email: fromEmail,
      heading: "Images Sent",
      body: `You sent ${images.length} images to ${toEmail} successfully`,
      date: date,
      isRead:false,
      action: "open-chat"
    });
  
    
  
  // Insert multiple objects into the database
  SendImage.insertMany(objectsToUpload)
    .then((result) => {
      notice.save()
      res.status(201).json({ message: `images sent to ${toEmail} sucessfully` });
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
  }



  module.exports = {sendImage,getAllSentImages,getAllRecievedImages,getAllChatImages,deleteSentImage,
    deleteRecievedImage,deleteMultipleImage,sendMultipleImages}