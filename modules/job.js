import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  companylogo: String,
  location: String,
  jobType: String, // e.g. Full-Time, Part-Time
  salaryRange: String,
  experience: String, // e.g. "2+ years", "Fresher", etc.
  vacancy: Number, // number of positions available
  startDate: {
    type: Date,
    default: Date.now // 👈 this will auto-fill with current date/time
  },
  description: String,
  requirements: String,
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Job', jobSchema);
