import express from 'express';
import User from '../modules/user.js';
import {
  registerUser,
  loginUser,
  getUserById,
  getAllUsers,
  fillUserProfile
} from '../controllers/userController.js';

import { uploadImage, uploadResume } from '../config/upload.js';

const router = express.Router();

// Register user (no files)
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Upload profile picture
router.post('/upload/profile-picture/:id', uploadImage.single('profilePicture'), async (req, res) => {
  try {
    const userId = req.params.id;
    if (!req.file) return res.status(400).json({ message: 'No image uploaded' });

    // Update user profilePicture URL
    const user = await User.findByIdAndUpdate(userId, { profilePicture: req.file.path }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Profile picture uploaded', profilePicture: req.file.path });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/upload/resume/:id', uploadResume.single('resume'), async (req, res) => {
  try {
    const userId = req.params.id;

    if (!req.file || !req.file.filename) {
      return res.status(400).json({ message: 'No resume uploaded' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Only store the file name, e.g., "1749113427266-Arun-Resume.pdf"
    user.profile.resumeLink = req.file.filename;
    await user.save();

    res.status(200).json({
      message: 'Resume uploaded successfully',
      resumeLink: req.file.filename
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



// Get user by id
router.get('/:id', getUserById);

// Get all users
router.get('/', getAllUsers);
router.post('/fill-profile/:id', fillUserProfile);


export default router;
