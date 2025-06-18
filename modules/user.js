import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['user', 'admin', 'recruiter'], default: 'user' },
  profile: {
    bio: String,
    skills: [String],
    experience: String,
    jobType: { type: String }, // e.g. 'Full-Time', 'Part-Time', 'Internship'
    resumeLink: String
  },
  profilePicture: {
    type: String, // Store URL or file path to the uploaded image
    default: ''   // Optional: default image path
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
