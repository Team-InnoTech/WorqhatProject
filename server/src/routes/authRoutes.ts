import express from "express";
import { register, login, getProfile, sendOtp, verifyOtp, resetPassword } from "../controller/authController";
import { verifyToken } from "../middleware/authmiddleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", verifyToken, getProfile); 
router.post('/send-otp', sendOtp);
router.post('/verify-otp',verifyOtp);
router.post('/reset-password',resetPassword);

export default router;
