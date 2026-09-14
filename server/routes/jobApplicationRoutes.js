import express from "express";

import {
    applyForJob,
    getMyApplications
} from "../controllers/jobApplicationController.js";

import { authenticate } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();


// Apply for a job
router.post(
    "/jobs/:jobId/apply",
    authenticate,
    allowRoles("CANDIDATE"),
    applyForJob
);


// Candidate's applications
router.get(
    "/my",
    authenticate,
    allowRoles("CANDIDATE"),
    getMyApplications
);


export default router;