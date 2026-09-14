import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import User from "../models/User.js";

const createAdmin = async () => {
    try {
        await connectDB();

        const email = "admin@technicaltalent.com";
        const password = "Admin@123456";

        const existingAdmin = await User.findOne({
            email
        });

        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(
            password,
            12
        );

        await User.create({
            name: "Admin",
            email,
            password: hashedPassword,
            role: "ADMIN"
        });

        console.log("Admin created successfully");

        await mongoose.connection.close();

        process.exit(0);

    } catch (error) {
        console.error("Admin creation failed:", error.message);
        process.exit(1);
    }
};

createAdmin();