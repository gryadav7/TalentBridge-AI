import express from "express";

import {
    createCandidateProfile,
    getCandidateProfile,
    updateCandidateProfile
} from "../controllers/candidateController.js";

import {
    addCandidateSkill,
    getCandidateSkills,
    updateCandidateSkill,
    removeCandidateSkill,
    addCustomCandidateSkill,
} from "../controllers/candidateSkillController.js";

import {
    searchJobs,
    getCandidateJobDetails
} from "../controllers/candidateJobController.js";



import upload from "../config/multer.js";
import { uploadResume } from "../controllers/resumeController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();


// Create Candidate Profile
router.post(
    "/profile",
    authenticate,
    allowRoles("CANDIDATE"),
    createCandidateProfile
);


// Get Candidate Profile
router.get(
    "/profile",
    authenticate,
    allowRoles("CANDIDATE"),
    getCandidateProfile
);


// Update Candidate Profile
router.put(
    "/profile",
    authenticate,
    allowRoles("CANDIDATE"),
    updateCandidateProfile
);

// resume

router.post(
    "/resume",
    authenticate,
    allowRoles("CANDIDATE"),
    upload.single("resume"),
    uploadResume
);


// post skills
router.post(
    "/skills",
    authenticate,
    allowRoles("CANDIDATE"),
    addCandidateSkill
);
// get skills
router.get(
    "/skills",
    authenticate,
    allowRoles("CANDIDATE"),
    getCandidateSkills
);

// update skills
router.put(
    "/skills/:skillId",
    authenticate,
    allowRoles("CANDIDATE"),
    updateCandidateSkill
);

// delete skills
router.delete(
    "/skills/:skillId",
    authenticate,
    allowRoles("CANDIDATE"),
    removeCandidateSkill
);


// custom skill

router.post(
    "/skills/custom",
    authenticate,
    allowRoles("CANDIDATE"),
    addCustomCandidateSkill
);

// Candidate Jobs

router.get(
    "/jobs",
    authenticate,
    allowRoles("CANDIDATE"),
    searchJobs
);


export default router;