import Skill from "../models/Skill.js";

const getSkills = async (req, res) => {
    try {
        const skills = await Skill.find({
            status: { $ne: "INACTIVE" }
        })
        .sort({
            category: 1,
            name: 1
        });

        return res.status(200).json({
            success: true,
            skills
        });

    } catch (error) {
        console.error("Get skills error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export { getSkills };