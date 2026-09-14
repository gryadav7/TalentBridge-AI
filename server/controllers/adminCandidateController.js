import CandidateProfile from "../models/CandidateProfile.js";
import AdminAction from "../models/AdminAction.js";
import Resume from "../models/Resume.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";


// Get all candidates
const getAllCandidates = async (req, res) => {
    try {
        const candidates = await CandidateProfile
            .find()
            .populate("userId", "name email role")
            .populate("resume")
            .populate("skills.skillId");

        return res.status(200).json({
            success: true,
            count: candidates.length,
            candidates
        });

    } catch (error) {
        console.error("Get all candidates error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Get single candidate
const getCandidateById = async (req, res) => {
    try {
        const { candidateId } = req.params;

        const candidate = await CandidateProfile
            .findById(candidateId)
            .populate("userId", "name email role")
            .populate("resume")
            .populate("skills.skillId");

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: "Candidate not found"
            });
        }

        return res.status(200).json({
            success: true,
            candidate
        });

    } catch (error) {
        console.error("Get candidate error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Update candidate verification status
const updateCandidateStatus = async (req, res) => {
    try {
        const { candidateId } = req.params;
        const { status, note } = req.body;

        const allowedStatuses = [
            "UNDER_REVIEW",
            "APPROVED",
            "REJECTED",
            "CORRECTION_REQUIRED",
            "SUSPENDED"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid candidate status"
            });
        }

        const candidate = await CandidateProfile.findById(candidateId);

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: "Candidate not found"
            });
        }

        candidate.verificationStatus = status;

        await candidate.save();

        let action;

        if (status === "UNDER_REVIEW") {
            action = "START_REVIEW";
        } else if (status === "APPROVED") {
            action = "APPROVE";
        } else if (status === "REJECTED") {
            action = "REJECT";
        } else if (status === "SUSPENDED") {
            action = "SUSPEND";
        } else {
            action = "REQUEST_CORRECTION";
        }

        await AdminAction.create({
            adminId: req.user.userId,
            candidateId: candidate._id,
            action,
            note
        });

        return res.status(200).json({
            success: true,
            message: "Candidate status updated successfully",
            verificationStatus: candidate.verificationStatus
        });

    } catch (error) {
        console.error("Update candidate status error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

//Update resume  

const updateResumeStatus = async (req, res) => {
    try {
        const { candidateId } = req.params;
        const { status, note } = req.body;

        const allowedStatuses = ["APPROVED", "REJECTED"];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid resume status"
            });
        }

        const candidate = await CandidateProfile
            .findById(candidateId)
            .populate("resume");

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: "Candidate not found"
            });
        }

        if (!candidate.resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found"
            });
        }

        candidate.resume.verificationStatus = status;

        await candidate.resume.save();

        await AdminAction.create({
            adminId: req.user.userId,
            candidateId: candidate._id,
            action: "VERIFY_RESUME",
            note: note || `Resume ${status.toLowerCase()}`
        });

        return res.status(200).json({
            success: true,
            message: "Resume status updated successfully",
            verificationStatus: candidate.resume.verificationStatus
        });

    } catch (error) {
        console.error("Update resume status error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Delete Candidate

const deleteCandidate = async (req, res) => {
    try {
        const { candidateId } = req.params;

        const candidate = await CandidateProfile.findById(candidateId);

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: "Candidate not found"
            });
        }

        // Find candidate resume
        const resume = await Resume.findOne({
            candidateId: candidate._id
        });

        // Delete resume from Cloudinary
        if (resume) {
            try {
                await cloudinary.uploader.destroy(
                    resume.publicId,
                    {
                        resource_type: "raw"
                    }
                );
            } catch (error) {
                console.error(
                    "Resume deletion from Cloudinary failed:",
                    error.message
                );
            }
        }

        // Delete resume document
        await Resume.deleteOne({
            candidateId: candidate._id
        });

        // Delete admin actions related to candidate
        await AdminAction.deleteMany({
            candidateId: candidate._id
        });

        // Delete candidate profile
        await CandidateProfile.deleteOne({
            _id: candidate._id
        });

        // Delete associated user account
        await User.deleteOne({
            _id: candidate.userId
        });

        return res.status(200).json({
            success: true,
            message: "Candidate deleted successfully"
        });

    } catch (error) {
        console.error("Delete candidate error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};



export {
    getAllCandidates,
    getCandidateById,
    updateCandidateStatus,
    updateResumeStatus,
    deleteCandidate
};






