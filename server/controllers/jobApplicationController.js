import Job from "../models/Job.js";
import CandidateProfile from "../models/CandidateProfile.js";
import JobApplication from "../models/JobApplication.js";
import Subscription from "../models/Subscription.js";


// =====================================================
// Candidate applies for a job
// =====================================================

const applyForJob = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { jobId } = req.params;
        const { coverLetter = "" } = req.body;


        // ---------------------------------------------
        // 1. Candidate profile
        // ---------------------------------------------

        const candidate =
            await CandidateProfile.findOne({
                userId
            });

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message:
                    "Candidate profile not found"
            });
        }


        // ---------------------------------------------
        // 2. Candidate must be approved
        // ---------------------------------------------

        if (
            candidate.verificationStatus !==
            "APPROVED"
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Candidate is not approved"
            });
        }


        // ---------------------------------------------
        // 3. Resume is required
        // ---------------------------------------------

        if (!candidate.resume) {
            return res.status(400).json({
                success: false,
                message:
                    "Please upload your resume before applying"
            });
        }


        // ---------------------------------------------
        // 4. Active candidate subscription
        // ---------------------------------------------

        const subscription =
            await Subscription.findOne({
                userId,
                userType: "CANDIDATE",
                status: "ACTIVE"
            }).sort({
                createdAt: -1
            });

        if (!subscription) {
            return res.status(403).json({
                success: false,
                message:
                    "Active subscription required"
            });
        }


        // ---------------------------------------------
        // 5. Job must be published + approved
        // ---------------------------------------------

        const job = await Job.findOne({
            _id: jobId,
            status: "PUBLISHED",
            approvalStatus: "APPROVED"
        });

        if (!job) {
            return res.status(404).json({
                success: false,
                message:
                    "Job not found or not available"
            });
        }


        // ---------------------------------------------
        // 6. Deadline check
        // ---------------------------------------------

        if (
            job.applicationDeadline &&
            new Date(job.applicationDeadline) <
                new Date()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Application deadline has passed"
            });
        }


        // ---------------------------------------------
        // 7. Prevent duplicate application
        // ---------------------------------------------

        const existingApplication =
            await JobApplication.findOne({
                jobId: job._id,
                candidateId: candidate._id
            });

        if (existingApplication) {
            return res.status(409).json({
                success: false,
                message:
                    "You have already applied for this job"
            });
        }


        // ---------------------------------------------
        // 8. Create application
        // ---------------------------------------------

        const application =
            await JobApplication.create({
                jobId: job._id,

                candidateId:
                    candidate._id,

                // Existing candidate resume
                resume:
                    candidate.resume,

                coverLetter:
                    coverLetter.trim(),

                status: "APPLIED"
            });


        // ---------------------------------------------
        // 9. Success response
        // ---------------------------------------------

        return res.status(201).json({
            success: true,
            message:
                "Job application submitted successfully",
            application
        });

    } catch (error) {
        console.error(
            "Apply for job error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Internal server error"
        });
    }
};


// =====================================================
// Candidate gets own applications
// =====================================================

const getMyApplications = async (req, res) => {
    try {
        const userId = req.user.userId;


        // ---------------------------------------------
        // Candidate profile
        // ---------------------------------------------

        const candidate =
            await CandidateProfile.findOne({
                userId
            });

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message:
                    "Candidate profile not found"
            });
        }


        // ---------------------------------------------
        // Get applications
        // ---------------------------------------------

        const applications =
            await JobApplication.find({
                candidateId: candidate._id
            })
                .populate(
                    "jobId",
                    "title department location salaryRange workMode status"
                )
                .populate(
                    "resume",
                    "fileName fileUrl publicId"
                )
                .sort({
                    createdAt: -1
                });


        // ---------------------------------------------
        // Response
        // ---------------------------------------------

        return res.status(200).json({
            success: true,
            count: applications.length,
            applications
        });

    } catch (error) {
        console.error(
            "Get candidate applications error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Internal server error"
        });
    }
};


export {
    applyForJob,
    getMyApplications
};