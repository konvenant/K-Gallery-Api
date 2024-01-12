const cloudinary = require('cloudinary').v2;
const SaveVideo = require('../models/SaveVideo');
const Notification = require('../models/Notification');

const saveVideo = async (file) => {
    try {
      const result = await cloudinary.uploader.upload(file.path, { resource_type: 'video' });
      return result.secure_url; // URL of the uploaded image
    } catch (error) {
      // Handle error
      console.error('Error uploading image:', error);
      throw error;
    }
  };


  const getAllSavedVideos = async(req,res) => {
    try{
      const email = req.params.email;
        SaveVideo.find({email:email}).sort({_id:-1}).then((videos)=>{
          res.status(200).json({ videos: videos });
        }).catch((err)=> {
         console.log(err);
         res.status(500).json({ message: 'An error occurred' });
        });
    } catch(error){
     console.log(error);
     res.status(500).json({ message: 'An error occurred' });
    }
  };

  const deleteSavedVideo = async(req,res) => {
    try{
      const id = req.params.id;
    const email = req.params.email;
      const date = new Date();
      const notice = new Notification({
        email: email,
        heading: "Video Deleted",
        body: `You deleted a video successfully`,
        date: date,
        isRead:false,
        action: "open-Video"
      });
      SaveVideo.deleteOne({_id:id}).then(()=> {
         notice.save();
         res.status(200).json({ message: 'Video deleted successfully' });
      }).catch((err)=> {
        res.status(500).json({ message: 'An error occurred' });
        console.log(err);
      });
    } catch(error){
      console.log(error);
      res.status(500).json({ message: 'An error occurred' });
    }
  };

  const deleteMultipleVideos = async(req,res) => {
    try{
     const { ids, email } = req.body;
     const date = new Date();
     const condition = {_id: { $in: ids}};
     const notice = new Notification({
       email: email,
       heading: "Videos Deleted",
       body: `${ids.length} saved videos deleted Sucessfully`,
       date: date,
       isRead:false,
       action: "open-video"
     });
     SaveVideo.deleteMany(condition).then((vid)=>{
         notice.save()
         res.status(200).json({message:`${ids.length} saved videos deleted Sucessfully`})
         console.log(vid);
     }).catch((e)=>{
       console.log(e);
       res.status(500).json({ message: 'An error occurred' });
     });
 
    } catch(error){
     console.log(error);
     res.status(500).json({ message: 'An error occurred' });
    }
   }
 
  module.exports = {saveVideo,getAllSavedVideos,deleteSavedVideo,deleteMultipleVideos}