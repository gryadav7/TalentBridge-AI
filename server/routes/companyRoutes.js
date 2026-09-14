import express from "express";

import {
    createCompanyProfile,
    getCompanyProfile,
    updateCompanyProfile,
    uploadCompanyLogo,
    uploadVerificationDocuments
} from "../controllers/companyController.js";
import upload from "../config/multer.js";

import { authenticate } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();


// Create Company Profile
router.post(
    "/profile",
    authenticate,
    allowRoles("COMPANY"),
    createCompanyProfile
);


// Get Company Profile
router.get(
    "/profile",
    authenticate,
    allowRoles("COMPANY"),
    getCompanyProfile
);


// Update Company Profile
router.put(
    "/profile",
    authenticate,
    allowRoles("COMPANY"),
    updateCompanyProfile
);

// upload  logo route
router.post(
    "/logo",
    authenticate,
    allowRoles("COMPANY"),
    upload.single("logo"),
    uploadCompanyLogo
);

// upload docs route
router.post(
    "/verification-documents",
    authenticate,
    allowRoles("COMPANY"),
    upload.array("documents"),
    uploadVerificationDocuments
);

export default router;