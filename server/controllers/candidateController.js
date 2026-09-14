import CandidateProfile from "../models/CandidateProfile.js";


// Create Candidate Profile
const createCandidateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const existingProfile =
            await CandidateProfile.findOne({ userId });

        if (existingProfile) {
            return res.status(409).json({
                success: false,
                message: "Candidate profile already exists"
            });
        }

        const {
            name,
            mobile,
            location,
            currentLocation,
            preferredLocations,
            qualification,
            education,
            totalExperience,
            currentCompany,
            currentDesignation,
            designation,
            expectedSalary,
            noticePeriod,
            employmentType,
            workMode,
            linkedin,
            github,
            portfolio,
            skills,
            certifications,
            profilePhoto
        } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Name is required"
            });
        }

        const candidateProfile =
            await CandidateProfile.create({
                userId,
                name,
                mobile,
                location,
                currentLocation,
                preferredLocations,
                qualification,
                education,
                totalExperience,
                currentCompany,
                currentDesignation,
                designation,
                expectedSalary,
                noticePeriod,
                employmentType,
                workMode,
                linkedin,
                github,
                portfolio,
                skills,
                certifications,
                profilePhoto
            });

        return res.status(201).json({
            success: true,
            message:
                "Candidate profile created successfully",
            profile: candidateProfile
        });

    } catch (error) {
        console.error(
            "Create candidate profile error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Get Candidate Profile
const getCandidateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const candidateProfile =
            await CandidateProfile
                .findOne({ userId })
                .populate("userId", "email")
                .populate(
                    "resume",
                    "fileName fileUrl publicId"
                );

        if (!candidateProfile) {
            return res.status(404).json({
                success: false,
                message:
                    "Candidate profile not found"
            });
        }

        return res.status(200).json({
            success: true,
            profile: candidateProfile
        });

    } catch (error) {
        console.error(
            "Get candidate profile error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Update Candidate Profile
const updateCandidateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const candidateProfile =
            await CandidateProfile.findOne({
                userId
            });

        if (!candidateProfile) {
            return res.status(404).json({
                success: false,
                message:
                    "Candidate profile not found"
            });
        }

        const allowedFields = [
            "name",
            "mobile",
            "location",
            "currentLocation",
            "preferredLocations",
            "qualification",
            "education",
            "totalExperience",
            "currentCompany",
            "currentDesignation",
            "designation",
            "expectedSalary",
            "noticePeriod",
            "employmentType",
            "workMode",
            "linkedin",
            "github",
            "portfolio",
            "skills",
            "certifications",
            "profilePhoto"
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                candidateProfile[field] =
                    req.body[field];
            }
        });

        await candidateProfile.save();

        return res.status(200).json({
            success: true,
            message:
                "Candidate profile updated successfully",
            profile: candidateProfile
        });

    } catch (error) {
        console.error(
            "Update candidate profile error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


export {
    createCandidateProfile,
    getCandidateProfile,
    updateCandidateProfile
};