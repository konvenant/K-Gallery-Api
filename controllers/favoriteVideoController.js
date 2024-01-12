const Notification = require('../models/Notification');
const FavoriteVideo= require('../models/FavoriteVideo');

//add image to favorite
const addVideoToFavorite = async (req,res) => {
    try{

        const email = req.body.email;
        const date = new Date();
        const videoUrl = req.body.videoUrl;

     const favoriteVideo = new FavoriteVideo({
        email: email,
        date: date,
        videoUrl: videoUrl
     });

     const notice = new Notification({
        email: email,
        heading: "Video Added",
        body: `You added an video to favorite successfully`,
        date: date,
        isRead:false,
        action: "open-favorite"
      });

     FavoriteVideo.findOne({videoUrl:videoUrl,email:email}).then((fav)=>{
        if(fav){
            res.status(401).json({ message: 'Favorite video already exist' });
        } else{ 
            favoriteVideo.save().then(()=>{
                notice.save()
                res.status(201).json({ message: 'video added to favorite successfully' });
              }).catch((err)=> {
                res.status(501).json({ message: 'Unable to add video to favorite' });
                console.log(err);
              });
        }
     }).catch((erra)=>{
        res.status(501).json({ message: 'Unable to add Image to favorite' });
        console.log(erra);
     })

    } catch(error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred' });
    }
}

//get all favorite videos 
const getAllFavoriteVideos = async(req,res) => {
    try{
      const email = req.params.email;
      FavoriteVideo.find({email:email}).sort({_id:-1}).then((videos)=>{
        res.status(200).json({ videos: videos });
    }).catch((err)=> {
     console.log(err);
     res.status(500).json({ message: 'An error occurred' });
    });
    }catch(error){
console.log(error);
     res.status(500).json({ message: 'Internal Server Error' });
    }
}


//deleteFavoritevideos
const deleteFavoriteVideos = async(req,res) => {
    try{
        const id = req.body.id;
      const email = req.body.email;
        const date = new Date();
        const notice = new Notification({
          email: email,
          heading: "Favorite Video Deleted",
          body: `You deleted a favorite video successfully`,
          date: date,
          isRead:false,
          action: "open-favorite"
        });
        FavoriteVideo.deleteOne({_id:id}).then(()=> {
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

//deleteMultipleFavoritevideos
const deleteMultipleFavoriteVideos = async(req,res) => {
 try{
    const { email, arrayOfId } = req.body;
    const deleteCondition = { _id: { $in: arrayOfId } };

    const date = new Date();
    const notice = new Notification({
      email: email,
      heading: "Favorite videos Deleted",
      body: `You deleted a ${arrayOfId.length} favorite videos successfully`,
      date: date,
      isRead:false,
      action: "open-favorite"
    });


    FavoriteVideo.deleteMany(deleteCondition).then(()=>{
        notice.save();
        res.status(200).json({ message: `${arrayOfId.length} favourite videos deleted successfully` });
    }).catch((err)=>{
        res.status(500).json({ message: 'An error occurred' });
        console.log(err);
    });
 }catch(error){
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
 }
}

const addMultipleFavoriteVideo = async(req,res)=> {
  try{
    const { favoriteVideos, email } = req.body;
    const date = new Date();
    var objectsToUpload = [];  

    favoriteVideos.forEach(element => {
      objectsToUpload.push({
        email: email,
    date: date,
    videoUrl: element
      });
    });
 

 const notice = new Notification({
    email: email,
    heading: "Videos Added",
    body: `You added ${favoriteVideos.length} videos to favorite successfully`,
    date: date,
    isRead:false,
    action: "open-favorite"
  });

  const findCondition = { videoUrl: { $in: favoriteVideos } };

// Insert multiple objects into the database
 FavoriteVideo.find({videoUrl: { $in: favoriteVideos }}).then((fav)=>{
if(fav.length != 0){
  res.status(401).json({ message: `${fav.length} video already exist in favorite` });
  console.log(fav);
  console.log(objectsToUpload);
} else{
  FavoriteVideo.insertMany(objectsToUpload)
  .then((result) => {
    notice.save()
    res.status(201).json({ message: 'video added to favorite successfully' });
    console.log('Objects uploaded successfully:', result);
  })
  .catch((errr) => {
    console.error('Error uploading objects:', errr);
    res.status(500).json({ message: 'Internal Server Error' });
  });
}
 }).catch((errrr) => {
  console.error('Error uploading objects:', errrr);
  res.status(500).json({ message: 'Internal Server Error' });
});
    
  }catch(error){
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}






module.exports = { addVideoToFavorite, getAllFavoriteVideos,deleteFavoriteVideos,deleteMultipleFavoriteVideos,addMultipleFavoriteVideo}