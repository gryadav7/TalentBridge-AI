import express from "express";

import {
    createJob,
    getMyJobs,
    getJobById,
    updateJob
} from "../controllers/jobController.js";

import { authenticate } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();


// Create Job
router.post(
    "/",
    authenticate,
    allowRoles("COMPANY"),
    createJob
);


// Get Company's Jobs
router.get(
    "/my-jobs",
    authenticate,
    allowRoles("COMPANY"),
    getMyJobs
);


// Get Single Job
router.get(
    "/:jobId",
    authenticate,
    allowRoles("COMPANY"),
    getJobById
);


// Update Job
router.put(
    "/:jobId",
    authenticate,
    allowRoles("COMPANY"),
    updateJob
);

export default router;