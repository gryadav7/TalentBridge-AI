import CandidateProfile from "../models/CandidateProfile.js";
import Skill from "../models/Skill.js";
import AdminAction from "../models/AdminAction.js";


// Get candidate skills
const getCandidateSkillsByAdmin = async (req, res) => {
    try {
        const { candidateId } = req.params;

        const candidate = await CandidateProfile
            .findById(candidateId)
            .populate("skills.skillId");

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: "Candidate not found"
            });
        }

        return res.status(200).json({
            success: true,
            skills: candidate.skills
        });

    } catch (error) {
        console.error("Get candidate skills by admin error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Add skill to candidate
const addCandidateSkillByAdmin = async (req, res) => {
    try {
        const { candidateId } = req.params;

        const {
            skillId,
            proficiency,
            yearsOfExperience,
            lastUsed,
            certification,
            projectExperience
        } = req.body;

        if (!skillId || !proficiency) {
            return res.status(400).json({
                success: false,
                message: "Skill and proficiency are required"
            });
        }

        const candidate = await CandidateProfile.findById(candidateId);

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: "Candidate not found"
            });
        }

        const skill = await Skill.findById(skillId);

        if (!skill) {
            return res.status(404).json({
                success: false,
                message: "Skill not found"
            });
        }

        const alreadyExists = candidate.skills.some(
            (item) =>
                item.skillId.toString() === skillId
        );

        if (alreadyExists) {
            return res.status(409).json({
                success: false,
                message: "Skill already exists for this candidate"
            });
        }

        candidate.skills.push({
            skillId,
            proficiency,
            yearsOfExperience,
            lastUsed,
            certification,
            projectExperience
        });

        await candidate.save();

        await AdminAction.create({
            adminId: req.user.userId,
            candidateId: candidate._id,
            action: "MANAGE_SKILLS",
            note: `Added skill: ${skill.name}`
        });

        return res.status(201).json({
            success: true,
            message: "Candidate skill added successfully"
        });

    } catch (error) {
        console.error("Add candidate skill by admin error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Update candidate skill
const updateCandidateSkillByAdmin = async (req, res) => {
    try {
        const { candidateId, skillId } = req.params;

        const candidate = await CandidateProfile.findById(candidateId);

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: "Candidate not found"
            });
        }

        const candidateSkill = candidate.skills.find(
            (item) =>
                item.skillId.toString() === skillId
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

        await candidate.save();

        await AdminAction.create({
            adminId: req.user.userId,
            candidateId: candidate._id,
            action: "MANAGE_SKILLS",
            note: `Updated skill: ${skillId}`
        });

        return res.status(200).json({
            success: true,
            message: "Candidate skill updated successfully"
        });

    } catch (error) {
        console.error("Update candidate skill by admin error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Remove candidate skill
const removeCandidateSkillByAdmin = async (req, res) => {
    try {
        const { candidateId, skillId } = req.params;

        const candidate = await CandidateProfile.findById(candidateId);

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: "Candidate not found"
            });
        }

        const previousLength = candidate.skills.length;

        candidate.skills = candidate.skills.filter(
            (item) =>
                item.skillId.toString() !== skillId
        );

        if (candidate.skills.length === previousLength) {
            return res.status(404).json({
                success: false,
                message: "Candidate skill not found"
            });
        }

        await candidate.save();

        await AdminAction.create({
            adminId: req.user.userId,
            candidateId: candidate._id,
            action: "MANAGE_SKILLS",
            note: `Removed skill: ${skillId}`
        });

        return res.status(200).json({
            success: true,
            message: "Candidate skill removed successfully"
        });

    } catch (error) {
        console.error("Remove candidate skill by admin error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


export {
    getCandidateSkillsByAdmin,
    addCandidateSkillByAdmin,
    updateCandidateSkillByAdmin,
    removeCandidateSkillByAdmin
};