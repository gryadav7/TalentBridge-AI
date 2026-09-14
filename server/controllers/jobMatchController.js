import JobMatch from "../models/JobMatch.js";
import { calculateJobCandidateMatch } from "../services/matchingService.js";


const createJobMatch = async (req, res) => {
    try {
        const { jobId, candidateId } = req.params;

        // Calculate match
        const matchResult = await calculateJobCandidateMatch(
            jobId,
            candidateId
        );

        // Check existing match
        const existingMatch = await JobMatch.findOne({
            jobId,
            candidateId
        });

        if (existingMatch) {
            existingMatch.skillMatch = matchResult.skillMatch;
            existingMatch.experienceMatch = matchResult.experienceMatch;
            existingMatch.locationMatch = matchResult.locationMatch;
            existingMatch.qualificationMatch =
                matchResult.qualificationMatch;
            existingMatch.overallMatch =
                matchResult.overallMatch;
            existingMatch.matchedSkills =
                matchResult.matchedSkills;
            existingMatch.missingSkills =
                matchResult.missingSkills;

            await existingMatch.save();

            return res.status(200).json({
                success: true,
                message: "Job match updated successfully",
                match: existingMatch
            });
        }

        // Create new match
        const jobMatch = await JobMatch.create({
            jobId: matchResult.jobId,
            candidateId: matchResult.candidateId,
            skillMatch: matchResult.skillMatch,
            experienceMatch: matchResult.experienceMatch,
            locationMatch: matchResult.locationMatch,
            qualificationMatch:
                matchResult.qualificationMatch,
            overallMatch: matchResult.overallMatch,
            matchedSkills: matchResult.matchedSkills,
            missingSkills: matchResult.missingSkills
        });

        return res.status(201).json({
            success: true,
            message: "Job match created successfully",
            match: jobMatch
        });

    } catch (error) {
    console.error("Create job match error:", error);

    if (
        error.message === "Job is not approved or published" ||
        error.message === "Candidate is not approved"
    ) {
        return res.status(403).json({
            success: false,
            message: error.message
        });
    }

    if (
        error.message === "Job not found" ||
        error.message === "Candidate not found"
    ) {
        return res.status(404).json({
            success: false,
            message: error.message
        });
    }

    return res.status(500).json({
        success: false,
        message: "Internal server error"
    });
}
};


const getJobMatch = async (req, res) => {
    try {
        const { jobId, candidateId } = req.params;

        const match = await JobMatch.findOne({
            jobId,
            candidateId
        })
            .populate("matchedSkills")
            .populate("missingSkills");

        if (!match) {
            return res.status(404).json({
                success: false,
                message: "Job match not found"
            });
        }

        return res.status(200).json({
            success: true,
            match
        });

    } catch (error) {
        console.error("Get job match error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


export {
    createJobMatch,
    getJobMatch
};