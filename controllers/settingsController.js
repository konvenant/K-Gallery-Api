const Settings = require('../models/Settings');
const Notification = require('../models/Notification');


const getAllCurrentSettings = async(req,res) => {
    try{
        const email = req.params.email;
      Settings.findOne({email:email}).then((settings)=>{
        res.status(201).json({settings:settings});
      }).catch((err)=>{
        res.status(500).json({ error: 'error occured' });
        console.log(err);
      });
    } catch(error){
        console.log(error);
        res.status(500).json({error:'internal server error'});
    }

}

const updateSettings = async(req,res) => {
    try{
        const email = req.body.email;
        const darkMode = req.body.darkMode;
        const language = req.body.language;
        const notificationOn = req.body.notificationOn;
        const sendNewsLetter = req.body.sendNewsLetter;
        const date = new Date(); 


        const notice = new Notification({
            email: email,
            heading: "Settings Changed",
            body: `Your preferred settings was updated successfully`,
            date: date,
            isRead:false,
            action: "open-settings"
          });

      Settings.updateMany({email:email},{
        darkMode: darkMode,
 language: language,
 notificationOn: notificationOn,
 sendNewsLetter: sendNewsLetter,
 lastAction:date
      }).then(()=>{
       Settings.findOne({email:email}).then((settings)=>{
        notice.save()
        res.status(201).json({settings:settings});
       }).catch((errr)=>{
        res.status(500).json({ error: 'error occured' });
        console.log(errr);
      });
      }).catch((err)=>{
        res.status(500).json({ error: 'error occured' });
        console.log(err);
      });
    } catch(error){
        console.log(error);
        res.status(500).json({error:'internal server error'});
    }
}

module.exports = {getAllCurrentSettings,updateSettings}