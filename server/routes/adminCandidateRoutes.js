import express from "express";

import {
    getAllCandidates,
    getCandidateById,
    updateCandidateStatus,
    updateResumeStatus,
    deleteCandidate
} from "../controllers/adminCandidateController.js";



import {
    getCandidateSkillsByAdmin,
    addCandidateSkillByAdmin,
    updateCandidateSkillByAdmin,
    removeCandidateSkillByAdmin
} from "../controllers/adminCandidateSkillController.js";


import { authenticate } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();


// Get all candidates
router.get(
    "/",
    authenticate,
    allowRoles("ADMIN"),
    getAllCandidates
);


// Get candidate by ID
router.get(
    "/:candidateId",
    authenticate,
    allowRoles("ADMIN"),
    getCandidateById
);

// update candidate status
router.patch(
    "/:candidateId/status",
    authenticate,
    allowRoles("ADMIN"),
    updateCandidateStatus
);

// candidate resume update
router.patch(
    "/:candidateId/resume-status",
    authenticate,
    allowRoles("ADMIN"),
    updateResumeStatus
);

// delete candidate by admin
router.delete(
    "/:candidateId",
    authenticate,
    allowRoles("ADMIN"),
    deleteCandidate
);

// ROUTES :- skill handling of candidates by Admin

router.get(
    "/:candidateId/skills",
    authenticate,
    allowRoles("ADMIN"),
    getCandidateSkillsByAdmin
);

router.post(
    "/:candidateId/skills",
    authenticate,
    allowRoles("ADMIN"),
    addCandidateSkillByAdmin
);

router.put(
    "/:candidateId/skills/:skillId",
    authenticate,
    allowRoles("ADMIN"),
    updateCandidateSkillByAdmin
);

router.delete(
    "/:candidateId/skills/:skillId",
    authenticate,
    allowRoles("ADMIN"),
    removeCandidateSkillByAdmin
);


export default router;