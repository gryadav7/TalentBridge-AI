import express from "express";

import {
    getAllJobsByAdmin,
    getJobByIdByAdmin,
    approveJob,
    rejectJob,
    requestJobChanges,
    pauseJob,
    expireJob
} from "../controllers/adminJobController.js";

import { authenticate } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();


// Get all jobs
router.get(
    "/",
    authenticate,
    allowRoles("ADMIN"),
    getAllJobsByAdmin
);


// Get single job
router.get(
    "/:jobId",
    authenticate,
    allowRoles("ADMIN"),
    getJobByIdByAdmin
);


// Approve
router.patch(
    "/:jobId/approve",
    authenticate,
    allowRoles("ADMIN"),
    approveJob
);


// Reject
router.patch(
    "/:jobId/reject",
    authenticate,
    allowRoles("ADMIN"),
    rejectJob
);


// Request changes
router.patch(
    "/:jobId/request-changes",
    authenticate,
    allowRoles("ADMIN"),
    requestJobChanges
);


// Pause
router.patch(
    "/:jobId/pause",
    authenticate,
    allowRoles("ADMIN"),
    pauseJob
);


// Expire
router.patch(
    "/:jobId/expire",
    authenticate,
    allowRoles("ADMIN"),
    expireJob
);

export default router;