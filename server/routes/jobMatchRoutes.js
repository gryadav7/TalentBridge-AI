import express from "express";

import {
    createJobMatch,
    getJobMatch
} from "../controllers/jobMatchController.js";

import { authenticate } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();


// Create / update match
router.post(
    "/jobs/:jobId/candidates/:candidateId",
    authenticate,
    allowRoles("ADMIN"),
    createJobMatch
);


// Get match
router.get(
    "/jobs/:jobId/candidates/:candidateId",
    authenticate,
    allowRoles("ADMIN"),
    getJobMatch
);

export default router;