import mongoose from "mongoose";

const candidateProfileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        mobile: {
            type: String,
            trim: true
        },

        location: {
            type: String,
            trim: true
        },

        currentLocation: {
            type: String,
            trim: true
        },

        preferredLocations: [
            {
                type: String,
                trim: true
            }
        ],

        qualification: {
            type: String,
            trim: true
        },

        education: [
            {
                type: String,
                trim: true
            }
        ],

        totalExperience: {
            type: Number,
            min: 0
        },

        currentCompany: {
            type: String,
            trim: true
        },

        currentDesignation: {
            type: String,
            trim: true
        },

        designation: {
            type: String,
            trim: true
        },

        expectedSalary: {
            type: Number,
            min: 0
        },

        noticePeriod: {
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

        linkedin: {
            type: String,
            trim: true
        },

        github: {
            type: String,
            trim: true
        },

        portfolio: {
            type: String,
            trim: true
        },

       skills: [
    {
        skillId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Skill",
            required: true
        },

        proficiency: {
            type: String,
            enum: [
                "Beginner",
                "Intermediate",
                "Advanced",
                "Expert"
            ],
            required: true
        },

        yearsOfExperience: {
            type: Number,
            min: 0
        },

        lastUsed: {
            type: String,
            trim: true
        },

        certification: {
            type: String,
            trim: true
        },

        projectExperience: {
            type: String,
            trim: true
        }
    }
],

        certifications: [
            {
                type: String,
                trim: true
            }
        ],

        resume: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Resume"
        },

        profilePhoto: {
            type: String,
            trim: true
        },

        profileStatus: {
            type: String,
            enum: [
                "INCOMPLETE",
                "COMPLETED"
            ],
            default: "INCOMPLETE"
        },

        verificationStatus: {
            type: String,
            enum: [
                "PENDING",
                "UNDER_REVIEW",
                "APPROVED",
                "REJECTED",
                "CORRECTION_REQUIRED",
                "SUSPENDED"
            ],
            default: "PENDING"
        }
    },
    {
        timestamps: true
    }
);

const CandidateProfile =
    mongoose.models.CandidateProfile ||
    mongoose.model(
        "CandidateProfile",
        candidateProfileSchema
    );

export default CandidateProfile;
