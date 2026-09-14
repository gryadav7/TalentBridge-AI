import express from "express";

import {
    getMySubscription,
    activateCandidatePlan,
    createCandidatePaymentOrder,
    verifyCandidatePayment
} from "../controllers/subscriptionController.js";

import { authenticate } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();



// Current subscription
router.get(
    "/me",
    authenticate,
    allowRoles("CANDIDATE"),
    getMySubscription
);


// Select candidate plan
router.post(
    "/candidate/activate",
    authenticate,
    allowRoles("CANDIDATE"),
    activateCandidatePlan
);

router.post(
    "/candidate/payment/order",
    authenticate,
    allowRoles("CANDIDATE"),
    createCandidatePaymentOrder
);


router.post(
    "/candidate/payment/verify",
    authenticate,
    allowRoles("CANDIDATE"),
    verifyCandidatePayment
);

export default router;