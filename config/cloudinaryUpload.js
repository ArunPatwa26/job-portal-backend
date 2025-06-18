import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'job_portal_profiles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],  // added pdf here
    resource_type: 'auto' // important! lets Cloudinary accept both images and raw files (like pdf)
  }
});

const upload = multer({ storage });

export default upload;
