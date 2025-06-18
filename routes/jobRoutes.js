import express from 'express';
import * as jobController from "../controllers/jobController.js";
import { uploadImage } from '../config/upload.js';

const router = express.Router();

// Create job with company logo (Cloudinary)
router.post('/jobs/:_id', uploadImage.single('companylogo'), jobController.createJob);

// Update job with optional new logo
router.put('/jobs/:id', uploadImage.single('companylogo'), jobController.updateJob);

// Other routes
router.get('/search/:key', jobController.searchJob);

router.get('/jobs', jobController.getJobs);
router.get('/jobs/:id', jobController.getJobById);
router.get("/recruiter-job/:recruiterId", jobController.getJobsByRecruiter);
router.delete('/jobs/:id', jobController.deleteJob);

export default router;
