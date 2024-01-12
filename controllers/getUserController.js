const User = require('../models/User');
const SearchedUser = require('../models/SearchedUser');
const Notification = require('../models/Notification');


const getUserToSendTo = async (req,res) => {
    try{
        const partialEmail = req.body.email;

        if (!partialEmail) {
          return res.status(400).json({ error: 'email is required ' });
        }
      
        const regex = new RegExp(`^${partialEmail}`);
      
        User.find({email: regex}).then((users)=>{
            if(users == null || users.length == 0){
                res.status(401).json({message:"email not found"});
               }else{
                res.status(201).json({users:users});
               }
            
        }).catch((err)=> {
            res.status(500).json({ error: 'error occured' });
            console.log(err);
            
        });
    } catch(error){
         res.status(500).json({ error: 'Internal Server Error' });
         console.log(error);
    }
    
}

const getUserEmail = async(req,res) => {
    const email = req.body.email;
    try{
        User.findOne({email: email}).then((user)=>{
           if(user == null || user.length == 0){
            res.status(401).json({message:"email not found"});
           }else{
            res.status(201).json({user:user});
           }
        }).catch((err)=> {
            res.status(500).json({ error: 'error occured' });
            console.log(err);
            
        });
    } catch(error){
        res.status(500).json({ error: 'Internal Server Error' });
        console.log(error);
    }
}

const addSearchedUser = async(req,res)=> {
    try{
        const email = req.body.email;
        const searchedEmail = req.body.searchedEmail;
        const date = new Date();
      const searchedUser = new SearchedUser({
        email: email,
        searchedEmail:searchedEmail,
        lastAction: date
      });

      searchedUser.save().then(()=>{
        res.status(201).json({message:"email saved"});
      }).catch((err)=>{
        res.status(500).json({ error: 'error occured' });
        console.log(err);
      });
    } catch(error){
        res.status(500).json({ error: 'Internal Server Error' });
        console.log(error); 
    }

}


const getSearchedUser = async(req,res) => {
    try{
        const email = req.body.email;
      
      SearchedUser.find({email:email}).then((searchedUser)=>{
        res.status(201).json({searchedUser:searchedUser});
      }).catch((err)=>{
        res.status(500).json({ error: 'error occured' });
        console.log(err);
      });
    } catch(error){
        res.status(500).json({ error: 'Internal Server Error' });
        console.log(error); 
    }
}

const deleteSearchUser = async(req,res) => {
    try{
        const id = req.body.id;
       SearchedUser.deleteOne({_id:id}).then(()=>{
        res.status(201).json({message:"email removed"});
       }).catch((err)=>{
        res.status(500).json({ error: 'error occured' });
        console.log(err);
       });
    } catch(error){
        res.status(500).json({ error: 'Internal Server Error' });
        console.log(error); 
    }
}

module.exports = {getUserToSendTo,getUserEmail,addSearchedUser,getSearchedUser,deleteSearchUser}