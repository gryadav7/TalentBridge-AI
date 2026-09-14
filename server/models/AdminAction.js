import mongoose from "mongoose";

const adminActionSchema = new mongoose.Schema(
    {
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        candidateId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CandidateProfile"
        },

        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company"
        },

        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job"
        },

        action: {
            type: String,
            enum: [
                "START_REVIEW",
                "APPROVE",
                "REJECT",
                "REQUEST_CORRECTION",
                "SUSPEND",
                "DELETE",
                "VERIFY_RESUME",
                "MANAGE_SKILLS",
                "VERIFY_COMPANY",
                "MANAGE_COMPANY",
                "APPROVE_JOB",
                "REJECT_JOB",
                "REQUEST_JOB_CHANGES",
                "PAUSE_JOB",
                "EXPIRE_JOB"
            ],
            required: true
        },

        note: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const AdminAction = mongoose.model(
    "AdminAction",
    adminActionSchema
);

export default AdminAction;