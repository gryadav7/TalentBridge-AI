import express from "express";

import {
    getCompanyApplications,
    getJobApplications
} from "../controllers/companyApplicationController.js";

import { authenticate } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// All applications received by logged-in company
router.get(
    "/company",
    authenticate,
    allowRoles("COMPANY"),
    getCompanyApplications
);

// Applications for a specific company job
router.get(
    "/company/jobs/:jobId",
    authenticate,
    allowRoles("COMPANY"),
    getJobApplications
);

export default router;