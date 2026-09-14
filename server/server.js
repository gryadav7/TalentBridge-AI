import dotenv from "dotenv";

dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";


const PORT = process.env.PORT || 8080;


const startServer = async () => {
    try {

        // Connect database
        await connectDB();

        // Start server
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {

        console.error("Server startup failed:", error.message);

        process.exit(1);
    }
};


startServer();