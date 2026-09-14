import Job from "../models/Job.js";
import AdminAction from "../models/AdminAction.js";


// Get all jobs
const getAllJobsByAdmin = async (req, res) => {
    try {
        const jobs = await Job.find()
            .populate("companyId")
            .populate("requiredSkills")
            .populate("preferredSkills")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: jobs.length,
            jobs
        });

    } catch (error) {
        console.error("Get all jobs by admin error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Get single job
const getJobByIdByAdmin = async (req, res) => {
    try {
        const { jobId } = req.params;

        const job = await Job.findById(jobId)
            .populate("companyId")
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
        console.error("Get job by admin error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Approve job
const approveJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { note } = req.body;

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        job.approvalStatus = "APPROVED";
        job.status = "PUBLISHED";
        job.publishedAt = new Date();

        await job.save();

        await AdminAction.create({
            adminId: req.user.userId,
            jobId: job._id,
            action: "APPROVE_JOB",
            note
        });

        return res.status(200).json({
            success: true,
            message: "Job approved and published successfully"
        });

    } catch (error) {
        console.error("Approve job error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Reject job
const rejectJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { note } = req.body;

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        job.approvalStatus = "REJECTED";
        job.status = "DRAFT";

        await job.save();

        await AdminAction.create({
            adminId: req.user.userId,
            jobId: job._id,
            action: "REJECT_JOB",
            note
        });

        return res.status(200).json({
            success: true,
            message: "Job rejected successfully"
        });

    } catch (error) {
        console.error("Reject job error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Request changes
const requestJobChanges = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { note } = req.body;

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        job.approvalStatus = "CHANGES_REQUESTED";
        job.status = "DRAFT";

        await job.save();

        await AdminAction.create({
            adminId: req.user.userId,
            jobId: job._id,
            action: "REQUEST_JOB_CHANGES",
            note
        });

        return res.status(200).json({
            success: true,
            message: "Changes requested for job"
        });

    } catch (error) {
        console.error("Request job changes error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Pause job
const pauseJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { note } = req.body;

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        job.status = "PAUSED";

        await job.save();

        await AdminAction.create({
            adminId: req.user.userId,
            jobId: job._id,
            action: "PAUSE_JOB",
            note
        });

        return res.status(200).json({
            success: true,
            message: "Job paused successfully"
        });

    } catch (error) {
        console.error("Pause job error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Expire job
const expireJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { note } = req.body;

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        job.status = "EXPIRED";

        await job.save();

        await AdminAction.create({
            adminId: req.user.userId,
            jobId: job._id,
            action: "EXPIRE_JOB",
            note
        });

        return res.status(200).json({
            success: true,
            message: "Job expired successfully"
        });

    } catch (error) {
        console.error("Expire job error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


export {
    getAllJobsByAdmin,
    getJobByIdByAdmin,
    approveJob,
    rejectJob,
    requestJobChanges,
    pauseJob,
    expireJob
};