import mongoose from "mongoose";

const jobMatchSchema = new mongoose.Schema(
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

        skillMatch: {
            type: Number,
            min: 0,
            max: 100,
            required: true
        },

        experienceMatch: {
            type: Number,
            min: 0,
            max: 100,
            required: true
        },

        locationMatch: {
            type: Number,
            min: 0,
            max: 100,
            required: true
        },

        qualificationMatch: {
            type: Number,
            min: 0,
            max: 100,
            required: true
        },

        overallMatch: {
            type: Number,
            min: 0,
            max: 100,
            required: true
        },

        matchedSkills: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Skill"
            }
        ],

        missingSkills: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Skill"
            }
        ]
    },
    {
        timestamps: true
    }
);

const JobMatch = mongoose.model("JobMatch", jobMatchSchema);

export default JobMatch;