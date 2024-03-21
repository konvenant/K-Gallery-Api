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
    res.status(401).json({ message: errror.message });
  });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred' });
    }
}



async function fetchChatList(email1, email2) {
  try {
    // Find sent items from email1 to email2
    const sentItems1to2 = await Promise.all([
      SendImage.find({ fromEmail: email1, toEmail: email2 }),
      SendVideo.find({ fromEmail: email1, toEmail: email2 })
    ]);

    // Find sent items from email2 to email1
    const sentItems2to1 = await Promise.all([
      SendImage.find({ fromEmail: email2, toEmail: email1 }),
      SendVideo.find({ fromEmail: email2, toEmail: email1 })
    ]);

    // Combine all sent items
    const allSentItems = [...sentItems1to2[0], ...sentItems1to2[1], ...sentItems2to1[0], ...sentItems2to1[1]];

    // Sort items by timestamp
    allSentItems.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Format items
    const formattedChatList = allSentItems.map(item => ({
      sender: item.fromEmail === email1 ? email1 : email2,
      caption: item.caption,
      url: item.imageUrl || item.videoUrl,
      timeStamp: item.date,
      isFromMe: item.fromEmail === email1,
      isVideo: !!item.videoUrl,
      isImage: !!item.imageUrl,
      isSenderDeleted: item.isSenderDeleted,
      isReceiverDeleted: item.isReceiverDeleted,
      delivered: item.delivered,
      read: item.read,
      dateRecieverDelete:item.dateRecieverDelete,
      dateSenderDelete:item.dateSenderDelete
    }));

    return formattedChatList;
  } catch (error) {
    console.error("Error fetching chat list:", error);
    throw error;
  }
}



const getAllChatMessages = async(req,res) => {
  try {
      const email1 = req.params.email1;
      const email2 = req.params.email2;


      fetchChatList(email1, email2)
      .then(chatList => {
        console.log("Chat list:", chatList);
        res.status(200).json({ chatMessages: chatList });
      })
      .catch(error => {
        console.error("Error:", error);
        // Handle error
      });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred' });
  }
}



module.exports = {getAllChatEmails, getAllChatMessages};