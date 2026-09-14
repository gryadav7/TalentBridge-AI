import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        department: {
            type: String,
            trim: true
        },

        requiredSkills: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Skill"
            }
        ],

        preferredSkills: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Skill"
            }
        ],

        experienceMin: {
            type: Number,
            min: 0
        },

        experienceMax: {
            type: Number,
            min: 0
        },

        location: [
            {
                type: String,
                trim: true
            }
        ],

        salaryRange: {
            type: String,
            trim: true
        },

        employmentType: {
            type: String,
            trim: true
        },

        workMode: {
            type: String,
            trim: true
        },

        qualification: {
            type: String,
            trim: true
        },

        vacancies: {
            type: Number,
            min: 1
        },

        description: {
            type: String,
            trim: true
        },

        responsibilities: {
            type: String,
            trim: true
        },

        requirements: {
            type: String,
            trim: true
        },

        benefits: {
            type: String,
            trim: true
        },

        applicationDeadline: {
            type: Date
        },

        status: {
            type: String,
            enum: [
                "DRAFT",
                "PUBLISHED",
                "PAUSED",
                "EXPIRED"
            ],
            default: "DRAFT"
        },

        approvalStatus: {
            type: String,
            enum: [
                "PENDING",
                "APPROVED",
                "REJECTED",
                "CHANGES_REQUESTED"
            ],
            default: "PENDING"
        },

        publishedAt: {
            type: Date
        },

        expiresAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;