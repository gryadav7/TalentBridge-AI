import express from "express";

import {
    getAllCompanies,
    getCompanyById,
    updateCompanyStatus
} from "../controllers/adminCompanyController.js";

import { authenticate } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();


// Get all companies
router.get(
    "/",
    authenticate,
    allowRoles("ADMIN"),
    getAllCompanies
);


// Get company by ID
router.get(
    "/:companyId",
    authenticate,
    allowRoles("ADMIN"),
    getCompanyById
);


// Update company status
router.patch(
    "/:companyId/status",
    authenticate,
    allowRoles("ADMIN"),
    updateCompanyStatus
);

export default router;