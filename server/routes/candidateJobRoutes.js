import express from "express";

import { searchJobs ,getCandidateJobDetails } from "../controllers/candidateJobController.js";

import { authenticate } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();


// Candidate Job Search
router.get(
    "/",
    authenticate,
    allowRoles("CANDIDATE"),
    searchJobs
);


router.get(
    "/:jobId",
    authenticate,
    allowRoles("CANDIDATE"),
    getCandidateJobDetails
);

export default router;