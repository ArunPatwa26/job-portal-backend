// upload.js
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js';
import path from 'path';
import fs from 'fs';

// For images only
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'job_portal_profiles/images',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    resource_type: 'image'
  }
});

export const uploadImage = multer({ storage: imageStorage });
// ✅ Local storage for resumes (PDFs only)
const resumeStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = path.join('uploads', 'resumes');

    // Create folder if doesn't exist
    fs.mkdirSync(uploadsDir, { recursive: true });

    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
    cb(null, uniqueName);
  }
});

// ✅ File type filter for PDFs
const fileFilter = function (req, file, cb) {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

export const uploadResume = multer({
  storage: resumeStorage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});