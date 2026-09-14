import dotenv from "dotenv";
import mongoose from "mongoose";
import Skill from "../models/Skill.js";

dotenv.config();

const skills = [
    {
        name: "JavaScript",
        category: "Programming"
    },
    {
        name: "Python",
        category: "Programming"
    },
    {
        name: "Java",
        category: "Programming"
    },
    {
        name: "C",
        category: "Programming"
    },
    {
        name: "C++",
        category: "Programming"
    },
    {
        name: "PHP",
        category: "Programming"
    },
    {
        name: "C#",
        category: "Programming"
    },
    {
        name: "Go",
        category: "Programming"
    },
    {
        name: "Kotlin",
        category: "Programming"
    },

    {
        name: "React",
        category: "Frontend"
    },
    {
        name: "Angular",
        category: "Frontend"
    },
    {
        name: "Vue",
        category: "Frontend"
    },
    {
        name: "HTML",
        category: "Frontend"
    },
    {
        name: "CSS",
        category: "Frontend"
    },
    {
        name: "Tailwind",
        category: "Frontend"
    },

    {
        name: "Node.js",
        category: "Backend"
    },
    {
        name: "Express",
        category: "Backend"
    },
    {
        name: "Django",
        category: "Backend"
    },
    {
        name: "Spring Boot",
        category: "Backend"
    },
    {
        name: "Laravel",
        category: "Backend"
    },
    {
        name: ".NET",
        category: "Backend"
    },

    {
        name: "MongoDB",
        category: "Database"
    },
    {
        name: "MySQL",
        category: "Database"
    },
    {
        name: "PostgreSQL",
        category: "Database"
    },
    {
        name: "Redis",
        category: "Database"
    },
    {
        name: "Firebase",
        category: "Database"
    },

    {
        name: "AWS",
        category: "Cloud / DevOps"
    },
    {
        name: "Azure",
        category: "Cloud / DevOps"
    },
    {
        name: "GCP",
        category: "Cloud / DevOps"
    },
    {
        name: "Docker",
        category: "Cloud / DevOps"
    },
    {
        name: "Kubernetes",
        category: "Cloud / DevOps"
    },
    {
        name: "CI/CD",
        category: "Cloud / DevOps"
    },

    {
        name: "Git",
        category: "Other"
    },
    {
        name: "GitHub",
        category: "Other"
    },
    {
        name: "REST API",
        category: "Other"
    },
    {
        name: "GraphQL",
        category: "Other"
    },
    {
        name: "Microservices",
        category: "Other"
    },
    {
        name: "AI/ML",
        category: "Other"
    },
    {
        name: "Data Science",
        category: "Other"
    },
    {
        name: "Cyber Security",
        category: "Other"
    },
    {
        name: "Testing",
        category: "Other"
    }
];

const seedSkills = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        await Skill.deleteMany({});

        await Skill.insertMany(skills);

        console.log("Skills seeded successfully");

        await mongoose.disconnect();
    } catch (error) {
        console.error("Skill seeding failed:", error.message);
        process.exit(1);
    }
};

seedSkills();