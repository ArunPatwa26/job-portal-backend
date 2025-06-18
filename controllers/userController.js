import User from '../modules/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register user (partial profile allowed)
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Full name, email, and password are required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user - profile fields optional, so ignore if not sent
    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      profile: req.body.profile || {},
      profilePicture: req.body.profilePicture || ''
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully', userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Create JWT token (adjust secret and expiry as needed)
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, userId: user._id, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password'); // exclude password
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users
 export  const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fill or update user profile data
export const fillUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { bio, skills, experience, jobType } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.profile.bio = bio || '';
    user.profile.skills = Array.isArray(skills) ? skills : [];
    user.profile.experience = experience || '';
    user.profile.jobType = jobType || '';

    await user.save();

    res.status(200).json({ message: 'Profile updated successfully', profile: user.profile });
  } catch (error) {
    console.error('Profile Update Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
