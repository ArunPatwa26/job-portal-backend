import Applicant from '../modules/applicant.js';

// Create a new applicant with resume upload
export const createApplicant = async (req, res) => {
  try {
    const { userId, jobId } = req.params;

    if (!req.file || !req.file.filename) {
      return res.status(400).json({ message: 'No resume uploaded' });
    }

    // Check if already applied
    const existing = await Applicant.findOne({ user: userId, job: jobId });
    if (existing) {
      return res.status(400).json({ message: 'You have already applied to this job.' });
    }

    const applicant = new Applicant({
      user: userId,
      job: jobId,
      resumeLink: req.file.filename
    });

    await applicant.save();
    res.status(201).json({
      message: 'Application submitted successfully',
      applicant
    });
  } catch (error) {
    console.error('Application Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update applicant status (e.g., shortlisted, rejected)
export const updateApplicantStatus = async (req, res) => {
  try {
    const { applicantId } = req.params;
    const { status } = req.body;

    const validStatuses = ['applied','reviewed','interviewed' ,"hired",'shortlisted', 'rejected','selected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const applicant = await Applicant.findByIdAndUpdate(
      applicantId,
      { status },
      { new: true }
    );

    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }

    res.status(200).json(applicant);
  } catch (err) {
    res.status(500).json({ message: 'Error updating status', error: err.message });
  }
};

// Get applicants by job ID
export const getApplicantsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const applicants = await Applicant.find({ job: jobId })
      .populate('user', 'name email')
      .populate('job', 'title');

    res.status(200).json(applicants);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch applicants by job ID', error: err.message });
  }
};

// Get applicant details by user ID
export const getApplicantsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const applicants = await Applicant.find({ user: userId })
      .populate('job', 'title company')
      .populate('user', 'name email');

    res.status(200).json(applicants);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch applicants for user', error: err.message });
  }
};