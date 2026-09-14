import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        userType: {
            type: String,
            enum: [
                "CANDIDATE",
                "COMPANY"
            ],
            required: true
        },

        plan: {
            type: String,
            enum: [
                "FREE",
                "JOB_SEEKER_PRO",
                "JOB_SEEKER_PREMIUM",
                "RECRUITER_PRO",
                "RECRUITER_BUSINESS",
                "ENTERPRISE"
            ],
            required: true
        },

        billingCycle: {
            type: String,
            enum: [
                "MONTHLY",
                "YEARLY",
                "NONE"
            ],
            default: "MONTHLY"
        },

        status: {
            type: String,
            enum: [
                "ACTIVE",
                "EXPIRED",
                "CANCELLED"
            ],
            default: "ACTIVE"
        },

        startDate: {
            type: Date,
            required: true
        },

        endDate: {
            type: Date
        },

        credits: {
            type: Number,
            default: 0,
            min: 0
        },

        razorpayOrderId: {
            type: String
        },

        razorpayPaymentId: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

const Subscription = mongoose.model(
    "Subscription",
    subscriptionSchema
);

export default Subscription;