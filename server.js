import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cloudinary from './config/cloudinary.js';
import userRoutes from './routes/userRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import jobApplicants from "./routes/applicantsRoutes.js";
import path from 'path';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Default API
app.get('/', (req, res) => {
  res.send('Welcome to Job Portal Backend 🚀');
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/job', jobRoutes);
app.use('/api/jobapply', jobApplicants);
app.use('/resumes', express.static(path.join('uploads', 'resumes')));

async function testCloudinary() {
  try {
    const result = await cloudinary.api.resources({ max_results: 1 });
    console.log('Cloudinary connected!');
  } catch (error) {
    console.error('Cloudinary connection failed:', error);
  }
}

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('MongoDB connected');
  await testCloudinary();
  app.listen(3000, () => console.log('Server running on port 3000'));
}).catch(err => console.log(err));
