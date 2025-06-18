import express from 'express';
import {
  createApplicant,
  updateApplicantStatus,
  getApplicantsByJob,
  getApplicantsByUser
} from '../controllers/applicantsController.js';
import { uploadResume } from '../config/upload.js';

const router = express.Router();

// ✅ Create Applicant with resume upload
router.post('/apply/:userId/:jobId', uploadResume.single('resume'), createApplicant);

// ✅ Update Applicant Status
router.put('/status/:applicantId', updateApplicantStatus);

// ✅ Get Applicants by Job ID
router.get('/by-job/:jobId', getApplicantsByJob);

// ✅ Get Applicants by User ID
router.get('/by-user/:userId', getApplicantsByUser);

export default router;