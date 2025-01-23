import { v2 as cloudinary } from "cloudinary";

const uploadToCloudinary = async (file, folder) => {
  return cloudinary.uploader.upload(file.tempFilePath, {
    folder: folder,
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  });
};

export default uploadToCloudinary;