const Notification = require('../models/Notification');
const FavoriteImage = require('../models/FavoriteImage');

//add image to favorite
const addImageToFavorite = async (req,res) => {
    try{

        const email = req.body.email;
        const date = new Date();
        const imageUrl = req.body.imageUrl;
     const favoriteImage = new FavoriteImage ({
        email: email,
        date: date,
        imageUrl: imageUrl
     });

     const notice = new Notification({
        email: email,
        heading: "Image Added",
        body: `You added an image to favorite successfully`,
        date: date,
        isRead:false,
        action: "open-favorite"
      });

     FavoriteImage.findOne({imageUrl:imageUrl,email:email}).then((fav)=>{
        if(fav){
            res.status(401).json({ message: 'Favorite image already exist' });
        } else{
            favoriteImage.save().then(()=>{
                notice.save()
                res.status(201).json({ message: 'image added to favorite successfully' });
              }).catch((err)=> {
                res.status(501).json({ message: 'Unable to add Image to favorite' });
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

//get all favorite images 
const getAllFavoriteImages = async(req,res) => {
    try{
      const email = req.params.email;
      FavoriteImage.find({email:email}).sort({_id:-1}).then((images)=>{
        res.status(200).json({ images: images });
    }).catch((err)=> {
     console.log(err);
     res.status(500).json({ message: 'An error occurred' });
    });
    }catch(error){
console.log(error);
     res.status(500).json({ message: 'Internal Server Error' });
    }
}


//deleteFavoriteImages
const deleteFavoriteImages = async(req,res) => {
    try{
        const id = req.body.id;
      const email = req.body.email;
        const date = new Date();
        const notice = new Notification({
          email: email,
          heading: "Favorite Image Deleted",
          body: `You deleted a favorite image successfully`,
          date: date,
          isRead:false,
          action: "open-favorite"
        });
        FavoriteImage.deleteOne({_id:id}).then(()=> {
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

//deleteMultipleFavoriteImages
const deleteMultipleFavoriteImages = async(req,res) => {
 try{
    const { email, arrayOfId } = req.body;
    const deleteCondition = { _id: { $in: arrayOfId } };

    const date = new Date();
    const notice = new Notification({
      email: email,
      heading: "Favorite Images Deleted",
      body: `You deleted a ${arrayOfId.length} favorite image successfully`,
      date: date,
      isRead:false,
      action: "open-favorite"
    });


    FavoriteImage.deleteMany(deleteCondition).then(()=>{
        notice.save();
        res.status(200).json({ message: `${arrayOfId.length} favourite Images deleted successfully` });
    }).catch((err)=>{
        res.status(500).json({ message: 'An error occurred' });
        console.log(err);
    });
 }catch(error){
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
 }
}



const addMultipleFavoriteImage = async(req,res)=> {
    try{
      const { favoriteImages, email } = req.body;
      const date = new Date();
      var objectsToUpload = [];  
  
      favoriteImages.forEach(element => {
        objectsToUpload.push({
          email: email,
      date: date,
      imageUrl: element
        });
      });
   
  
   const notice = new Notification({
      email: email,
      heading: "Images Added",
      body: `You added ${favoriteImages.length} images to favorite successfully`,
      date: date,
      isRead:false,
      action: "open-favorite"
    });
  
   
  
  // Insert multiple objects into the database
   FavoriteImage.find({imageUrl: { $in: favoriteImages }}).then((fav)=>{
  if(fav.length != 0){
    res.status(401).json({ message: `${fav.length} images already exist in favorite` });
    console.log(fav);
    console.log(objectsToUpload);
  } else{
    FavoriteImage.insertMany(objectsToUpload)
    .then((result) => {
      notice.save()
      res.status(201).json({ message: 'images added to favorite successfully' });
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



module.exports = { addImageToFavorite, getAllFavoriteImages,deleteFavoriteImages,deleteMultipleFavoriteImages,addMultipleFavoriteImage}