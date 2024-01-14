const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
    cloud_name : process.env.cloudName,
    api_key : process.env.APIkey,
    api_secret : process.env.APIsecret,
    
})



const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowedFormats : ["png","jpg","jpeg"]
    },
  });

module.exports = {
    cloudinary,
    storage
}