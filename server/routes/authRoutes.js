import express from "express";
import { getCurrentUser, login, register, logout} from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login" ,login);
router.get("/me", authenticate, getCurrentUser);
router.post("/logout" ,logout)



export default router;