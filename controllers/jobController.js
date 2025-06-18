import Job from '../modules/job.js';
import cloudinary from "../config/cloudinary.js";

export const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      jobType,
      salaryRange,
      experience,
      vacancy,
      startDate,
      description,
      requirements,
    } = req.body;

    const companylogoUrl = req.file?.path || ""; // cloudinary auto uploads and gives path

    const job = new Job({
      title,
      company,
      companylogo: companylogoUrl,
      location,
      jobType,
      salaryRange,
      experience,
      vacancy,
      startDate,
      description,
      requirements,
      postedBy: req.params._id,
    });

    await job.save();
    res.status(201).json({ message: "Job created successfully", job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create job", error: error.message });
  }
};

// Get all jobs (filter optional)
export const getJobs = async (req, res) => {
  try {
    const filters = {};

    if (req.query.jobType) filters.jobType = req.query.jobType;
    if (req.query.location) filters.location = req.query.location;
    if (req.query.company) filters.company = req.query.company;

    const jobs = await Job.find(filters).populate('postedBy', 'fullName email');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch jobs", error: error.message });
  }
};

// Get job by ID
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'fullName email');
    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch job", error: error.message });
  }
};

// Update job by ID with optional new company logo
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Optional owner check:
    // if (job.postedBy.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({ message: "Unauthorized" });
    // }

    // If new logo uploaded, upload to Cloudinary and replace the URL
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "company_logos",
      });
      req.body.companylogo = result.secure_url;
    }

    Object.assign(job, req.body);
    await job.save();

    res.json({ message: "Job updated successfully", job });
  } catch (error) {
    res.status(500).json({ message: "Failed to update job", error: error.message });
  }
};

// Delete job by ID
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Optional owner check:
    // if (job.postedBy.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({ message: "Unauthorized" });
    // }

    await job.deleteOne();
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete job", error: error.message });
  }
};

export const searchJob= async (req, res) => {
  try {
    console.log("Search Key:", req.params.key); // Debugging

    const result = await Job.aggregate([
      {
        $search: {
          index: "default", // or your custom index name
          text: {
            query: req.params.key,
            path: {
              wildcard: "*" // search in all string fields
            }
          }
        }
      }
    ]);

    console.log("Search Result:", result); // Debugging

    if (!result || result.length === 0) {
      return res.status(404).json({ message: "No jobs found" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Search Job Error:", error);
    res.status(500).json({ error: "Failed to search jobs", details: error.message });
  }
}


// Get all jobs posted by a specific recruiter
export const getJobsByRecruiter = async (req, res) => {
  try {
    const recruiterId = req.params.recruiterId;

    const jobs = await Job.find({ postedBy: recruiterId }).populate('postedBy', 'fullName email');

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ message: "No jobs found for this recruiter" });
    }

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs by recruiter:", error);
    res.status(500).json({ message: "Failed to fetch jobs", error: error.message });
  }
};
