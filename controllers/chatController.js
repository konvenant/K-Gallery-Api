const SendVideo = require('../models/SendVideo');
const SendImage = require('../models/SendImage');



async function fetchSentItems(email) {
    try {
      // Find sent images
      const sentImages = await SendImage.find({
        $or: [{ fromEmail: email }, { toEmail: email }]
      }).sort({ _id: -1 });
  
      // Find sent videos
      const sentVideos = await SendVideo.find({
        $or: [{ fromEmail: email }, { toEmail: email }]
      }).sort({ _id: -1 });


  
      // Merge sent images and sent videos
      const allSentItems = [
        ...sentVideos.map(item => ({ ...item.toObject(), type: 'video' })),
        ...sentImages.map(item => ({ ...item.toObject(), type: 'image' }))
      ];


  
      // Create a map to track unique email addresses and their latest sent item
      const emailMap = new Map();
      allSentItems.forEach(item => {
        const otherEmail = item.fromEmail === email ? item.toEmail : item.fromEmail;
        const existingItem = emailMap.get(otherEmail);
        if (!existingItem || item._id.getTimestamp() > existingItem._id.getTimestamp()) {
          emailMap.set(otherEmail, item);
        }
      });
  
      // Convert map values to array of objects with required fields
      const sortedUniqueSentItems = Array.from(emailMap.values()).sort((a, b) => b._id.getTimestamp() - a._id.getTimestamp());
  
  console.log("sortedUniqueSentItems:",sortedUniqueSentItems);

      const formattedSentItems = sortedUniqueSentItems.map(item => ({
        email: item.fromEmail === email ? item.toEmail : item.fromEmail,
        date: item.date,
        url: (item.type === 'image' && item.imageUrl) || (item.type === 'video' && item.videoUrl),
        caption: item.caption,
        type: item.type
      }));
  
      return formattedSentItems;
    } catch (error) {
      console.error("Error fetching sent items:", error);
      throw error;
    }
  }
  




const getAllChatEmails = async(req,res) => {
    try {
        const email = req.params.email;

fetchSentItems(email)
  .then(sentItems => {
    console.log("Sent items:", sentItems);
    res.status(200).json({ chatItems: sentItems });
  })
  .catch(error => {
    console.error("Error:", error);
    res.status(200).json({ message: errror.message });
  });
    } catch (error) {
        
    }
}

module.exports = {getAllChatEmails};