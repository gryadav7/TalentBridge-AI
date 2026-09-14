import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        subcategory: {
            type: String,
            trim: true
        },

        aliases: [
            {
                type: String,
                trim: true
            }
        ],

        relatedSkills: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Skill"
            }
        ],

        industry: {
            type: String,
            trim: true
        },

        experienceLevel: {
            type: String,
            trim: true
        },

        status: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const Skill = mongoose.model("Skill", skillSchema);

export default Skill;