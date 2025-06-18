import mongoose from 'mongoose';

const applicantSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  resumeLink: String, // link or path to uploaded resume
  status: { type: String, enum: ['applied', 'shortlisted', 'rejected'], default: 'applied' }
}, { timestamps: true });

export default mongoose.model('Applicant', applicantSchema);
