import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        companyName: {
            type: String,
            required: true,
            trim: true
        },

        officialEmail: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },

        mobile: {
            type: String,
            trim: true
        },

        website: {
            type: String,
            trim: true
        },

        industry: {
            type: String,
            trim: true
        },

        companySize: {
            type: String,
            trim: true
        },

        location: {
            type: String,
            trim: true
        },

        gstCin: {
            type: String,
            trim: true
        },

        recruiterName: {
            type: String,
            trim: true
        },

        recruiterDesignation: {
            type: String,
            trim: true
        },

        companyProfile: {
            type: String,
            trim: true
        },

        logo: {
            type: String,
            trim: true
        },

        verificationDocuments: [
            {
                type: String,
                trim: true
            }
        ],

        status: {
            type: String,
            enum: [
                "PENDING",
                "VERIFIED",
                "REJECTED",
                "SUSPENDED"
            ],
            default: "PENDING"
        }
    },
    {
        timestamps: true
    }
);

const Company = mongoose.model("Company", companySchema);

export default Company;