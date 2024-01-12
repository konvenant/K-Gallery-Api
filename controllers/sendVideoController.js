const cloudinary = require('cloudinary').v2;
const SendVideo = require('../models/SendVideo');
const Notification = require('../models/Notification');

const sendVideo = async (file) => {
    try {
      const result = await cloudinary.uploader.upload(file.path, { resource_type: 'video' });
      return result.secure_url; // URL of the uploaded image
    } catch (error) {
      // Handle error
      console.error('Error uploading video:', error);
      throw error;
    }
  };


  const getAllSentVideos = async(req,res) => {
    try{
     const email = req.params.email;
     SendVideo.find({fromEmail:email}).sort({_id:-1}).then((videos)=>{
      res.status(200).json({ videos: videos });
     }).catch((err) => {
      console.log(err);
      res.status(500).json({ message: 'An error occurred' });
     });
    } catch(error){
      console.log(error);
      res.status(500).json({ message: 'An error occurred' });
    };
};

const getAllRecievedVideos = async(req,res) => {
  try{
   const email = req.params.email;
   SendVideo.find({toEmail:email}).sort({_id:-1}).then((videos)=>{
    SendVideo.updateMany({toEmail:email},{delivered:true,read:true}).then(()=>{
      res.status(200).json({videos:videos });
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


const getAllChatVideos = async(req,res) => {
  try{
    const fromEmail = req.params.fromEmail;
    const toEmail = req.params.toEmail
     SendVideo.find({toEmail:toEmail,fromEmail:fromEmail}).sort({_id:-1}).then((videos)=>{
      SendVideo.updateMany({toEmail: toEmail},{delivered:true,read:true}).then(()=>{
        res.status(200).json({ videos:videos });
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

const deleteSentVideo = async(req,res) => {
  try{
  const fromEmail = req.body.fromEmail;
  const toEmail = req.body.toEmail;
  const id = req.body.id;

    const date = new Date();
    const notice = new Notification({
      email: fromEmail,
      heading: "Video Deleted",
      body: `You deleted a video you sent to ${toEmail} successfully`,
      date: date,
      isRead:false,
      action: "open-chat"
    });
    SendVideo.updateOne({_id:id},{isSenderDeleted:true,dateSenderDelete:date}).then(()=> {
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
 }


 const deleteRecievedVideo = async(req,res) => {
  try{
  const fromEmail = req.body.fromEmail;
  const toEmail = req.body.toEmail;
  const id = req.body.id;

    const date = new Date();
    const notice = new Notification({
      email: toEmail,
      heading: "Video Deleted",
      body: `You deleted a video you recieved to ${fromEmail} successfully`,
      date: date,
      isRead:false,
      action: "open-chat"
    });
    SendVideo.updateOne({_id:id},{isRecieverDeleted:true,dateRecieverDelete:date }).then(()=> {
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
 }


 const deleteMultipleVideo = async(req,res) => {
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
        SendVideo.updateMany({_id:id},{isSenderDeleted:true,dateSenderDelete:date}).then(()=>{
            console.log("deleted sent video");
       
        });
      } else {
        console.log(toEmail);
        SendVideo.updateMany({_id:id},{isRecieverDeleted:true,dateRecieverDelete:date}).then(()=>{
          console.log("deleted recieved video");
          
      });
      }
      count++;
     console.log(count);
     console.log(arrayOfObjects.length);
    });
    
    if (count == arrayOfObjects.length) {
      const notice = new Notification({
        email: email,
        heading: "Videos Deleted",
        body: `You deleted ${count} Videos successfully`,
        date: date,
        isRead:false,
        action: "open-chat"
      })

      notice.save()
      res.status(200).json({message:"Deleted All Videos Successfully"});
    }
    
    

    
  } catch(error){
    console.log(error);
    res.status(500).json({ message: 'An error occurred' });
  }
 }


 
 const sendMultipleVideo = async(req,res)=> {
  try{
    const { videos, fromEmail, toEmail,caption } = req.body;
    const date = new Date();
    var objectsToUpload = [];  
    const delivered = false;
    const read = false;
    const deleted = false;

    videos.forEach(element => {
      objectsToUpload.push({
        fromEmail: fromEmail,
        toEmail: toEmail,
        date: date,
        videoUrl: element,
        delivered: delivered,
        read: read,
        isSenderDeleted: deleted,
        isRecieverDeleted: deleted,
        caption:caption
      });
    });
 

 const notice = new Notification({
    email: fromEmail,
    heading: "Videos Sent",
    body: `You sent ${videos.length} videos to ${toEmail} successfully`,
    date: date,
    isRead:false,
    action: "open-chat"
  });

  

// Insert multiple objects into the database
SendVideo.insertMany(objectsToUpload)
  .then((result) => {
    notice.save()
    res.status(201).json({ message: `videos sent to ${toEmail} sucessfully` });
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


  module.exports = {sendVideo,getAllSentVideos,getAllRecievedVideos,getAllChatVideos,
    deleteSentVideo,deleteRecievedVideo,deleteMultipleVideo,sendMultipleVideo}