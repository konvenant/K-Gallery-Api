const cloudinary = require('cloudinary').v2;
const SaveImage = require('../models/SaveImage');
const Notification = require('../models/Notification');
const multer = require('multer');
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


 
 

  const getAllSavedImages = async(req,res) => {
    try{
      const email = req.params.email;
        SaveImage.find({email:email}).sort({_id:-1}).then((images)=>{
          res.status(200).json({ images: images });
        }).catch((err)=> {
         console.log(err);
         res.status(500).json({ message: 'An error occurred' });
        });
    } catch(error){
     console.log(error);
     res.status(500).json({ message: 'An error occurred' });
    }
  };

  const deleteSavedImage = async(req,res) => {
    try{
      const id = req.params.id;
    const email = req.params.email;
      const date = new Date();
      const notice = new Notification({
        email: email,
        heading: "Image Deleted",
        body: `You deleted an image successfully`,
        date: date,
        isRead:false,
        action: "open-image"
      });
      SaveImage.deleteOne({_id:id}).then(()=> {
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
  };

  const deleteMultipleSavedImages = async(req,res) => {
   try{
    const { ids, email } = req.body;
    const date = new Date();
    const condition = {_id: { $in: ids}};
    const notice = new Notification({
      email: email,
      heading: "Images Deleted",
      body: `${ids.length} saved images deleted Sucessfully`,
      date: date,
      isRead:false,
      action: "open-image"
    });
    SaveImage.deleteMany(condition).then(()=>{
        notice.save()
        res.status(200).json({message:`${ids.length} saved images deleted Sucessfully`})
    }).catch((e)=>{
      console.log(e);
      res.status(500).json({ message: 'An error occurred' });
    });

   } catch(error){
    console.log(error);
    res.status(500).json({ message: 'An error occurred' });
   }
  }

  module.exports = {sendImage, getAllSavedImages,deleteSavedImage,deleteMultipleSavedImages}