import Job from "../models/Job.js";
import Company from "../models/Company.js";
import Skill from "../models/Skill.js";


// Create Job
const createJob = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Company profile
        const company = await Company.findOne({
            userId
        });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company profile not found"
            });
        }

        // Only verified company can create jobs
        if (company.status !== "VERIFIED") {
            return res.status(403).json({
                success: false,
                message: "Company is not verified"
            });
        }

        const {
            title,
            department,
            requiredSkills,
            preferredSkills,
            experienceMin,
            experienceMax,
            location,
            salaryRange,
            employmentType,
            workMode,
            qualification,
            vacancies,
            description,
            responsibilities,
            requirements,
            benefits,
            applicationDeadline
        } = req.body;

        // Required fields
        if (
            !title ||
            !requiredSkills ||
            !experienceMin === undefined ||
            !location
        ) {
            return res.status(400).json({
                success: false,
                message: "Required job fields are missing"
            });
        }

        // Validate required skills
        const requiredSkillRecords = await Skill.find({
            _id: { $in: requiredSkills }
        });

        if (requiredSkillRecords.length !== requiredSkills.length) {
            return res.status(400).json({
                success: false,
                message: "One or more required skills are invalid"
            });
        }

        // Validate preferred skills if provided
        if (preferredSkills && preferredSkills.length > 0) {
            const preferredSkillRecords = await Skill.find({
                _id: { $in: preferredSkills }
            });

            if (
                preferredSkillRecords.length !==
                preferredSkills.length
            ) {
                return res.status(400).json({
                    success: false,
                    message: "One or more preferred skills are invalid"
                });
            }
        }

        const job = await Job.create({
            companyId: company._id,
            title,
            department,
            requiredSkills,
            preferredSkills,
            experienceMin,
            experienceMax,
            location,
            salaryRange,
            employmentType,
            workMode,
            qualification,
            vacancies,
            description,
            responsibilities,
            requirements,
            benefits,
            applicationDeadline,

            // Company cannot directly publish
            status: "DRAFT",
            approvalStatus: "PENDING"
        });

        return res.status(201).json({
            success: true,
            message: "Job created successfully",
            job
        });

    } catch (error) {
        console.error("Create job error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Get Company's Jobs
const getMyJobs = async (req, res) => {
    try {
        const userId = req.user.userId;

        const company = await Company.findOne({
            userId
        });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company profile not found"
            });
        }

        const jobs = await Job.find({
            companyId: company._id
        })
            .populate("requiredSkills")
            .populate("preferredSkills")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: jobs.length,
            jobs
        });

    } catch (error) {
        console.error("Get company jobs error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Get Single Job
const getJobById = async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.user.userId;

        const company = await Company.findOne({
            userId
        });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company profile not found"
            });
        }

        const job = await Job.findOne({
            _id: jobId,
            companyId: company._id
        })
            .populate("requiredSkills")
            .populate("preferredSkills");

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        return res.status(200).json({
            success: true,
            job
        });

    } catch (error) {
        console.error("Get job error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Update Job
const updateJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.user.userId;

        const company = await Company.findOne({
            userId
        });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company profile not found"
            });
        }

        const job = await Job.findOne({
            _id: jobId,
            companyId: company._id
        });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        const allowedFields = [
            "title",
            "department",
            "requiredSkills",
            "preferredSkills",
            "experienceMin",
            "experienceMax",
            "location",
            "salaryRange",
            "employmentType",
            "workMode",
            "qualification",
            "vacancies",
            "description",
            "responsibilities",
            "requirements",
            "benefits",
            "applicationDeadline"
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                job[field] = req.body[field];
            }
        });

        // Any change requires admin review again
        job.approvalStatus = "PENDING";
        job.status = "DRAFT";

        await job.save();

        return res.status(200).json({
            success: true,
            message: "Job updated successfully",
            job
        });

    } catch (error) {
        console.error("Update job error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


export {
    createJob,
    getMyJobs,
    getJobById,
    updateJob
};