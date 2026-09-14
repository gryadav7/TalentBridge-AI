import CandidateProfile from "../models/CandidateProfile.js";
import Skill from "../models/Skill.js";


// Add skill to candidate
const addCandidateSkill = async (req, res) => {
    try {
        const userId = req.user.userId;

        const {
            skillId,
            proficiency,
            yearsOfExperience,
            lastUsed,
            certification,
            projectExperience
        } = req.body;

        // Validate required fields
        if (!skillId || !proficiency) {
            return res.status(400).json({
                success: false,
                message: "Skill and proficiency are required"
            });
        }

        // Validate skill
        const skill = await Skill.findById(skillId);

        if (!skill) {
            return res.status(404).json({
                success: false,
                message: "Skill not found"
            });
        }

        // Validate candidate profile
        const candidateProfile = await CandidateProfile.findOne({
            userId
        });

        if (!candidateProfile) {
            return res.status(404).json({
                success: false,
                message: "Candidate profile not found"
            });
        }

        // Check if skill already exists
        const existingSkill = candidateProfile.skills.find(
            (item) => item.skillId.toString() === skillId
        );

        if (existingSkill) {
            return res.status(409).json({
                success: false,
                message: "Skill already added to candidate profile"
            });
        }

        // Add skill
        candidateProfile.skills.push({
            skillId,
            proficiency,
            yearsOfExperience,
            lastUsed,
            certification,
            projectExperience
        });

        await candidateProfile.save();

        return res.status(201).json({
            success: true,
            message: "Skill added successfully",
            skill: {
                skillId,
                name: skill.name,
                proficiency,
                yearsOfExperience,
                lastUsed,
                certification,
                projectExperience
            }
        });

    } catch (error) {
        console.error("Add candidate skill error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Get candidate skills
const getCandidateSkills = async (req, res) => {
    try {
        const userId = req.user.userId;

        const candidateProfile = await CandidateProfile
            .findOne({ userId })
            .populate("skills.skillId");

        if (!candidateProfile) {
            return res.status(404).json({
                success: false,
                message: "Candidate profile not found"
            });
        }

        return res.status(200).json({
            success: true,
            skills: candidateProfile.skills
        });

    } catch (error) {
        console.error("Get candidate skills error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Update candidate skill
const updateCandidateSkill = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { skillId } = req.params;

        const candidateProfile = await CandidateProfile.findOne({
            userId
        });

        if (!candidateProfile) {
            return res.status(404).json({
                success: false,
                message: "Candidate profile not found"
            });
        }

        const candidateSkill = candidateProfile.skills.find(
            (item) => item.skillId.toString() === skillId
        );

        if (!candidateSkill) {
            return res.status(404).json({
                success: false,
                message: "Candidate skill not found"
            });
        }

        const allowedFields = [
            "proficiency",
            "yearsOfExperience",
            "lastUsed",
            "certification",
            "projectExperience"
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                candidateSkill[field] = req.body[field];
            }
        });

        await candidateProfile.save();

        return res.status(200).json({
            success: true,
            message: "Candidate skill updated successfully",
            skill: candidateSkill
        });

    } catch (error) {
        console.error("Update candidate skill error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Remove candidate skill
const removeCandidateSkill = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { skillId } = req.params;

        const candidateProfile = await CandidateProfile.findOne({
            userId
        });

        if (!candidateProfile) {
            return res.status(404).json({
                success: false,
                message: "Candidate profile not found"
            });
        }

        const initialLength = candidateProfile.skills.length;

        candidateProfile.skills = candidateProfile.skills.filter(
            (item) => item.skillId.toString() !== skillId
        );

        if (candidateProfile.skills.length === initialLength) {
            return res.status(404).json({
                success: false,
                message: "Candidate skill not found"
            });
        }

        await candidateProfile.save();

        return res.status(200).json({
            success: true,
            message: "Candidate skill removed successfully"
        });

    } catch (error) {
        console.error("Remove candidate skill error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// add custom skill

const addCustomCandidateSkill = async (req, res) => {
    try {
        const userId = req.user.userId;

        const {
            name,
            proficiency,
            yearsOfExperience,
            lastUsed,
            certification,
            projectExperience
        } = req.body;

        // Required fields
        if (!name || !proficiency) {
            return res.status(400).json({
                success: false,
                message: "Skill name and proficiency are required"
            });
        }

        // Find candidate profile
        const candidateProfile = await CandidateProfile.findOne({
            userId
        });

        if (!candidateProfile) {
            return res.status(404).json({
                success: false,
                message: "Candidate profile not found"
            });
        }

        // Check whether skill already exists
        let skill = await Skill.findOne({
            name: name.trim()
        });

        // Create skill if it does not exist
        if (!skill) {
            skill = await Skill.create({
                name: name.trim(),
                category: "Other",
                status: "ACTIVE"
            });
        }

        // Check candidate already has this skill
        const existingSkill = candidateProfile.skills.find(
            (item) => item.skillId.toString() === skill._id.toString()
        );

        if (existingSkill) {
            return res.status(409).json({
                success: false,
                message: "Skill already added to candidate profile"
            });
        }

        // Add skill to candidate profile
        candidateProfile.skills.push({
            skillId: skill._id,
            proficiency,
            yearsOfExperience,
            lastUsed,
            certification,
            projectExperience
        });

        await candidateProfile.save();

        return res.status(201).json({
            success: true,
            message: "Custom skill added successfully",
            skill: {
                skillId: skill._id,
                name: skill.name,
                category: skill.category,
                proficiency,
                yearsOfExperience,
                lastUsed,
                certification,
                projectExperience
            }
        });

    }catch (error) {
    console.error("Add custom candidate skill error:", error);

    if (error.name === "ValidationError") {
        return res.status(400).json({
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


export {
    addCandidateSkill,
    getCandidateSkills,
    updateCandidateSkill,
    removeCandidateSkill,
    addCustomCandidateSkill
};