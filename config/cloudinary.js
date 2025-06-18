import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();  // load .env vars
// console.log(process.env.CLOUDINARY_SECRET_KEY)

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
  secure: true,
});

export default cloudinary;
