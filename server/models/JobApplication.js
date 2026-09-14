import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
    {
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true
        },

        candidateId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CandidateProfile",
            required: true
        },

        // Candidate's uploaded resume
        resume: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Resume",
            required: true
        },

        coverLetter: {
            type: String,
            trim: true
        },

        status: {
            type: String,
            enum: [
                "APPLIED",
                "SHORTLISTED",
                "REJECTED",
                "INTERVIEW",
                "SELECTED",
                "JOINED"
            ],
            default: "APPLIED"
        },

        appliedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

const JobApplication =
    mongoose.models.JobApplication ||
    mongoose.model(
        "JobApplication",
        jobApplicationSchema
    );

export default JobApplication;