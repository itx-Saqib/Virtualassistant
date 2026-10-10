const cloudinary = require('cloudinary').v2;
const fs = require('fs')

cloudinary.config({ 
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFile)=>{
    try {
        if(!localFile) return null;
        const upload = await cloudinary.uploader.upload(localFile,{
            resource_type:"image"
        })
        if(fs.existsSync(localFile)){
            fs.unlinkSync(localFile)
        }
        return upload.secure_url ;
    } catch (error) {
          if(fs.existsSync(localFile)){
            fs.unlinkSync(localFile)
        }
        console.log('image upload error:',error)
        return null;
    }
}

module.exports = uploadOnCloudinary ;